import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendBookingConfirmation } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  const booking = await prisma.booking.findFirst({
    where: {
      stripePaymentId: paymentIntent.id,
    },
    include: {
      service: {
        include: {
          user: true,
        },
      },
    },
  })

  if (!booking) {
    console.error('Booking not found for payment intent:', paymentIntent.id)
    return
  }

  // Update booking status
  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      paymentStatus: 'PAID',
      status: 'CONFIRMED',
    },
  })

  // Send confirmation notifications
  const notificationData = {
    clientName: booking.clientName || booking.clientEmail,
    clientEmail: booking.clientEmail,
    serviceName: booking.service.name,
    startTime: booking.startTime,
    endTime: booking.endTime,
    businessName: booking.service.user.businessName || booking.service.user.name || 'Business',
    businessAddress: booking.service.user.businessAddress,
    totalAmount: booking.totalAmount,
  }

  // Send email confirmation if enabled
  if (booking.service.user.emailNotifications) {
    try {
      await sendBookingConfirmation(notificationData)
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
    }
  }

  // Send SMS confirmation if enabled and phone number provided
  if (booking.service.user.smsNotifications && booking.clientPhone) {
    try {
      const { sendBookingConfirmationSMS } = await import('@/lib/notifications')
      await sendBookingConfirmationSMS(notificationData, booking.clientPhone)
    } catch (smsError) {
      console.error('Error sending confirmation SMS:', smsError)
    }
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  const booking = await prisma.booking.findFirst({
    where: {
      stripePaymentId: paymentIntent.id,
    },
  })

  if (!booking) {
    console.error('Booking not found for payment intent:', paymentIntent.id)
    return
  }

  // Update booking status
  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      paymentStatus: 'FAILED',
      status: 'CANCELLED',
    },
  })
}
