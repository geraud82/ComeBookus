# Notification System Implementation

This document describes the complete notification system implementation for ComeBookUs, including email and SMS reminders.

## 🔔 Overview

The notification system provides:
- **Email confirmations** when bookings are created or payments succeed
- **SMS confirmations** when bookings are created or payments succeed  
- **Automated 24-hour reminders** via email and SMS
- **User preference controls** for enabling/disabling notifications
- **Graceful error handling** that doesn't break the booking flow

## 📧 Email Notifications

### Service Provider
- **Resend** - Modern email API service
- Reliable delivery with good reputation
- Simple integration and template support

### Email Types
1. **Booking Confirmation** - Sent immediately when booking is confirmed
2. **Payment Confirmation** - Sent when payment succeeds via Stripe webhook
3. **24-Hour Reminder** - Sent automatically via cron job

### Email Templates
Located in `backend/src/lib/notifications.ts`:
- Clean, responsive HTML templates
- Business branding support
- Booking details included
- Professional styling

## 📱 SMS Notifications

### Service Provider
- **Twilio** - Industry-standard SMS service
- Global coverage and reliable delivery
- Comprehensive API and error handling

### SMS Types
1. **Booking Confirmation** - Sent immediately when booking is confirmed
2. **Payment Confirmation** - Sent when payment succeeds
3. **24-Hour Reminder** - Sent automatically via cron job

### SMS Templates
- Concise, friendly messages
- Essential booking information only
- Business name and appointment details

## 🔄 Automated Reminder System

### Cron Job Implementation
- **Endpoint**: `/api/cron/reminders`
- **Schedule**: Daily at 9:00 AM (configurable)
- **Function**: Finds bookings 24 hours in advance and sends reminders

### Vercel Cron Configuration
```json
{
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Security
- Optional `CRON_SECRET` environment variable
- Bearer token authentication for cron endpoints
- Prevents unauthorized reminder triggering

## 🗄️ Database Integration

### Tracking Fields
The `Booking` model includes:
- `reminderSent: Boolean` - Prevents duplicate reminders
- `confirmationSent: Boolean` - Tracks confirmation status

### User Preferences
The `User` model includes:
- `emailNotifications: Boolean` - Controls email sending
- `smsNotifications: Boolean` - Controls SMS sending

## 🔧 Implementation Details

### File Structure
```
backend/src/
├── api/
│   ├── bookings/route.ts          # Booking creation with notifications
│   ├── cron/reminders/route.ts    # Automated reminder system
│   └── webhooks/stripe/route.ts   # Payment success notifications
└── lib/
    └── notifications.ts           # Core notification functions
```

### Key Functions

#### Email Functions
```typescript
sendBookingConfirmation(data: BookingEmailData)
sendBookingReminder(data: ReminderEmailData)
```

#### SMS Functions
```typescript
sendBookingConfirmationSMS(data: BookingEmailData, clientPhone: string)
sendBookingReminderSMS(data: ReminderEmailData, clientPhone: string)
```

### Integration Points

#### 1. Booking Creation (`/api/bookings`)
```typescript
// Send notifications if booking is confirmed
if (booking.status === 'CONFIRMED') {
  // Email notification
  if (service.user.emailNotifications) {
    await sendBookingConfirmation(notificationData)
  }
  
  // SMS notification
  if (service.user.smsNotifications && clientPhone) {
    await sendBookingConfirmationSMS(notificationData, clientPhone)
  }
}
```

#### 2. Payment Success (`/api/webhooks/stripe`)
```typescript
// Send notifications after payment confirmation
if (booking.service.user.emailNotifications) {
  await sendBookingConfirmation(notificationData)
}

if (booking.service.user.smsNotifications && booking.clientPhone) {
  await sendBookingConfirmationSMS(notificationData, booking.clientPhone)
}
```

#### 3. Automated Reminders (`/api/cron/reminders`)
```typescript
// Find bookings 24 hours in advance
const bookingsNeedingReminders = await prisma.booking.findMany({
  where: {
    startTime: { gte: startOfDay, lte: endOfDay },
    status: { in: ['PENDING', 'CONFIRMED'] },
    reminderSent: false,
  }
})

// Send reminders based on user preferences
for (const booking of bookingsNeedingReminders) {
  if (booking.service.user.emailNotifications) {
    await sendBookingReminder(reminderData)
  }
  
  if (booking.service.user.smsNotifications && booking.clientPhone) {
    await sendBookingReminderSMS(reminderData, booking.clientPhone)
  }
}
```

## 🌍 Environment Variables

### Required Variables
```env
# Email (Resend)
RESEND_API_KEY="re_..."

# SMS (Twilio)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"

# Optional Security
CRON_SECRET="your-secure-random-string"
```

### Service Setup

#### Resend Setup
1. Sign up at [resend.com](https://resend.com)
2. Create API key
3. Verify domain (optional, for custom from address)
4. Add `RESEND_API_KEY` to environment

#### Twilio Setup
1. Sign up at [twilio.com](https://twilio.com)
2. Get Account SID and Auth Token
3. Purchase phone number
4. Add credentials to environment

## 🚀 Deployment

### Vercel Deployment
1. Deploy backend with cron configuration
2. Set environment variables in Vercel dashboard
3. Cron jobs automatically enabled

### Alternative Deployment
For non-Vercel deployments:
1. Set up external cron service (cron-job.org, etc.)
2. Schedule daily GET request to `/api/cron/reminders`
3. Include `Authorization: Bearer ${CRON_SECRET}` header

## 🔍 Testing

### Manual Testing
```bash
# Test reminder endpoint
curl -X GET "https://your-backend.vercel.app/api/cron/reminders" \
  -H "Authorization: Bearer your-cron-secret"

# Test booking creation with notifications
curl -X POST "https://your-backend.vercel.app/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "service-id",
    "startTime": "2024-01-15T10:00:00Z",
    "clientEmail": "test@example.com",
    "clientName": "Test User",
    "clientPhone": "+1234567890"
  }'
```

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

## 📊 Monitoring

### Logging
- All notification attempts are logged
- Errors are captured but don't break booking flow
- Success/failure counts in cron job response

### Error Handling
```typescript
try {
  await sendBookingConfirmation(data)
} catch (emailError) {
  console.error('Error sending confirmation email:', emailError)
  // Booking continues successfully
}
```

### Metrics to Monitor
- Email delivery rates
- SMS delivery rates
- Cron job execution success
- Error rates by notification type

## 🎯 Best Practices

### 1. Graceful Degradation
- Never fail booking creation due to notification errors
- Log errors for debugging but continue processing

### 2. User Preferences
- Always check user notification preferences
- Respect opt-out settings

### 3. Rate Limiting
- Be mindful of SMS costs
- Implement rate limiting for high-volume scenarios

### 4. Template Management
- Keep templates simple and mobile-friendly
- Include unsubscribe options in emails
- Use business branding consistently

### 5. Security
- Validate phone numbers before SMS sending
- Use secure cron endpoints
- Sanitize user input in templates

## 🔮 Future Enhancements

### Advanced Features
1. **Multi-channel Preferences** - Let users choose channels per notification type
2. **Template Customization** - Allow businesses to customize email/SMS templates
3. **Timezone Support** - Send reminders in client's timezone
4. **Retry Logic** - Implement retry for failed notifications
5. **Notification Analytics** - Track delivery rates and engagement
6. **Push Notifications** - Add mobile app push notifications
7. **WhatsApp Integration** - Support WhatsApp Business API

### Template System
```typescript
interface NotificationTemplate {
  id: string
  userId: string
  type: 'confirmation' | 'reminder' | 'cancellation'
  channel: 'email' | 'sms'
  subject?: string
  body: string
  variables: string[]
}
```

### Analytics Schema
```typescript
interface NotificationLog {
  id: string
  bookingId: string
  type: 'email' | 'sms'
  status: 'sent' | 'failed' | 'delivered' | 'opened'
  provider: 'resend' | 'twilio'
  error?: string
  sentAt: Date
  deliveredAt?: Date
  openedAt?: Date
}
```

This notification system provides a robust foundation for customer communication while maintaining flexibility for future enhancements.
