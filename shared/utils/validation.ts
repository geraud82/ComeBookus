import { z } from 'zod'

// Email validation
export const emailSchema = z.string().email('Invalid email format').min(1, 'Email is required')

// Password validation - strong password requirements
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

// Phone validation
export const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .optional()

// Name validation
export const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Name contains invalid characters')

// Business name validation
export const businessNameSchema = z.string()
  .min(1, 'Business name is required')
  .max(200, 'Business name must be less than 200 characters')
  .regex(/^[a-zA-ZÀ-ÿ0-9\s'&.-]+$/, 'Business name contains invalid characters')

// Service validation schemas
export const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required').max(100, 'Service name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  duration: z.number().min(15, 'Duration must be at least 15 minutes').max(480, 'Duration cannot exceed 8 hours'),
  price: z.number().min(0, 'Price cannot be negative').max(100000, 'Price too high'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  category: z.enum(['HAIR', 'BEAUTY', 'MASSAGE', 'SPA', 'NAILS', 'OTHER']),
  bufferTime: z.number().min(0).max(120).default(0),
  maxAdvanceBook: z.number().min(1).max(365).default(30)
})

// Booking validation schemas
export const bookingSchema = z.object({
  serviceId: z.string().cuid('Invalid service ID'),
  startTime: z.string().datetime('Invalid start time'),
  endTime: z.string().datetime('Invalid end time'),
  clientName: nameSchema,
  clientEmail: emailSchema,
  clientPhone: phoneSchema,
  notes: z.string().max(500, 'Notes too long').optional()
}).refine(data => {
  const start = new Date(data.startTime)
  const end = new Date(data.endTime)
  return end > start
}, {
  message: 'End time must be after start time',
  path: ['endTime']
}).refine(data => {
  const start = new Date(data.startTime)
  const now = new Date()
  return start > now
}, {
  message: 'Booking time must be in the future',
  path: ['startTime']
})

// User registration schema
export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  businessName: businessNameSchema.optional(),
  phone: phoneSchema,
  businessType: z.enum(['SALON', 'BARBERSHOP', 'SPA', 'MASSAGE', 'BEAUTY', 'OTHER']).default('SALON')
})

// User profile update schema
export const userProfileSchema = z.object({
  name: nameSchema.optional(),
  businessName: businessNameSchema.optional(),
  businessAddress: z.string().max(300, 'Address too long').optional(),
  businessPhone: phoneSchema,
  businessWebsite: z.string().url('Invalid website URL').optional(),
  businessType: z.enum(['SALON', 'BARBERSHOP', 'SPA', 'MASSAGE', 'BEAUTY', 'OTHER']).optional(),
  timezone: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  bookingPageTitle: z.string().max(100, 'Title too long').optional(),
  bookingPageBio: z.string().max(500, 'Bio too long').optional()
})

// Sanitization functions
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Input validation middleware
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return { success: false, errors }
    }
    return { success: false, errors: ['Validation failed'] }
  }
}

// Rate limiting helpers
export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

export const rateLimitConfigs = {
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 requests per 15 minutes
  api: { windowMs: 15 * 60 * 1000, maxRequests: 100 }, // 100 requests per 15 minutes
  booking: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 bookings per minute
  search: { windowMs: 60 * 1000, maxRequests: 30 } // 30 searches per minute
}

// CSRF token validation
export function generateCSRFToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken && token.length === 64
}
