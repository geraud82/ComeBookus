import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase'
import { sendBookingConfirmation } from '@/lib/notifications'
import { createPaymentIntent } from '@/lib/stripe'

// GET /api/bookings - Get user's bookings
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const whereClause: any = {
      userId: user.id,
    }

    if (startDate && endDate) {
      whereClause.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        service: true,
        client: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      serviceId,
      startTime,
      clientEmail,
      clientName,
      clientPhone,
      notes,
      requiresPayment = false,
    } = body

    // For public bookings, we don't require authentication
    // For authenticated users, we get the user ID from Supabase
    const supabase = createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Get service details to determine the user and calculate end time
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { user: true },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    const endTime = new Date(new Date(startTime).getTime() + service.duration * 60000)

    // Check for conflicts
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        userId: service.userId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            startTime: { lte: new Date(startTime) },
            endTime: { gt: new Date(startTime) },
          },
          {
            startTime: { lt: endTime },
            endTime: { gte: endTime },
          },
          {
            startTime: { gte: new Date(startTime) },
            endTime: { lte: endTime },
          },
        ],
      },
    })

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'Time slot is already booked' },
        { status: 409 }
      )
    }

    // Find or create client
    let client = await prisma.client.findUnique({
      where: {
        email_userId: {
          email: clientEmail,
          userId: service.userId,
        },
      },
    })

    if (!client) {
      client = await prisma.client.create({
        data: {
          email: clientEmail,
          name: clientName,
          phone: clientPhone,
          userId: service.userId,
        },
      })
    }

    // Create payment intent if payment is required
    let paymentIntent = null
    if (requiresPayment && service.price > 0) {
      paymentIntent = await createPaymentIntent(service.price, {
        serviceId: service.id,
        clientEmail,
        clientName: clientName || '',
      })
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: service.userId,
        serviceId: service.id,
        clientId: client.id,
        startTime: new Date(startTime),
        endTime,
        clientEmail,
        clientName,
        clientPhone,
        notes,
        totalAmount: service.price,
        stripePaymentId: paymentIntent?.id,
        paymentStatus: requiresPayment ? 'PENDING' : 'PAID',
        status: requiresPayment ? 'PENDING' : 'CONFIRMED',
      },
      include: {
        service: true,
        client: true,
      },
    })

    // Send confirmation notifications if booking is confirmed
    if (booking.status === 'CONFIRMED') {
      const notificationData = {
        clientName: clientName || clientEmail,
        clientEmail,
        serviceName: service.name,
        startTime: booking.startTime,
        endTime: booking.endTime,
        businessName: service.user.businessName || service.user.name || 'Business',
        businessAddress: service.user.businessAddress,
        totalAmount: service.price,
      }

      // Send email confirmation if enabled
      if (service.user.emailNotifications) {
        try {
          await sendBookingConfirmation(notificationData)
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError)
          // Don't fail the booking if email fails
        }
      }

      // Send SMS confirmation if enabled and phone number provided
      if (service.user.smsNotifications && clientPhone) {
        try {
          const { sendBookingConfirmationSMS } = await import('@/lib/notifications')
          await sendBookingConfirmationSMS(notificationData, clientPhone)
        } catch (smsError) {
          console.error('Error sending confirmation SMS:', smsError)
          // Don't fail the booking if SMS fails
        }
      }
    }

    return NextResponse.json({
      booking,
      paymentIntent: paymentIntent ? {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      } : null,
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
