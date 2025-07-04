import { Resend } from 'resend'
import twilio from 'twilio'

// Email service using Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// SMS service using Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export interface BookingEmailData {
  clientName: string
  clientEmail: string
  serviceName: string
  startTime: Date
  endTime: Date
  businessName: string
  businessAddress?: string
  totalAmount?: number
}

export interface ReminderEmailData extends BookingEmailData {
  bookingId: string
}

// Email templates
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

export async function sendBookingReminder(data: ReminderEmailData) {
  const { clientName, clientEmail, serviceName, startTime, businessName } = data
  
  const subject = `Reminder: ${serviceName} appointment tomorrow`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Appointment Reminder</h2>
      <p>Hi ${clientName},</p>
      <p>This is a friendly reminder about your upcoming appointment with ${businessName}.</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Appointment Details</h3>
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>Date & Time:</strong> ${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString()}</p>
      </div>
      
      <p>Please let us know if you need to reschedule.</p>
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

// SMS functions
export async function sendBookingConfirmationSMS(data: BookingEmailData, clientPhone: string) {
  if (!process.env.TWILIO_PHONE_NUMBER || !clientPhone) {
    throw new Error('Missing Twilio phone number or client phone number')
  }

  const { clientName, serviceName, startTime, businessName } = data
  
  const message = `Hi ${clientName}! Your ${serviceName} appointment with ${businessName} is confirmed for ${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString()}. See you then!`
  
  return await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: clientPhone,
  })
}

export async function sendBookingReminderSMS(data: ReminderEmailData, clientPhone: string) {
  if (!process.env.TWILIO_PHONE_NUMBER || !clientPhone) {
    throw new Error('Missing Twilio phone number or client phone number')
  }

  const { clientName, serviceName, startTime, businessName } = data
  
  const message = `Reminder: ${clientName}, you have a ${serviceName} appointment with ${businessName} tomorrow at ${startTime.toLocaleTimeString()}. Looking forward to seeing you!`
  
  return await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: clientPhone,
  })
}

// Helper function to schedule reminders (you'd typically use a job queue for this)
export async function scheduleReminders(bookingId: string, reminderTime: Date) {
  // This is a simplified version - in production, you'd use a job queue like Bull or Agenda
  // For now, this is just a placeholder for the concept
  console.log(`Reminder scheduled for booking ${bookingId} at ${reminderTime}`)
  
  // You could implement this with:
  // 1. A cron job that checks for upcoming appointments
  // 2. A job queue system
  // 3. A third-party service like Zapier or n8n
  // 4. Database triggers
}
