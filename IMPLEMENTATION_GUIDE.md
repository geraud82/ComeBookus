# ComeBookUs Implementation Guide

## Email and SMS Reminders Implementation

This guide explains how to implement the email and SMS reminder system for ComeBookUs, triggered on booking creation and updates.

## 🔔 Notification System Architecture

### Overview
The notification system is built around three main triggers:
1. **Booking Creation** - Immediate confirmation
2. **Booking Updates** - Status or time changes
3. **Scheduled Reminders** - 24 hours before appointment

### Implementation Strategy

#### 1. Immediate Notifications (On Booking Creation/Update)

**Location**: `/src/app/api/bookings/route.ts` and `/src/app/api/bookings/[id]/route.ts`

```typescript
// In booking creation (POST /api/bookings)
if (booking.status === 'CONFIRMED') {
  try {
    await sendBookingConfirmation({
      clientName: clientName || clientEmail,
      clientEmail,
      serviceName: service.name,
      startTime: booking.startTime,
      endTime: booking.endTime,
      businessName: service.user.businessName || service.user.name || 'Business',
      businessAddress: service.user.businessAddress,
      totalAmount: service.price,
    })
  } catch (emailError) {
    console.error('Error sending confirmation email:', emailError)
    // Don't fail the booking if email fails
  }
}
```

#### 2. Scheduled Reminders Implementation

**Option A: Cron Job Approach (Recommended for MVP)**

Create a new API route for scheduled reminders:

```typescript
// /src/app/api/cron/reminders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendBookingReminder } from '@/lib/notifications'

export async function GET(request: NextRequest) {
  try {
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

    for (const booking of bookingsNeedingReminders) {
      try {
        // Send email reminder
        await sendBookingReminder({
          bookingId: booking.id,
          clientName: booking.clientName || booking.clientEmail,
          clientEmail: booking.clientEmail,
          serviceName: booking.service.name,
          startTime: booking.startTime,
          endTime: booking.endTime,
          businessName: booking.service.user.businessName || booking.service.user.name || 'Business',
          businessAddress: booking.service.user.businessAddress,
          totalAmount: booking.totalAmount,
        })

        // Mark reminder as sent
        await prisma.booking.update({
          where: { id: booking.id },
          data: { reminderSent: true },
        })

        console.log(`Reminder sent for booking ${booking.id}`)
      } catch (error) {
        console.error(`Failed to send reminder for booking ${booking.id}:`, error)
      }
    }

    return NextResponse.json({ 
      message: `Processed ${bookingsNeedingReminders.length} reminders` 
    })
  } catch (error) {
    console.error('Error processing reminders:', error)
    return NextResponse.json(
      { error: 'Failed to process reminders' },
      { status: 500 }
    )
  }
}
```

**Option B: Database Triggers (Advanced)**

For production environments, you can use database triggers or scheduled functions:

```sql
-- PostgreSQL function to send reminders
CREATE OR REPLACE FUNCTION send_booking_reminders()
RETURNS void AS $$
BEGIN
  -- Logic to identify bookings needing reminders
  -- Call external API or queue system
END;
$$ LANGUAGE plpgsql;

-- Schedule the function
SELECT cron.schedule('send-reminders', '0 9 * * *', 'SELECT send_booking_reminders();');
```

**Option C: Queue System (Production Ready)**

For high-volume applications, use a job queue system:

```typescript
// Using Bull Queue or similar
import Queue from 'bull'

const reminderQueue = new Queue('reminder processing')

// Schedule reminder when booking is created
reminderQueue.add('send-reminder', {
  bookingId: booking.id,
  sendAt: new Date(booking.startTime.getTime() - 24 * 60 * 60 * 1000) // 24 hours before
}, {
  delay: new Date(booking.startTime.getTime() - 24 * 60 * 60 * 1000).getTime() - Date.now()
})
```

## 📧 Email Implementation Details

### Service Configuration

**File**: `/src/lib/notifications.ts`

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendBookingConfirmation(data: BookingEmailData) {
  const { clientName, clientEmail, serviceName, startTime, businessName, totalAmount } = data
  
  const subject = `Booking Confirmation - ${serviceName}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Booking Confirmed!</h2>
      <p>Hi ${clientName},</p>
      <p>Your booking has been confirmed with ${businessName}.</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Booking Details</h3>
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>Date & Time:</strong> ${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString()}</p>
        ${totalAmount ? `<p><strong>Total:</strong> $${(totalAmount / 100).toFixed(2)}</p>` : ''}
      </div>
      
      <p>We look forward to seeing you!</p>
      <p>Best regards,<br>${businessName}</p>
    </div>
  `

  return await resend.emails.send({
    from: 'ComeBookUs <noreply@comebookus.com>',
    to: [clientEmail],
    subject,
    html,
  })
}
```

### Email Templates

Create reusable email templates:

```typescript
// Email template system
export const emailTemplates = {
  confirmation: (data: BookingEmailData) => ({
    subject: `Booking Confirmation - ${data.serviceName}`,
    html: confirmationTemplate(data),
  }),
  reminder: (data: ReminderEmailData) => ({
    subject: `Reminder: ${data.serviceName} appointment tomorrow`,
    html: reminderTemplate(data),
  }),
  cancellation: (data: BookingEmailData) => ({
    subject: `Booking Cancelled - ${data.serviceName}`,
    html: cancellationTemplate(data),
  }),
}
```

## 📱 SMS Implementation Details

### Twilio Configuration

```typescript
import twilio from 'twilio'

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function sendBookingConfirmationSMS(data: BookingEmailData, phoneNumber: string) {
  const { clientName, serviceName, startTime, businessName } = data
  
  const message = `Hi ${clientName}! Your ${serviceName} appointment with ${businessName} is confirmed for ${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString()}. See you then!`
  
  return await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber,
  })
}
```

### SMS Templates

```typescript
export const smsTemplates = {
  confirmation: (data: BookingEmailData) => 
    `Hi ${data.clientName}! Your ${data.serviceName} appointment with ${data.businessName} is confirmed for ${data.startTime.toLocaleDateString()} at ${data.startTime.toLocaleTimeString()}. See you then!`,
  
  reminder: (data: ReminderEmailData) => 
    `Reminder: ${data.clientName}, you have a ${data.serviceName} appointment with ${data.businessName} tomorrow at ${data.startTime.toLocaleTimeString()}. Looking forward to seeing you!`,
  
  cancellation: (data: BookingEmailData) => 
    `Your ${data.serviceName} appointment with ${data.businessName} on ${data.startTime.toLocaleDateString()} has been cancelled. Contact us if you have questions.`,
}
```

## 🔄 Integration Points

### 1. Booking Creation Flow

```typescript
// In /src/app/api/bookings/route.ts
const booking = await prisma.booking.create({
  data: bookingData,
  include: { service: { include: { user: true } } }
})

// Send immediate notifications
if (booking.status === 'CONFIRMED') {
  // Email notification
  if (booking.service.user.emailNotifications) {
    await sendBookingConfirmation(emailData)
  }
  
  // SMS notification (if phone number provided)
  if (booking.service.user.smsNotifications && booking.clientPhone) {
    await sendBookingConfirmationSMS(emailData, booking.clientPhone)
  }
}

// Schedule reminder
await scheduleReminder(booking.id, booking.startTime)
```

### 2. Payment Success Flow

```typescript
// In /src/app/api/webhooks/stripe/route.ts
async function handlePaymentSuccess(paymentIntent: any) {
  const booking = await prisma.booking.update({
    where: { stripePaymentId: paymentIntent.id },
    data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
    include: { service: { include: { user: true } } }
  })

  // Send confirmation after payment
  await sendBookingConfirmation(emailData)
  
  // Schedule reminder
  await scheduleReminder(booking.id, booking.startTime)
}
```

## 🚀 Deployment Considerations

### Environment Variables

```env
# Email (Resend)
RESEND_API_KEY="re_..."

# SMS (Twilio)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

### Cron Job Setup

**Vercel**: Use Vercel Cron Jobs
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

**Railway/Heroku**: Use external cron services like cron-job.org

**Self-hosted**: Use system cron
```bash
# Add to crontab
0 9 * * * curl https://yourdomain.com/api/cron/reminders
```

## 🔧 Testing

### Email Testing
```typescript
// Test email sending
const testEmailData = {
  clientName: 'John Doe',
  clientEmail: 'john@example.com',
  serviceName: 'Haircut',
  startTime: new Date(),
  endTime: new Date(),
  businessName: 'Test Salon',
}

await sendBookingConfirmation(testEmailData)
```

### SMS Testing
```typescript
// Test SMS sending
await sendBookingConfirmationSMS(testEmailData, '+1234567890')
```

## 📊 Monitoring and Analytics

### Notification Tracking
```typescript
// Add to Prisma schema
model NotificationLog {
  id        String   @id @default(cuid())
  bookingId String
  type      String   // 'email' | 'sms'
  status    String   // 'sent' | 'failed'
  provider  String   // 'resend' | 'twilio'
  error     String?
  sentAt    DateTime @default(now())
  
  booking   Booking  @relation(fields: [bookingId], references: [id])
}
```

### Error Handling
```typescript
try {
  await sendBookingConfirmation(data)
  await logNotification(bookingId, 'email', 'sent', 'resend')
} catch (error) {
  await logNotification(bookingId, 'email', 'failed', 'resend', error.message)
  // Don't fail the booking process
}
```

## 🎯 Best Practices

1. **Graceful Degradation**: Never fail booking creation due to notification errors
2. **Rate Limiting**: Implement rate limiting for SMS to avoid costs
3. **Unsubscribe**: Include unsubscribe links in emails
4. **Personalization**: Use client names and business branding
5. **Timezone Handling**: Convert times to client's timezone
6. **Retry Logic**: Implement retry for failed notifications
7. **Cost Monitoring**: Monitor SMS costs and usage

## 🔮 Advanced Features

### Multi-channel Notifications
```typescript
interface NotificationPreferences {
  email: boolean
  sms: boolean
  push: boolean
  channels: {
    confirmation: ('email' | 'sms')[]
    reminder: ('email' | 'sms')[]
    cancellation: ('email' | 'sms')[]
  }
}
```

### Template Customization
```typescript
// Allow users to customize email templates
model EmailTemplate {
  id         String @id @default(cuid())
  userId     String
  type       String // 'confirmation' | 'reminder' | 'cancellation'
  subject    String
  htmlBody   String
  variables  Json   // Available template variables
  
  user       User   @relation(fields: [userId], references: [id])
}
```

This implementation provides a robust, scalable notification system that can grow with your application's needs.
