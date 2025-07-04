import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendBookingReminder } from '@/lib/notifications'

export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request (optional security measure)
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get bookings that need reminders (24 hours from now)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const startOfDay = new Date(tomorrow)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(tomorrow)
    endOfDay.setHours(23, 59, 59, 999)

    const bookingsNeedingReminders = await prisma.booking.findMany({
      where: {
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: { in: ['PENDING', 'CONFIRMED'] },
        reminderSent: false,
      },
      include: {
        service: {
          include: {
            user: true,
          },
        },
      },
    })

    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    for (const booking of bookingsNeedingReminders) {
      try {
        const reminderData = {
          bookingId: booking.id,
          clientName: booking.clientName || booking.clientEmail,
          clientEmail: booking.clientEmail,
          serviceName: booking.service.name,
          startTime: booking.startTime,
          endTime: booking.endTime,
          businessName: booking.service.user.businessName || booking.service.user.name || 'Business',
          businessAddress: booking.service.user.businessAddress,
          totalAmount: booking.totalAmount,
        }

        let reminderSent = false

        // Send email reminder if enabled
        if (booking.service.user.emailNotifications) {
          try {
            await sendBookingReminder(reminderData)
            reminderSent = true
            console.log(`Email reminder sent for booking ${booking.id}`)
          } catch (emailError) {
            console.error(`Failed to send email reminder for booking ${booking.id}:`, emailError)
          }
        }

        // Send SMS reminder if enabled and phone number provided
        if (booking.service.user.smsNotifications && booking.clientPhone) {
          try {
            const { sendBookingReminderSMS } = await import('@/lib/notifications')
            await sendBookingReminderSMS(reminderData, booking.clientPhone)
            reminderSent = true
            console.log(`SMS reminder sent for booking ${booking.id}`)
          } catch (smsError) {
            console.error(`Failed to send SMS reminder for booking ${booking.id}:`, smsError)
          }
        }

        // Mark reminder as sent (even if both notifications are disabled to avoid repeated attempts)
        await prisma.booking.update({
          where: { id: booking.id },
          data: { reminderSent: true },
        })

        if (reminderSent) {
          successCount++
        } else {
          console.log(`Reminder skipped for booking ${booking.id} - notifications disabled`)
        }
      } catch (error) {
        errorCount++
        const errorMessage = `Failed to send reminder for booking ${booking.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
        errors.push(errorMessage)
        console.error(errorMessage)
      }
    }

    const response = {
      message: `Processed ${bookingsNeedingReminders.length} reminders`,
      success: successCount,
      errors: errorCount,
      errorDetails: errors.length > 0 ? errors : undefined,
    }

    console.log('Reminder cron job completed:', response)
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error processing reminders:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process reminders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
