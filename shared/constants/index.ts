// Booking Status Constants
export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  NO_SHOW: 'NO_SHOW'
} as const;

// Payment Status Constants
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
} as const;

// Default Service Colors
export const SERVICE_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280'  // Gray
] as const;

// Time Constants
export const TIME_CONSTANTS = {
  MINUTES_PER_HOUR: 60,
  HOURS_PER_DAY: 24,
  DAYS_PER_WEEK: 7,
  DEFAULT_BUFFER_TIME: 15, // minutes
  DEFAULT_MAX_ADVANCE_BOOK: 30, // days
  REMINDER_HOURS_BEFORE: 24 // hours
} as const;

// Business Hours
export const DEFAULT_BUSINESS_HOURS = {
  monday: { start: '09:00', end: '17:00', enabled: true },
  tuesday: { start: '09:00', end: '17:00', enabled: true },
  wednesday: { start: '09:00', end: '17:00', enabled: true },
  thursday: { start: '09:00', end: '17:00', enabled: true },
  friday: { start: '09:00', end: '17:00', enabled: true },
  saturday: { start: '10:00', end: '16:00', enabled: false },
  sunday: { start: '10:00', end: '16:00', enabled: false }
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  BOOKING_CONFIRMATION: 'booking_confirmation',
  BOOKING_REMINDER: 'booking_reminder',
  BOOKING_CANCELLED: 'booking_cancelled',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed'
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  BOOKINGS: '/api/bookings',
  SERVICES: '/api/services',
  DASHBOARD: '/api/dashboard',
  PUBLIC: '/api/public',
  WEBHOOKS: '/api/webhooks'
} as const;

// Validation Constants
export const VALIDATION = {
  MIN_SERVICE_DURATION: 15, // minutes
  MAX_SERVICE_DURATION: 480, // minutes (8 hours)
  MIN_SERVICE_PRICE: 0, // cents
  MAX_SERVICE_PRICE: 100000, // cents ($1000)
  MAX_SERVICE_NAME_LENGTH: 100,
  MAX_SERVICE_DESCRIPTION_LENGTH: 500,
  MAX_CLIENT_NAME_LENGTH: 100,
  MAX_BOOKING_NOTES_LENGTH: 1000
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY_DATE: 'MMM dd, yyyy',
  DISPLAY_TIME: 'h:mm a',
  DISPLAY_DATETIME: 'MMM dd, yyyy h:mm a',
  ISO_DATE: 'yyyy-MM-dd',
  ISO_TIME: 'HH:mm'
} as const;
