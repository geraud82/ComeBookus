// Basic validation functions without external dependencies
export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: string[]
}

// Email validation
export function validateEmail(email: string): ValidationResult<string> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) {
    return { success: false, errors: ['Email is required'] }
  }
  if (!emailRegex.test(email)) {
    return { success: false, errors: ['Invalid email format'] }
  }
  return { success: true, data: email.toLowerCase().trim() }
}

// Password validation - strong password requirements
export function validatePassword(password: string): ValidationResult<string> {
  const errors: string[] = []
  
  if (!password) {
    return { success: false, errors: ['Password is required'] }
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  if (errors.length > 0) {
    return { success: false, errors }
  }
  
  return { success: true, data: password }
}

// Name validation
export function validateName(name: string): ValidationResult<string> {
  if (!name || name.trim().length === 0) {
    return { success: false, errors: ['Name is required'] }
  }
  
  const trimmedName = name.trim()
  
  if (trimmedName.length > 100) {
    return { success: false, errors: ['Name must be less than 100 characters'] }
  }
  
  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmedName)) {
    return { success: false, errors: ['Name contains invalid characters'] }
  }
  
  return { success: true, data: trimmedName }
}

// Business name validation
export function validateBusinessName(businessName: string): ValidationResult<string> {
  if (!businessName || businessName.trim().length === 0) {
    return { success: false, errors: ['Business name is required'] }
  }
  
  const trimmedName = businessName.trim()
  
  if (trimmedName.length > 200) {
    return { success: false, errors: ['Business name must be less than 200 characters'] }
  }
  
  if (!/^[a-zA-ZÀ-ÿ0-9\s'&.-]+$/.test(trimmedName)) {
    return { success: false, errors: ['Business name contains invalid characters'] }
  }
  
  return { success: true, data: trimmedName }
}

// Phone validation
export function validatePhone(phone: string): ValidationResult<string> {
  if (!phone || phone.trim().length === 0) {
    return { success: true, data: undefined } // Phone is optional
  }
  
  const cleanPhone = phone.replace(/\s+/g, '')
  
  if (!/^\+?[1-9]\d{1,14}$/.test(cleanPhone)) {
    return { success: false, errors: ['Invalid phone number format'] }
  }
  
  return { success: true, data: cleanPhone }
}

// User registration validation
export interface UserRegistrationData {
  email: string
  password: string
  name: string
  businessName?: string
  phone?: string
  businessType?: string
}

export function validateUserRegistration(data: any): ValidationResult<UserRegistrationData> {
  const errors: string[] = []
  const validatedData: Partial<UserRegistrationData> = {}
  
  // Validate email
  const emailResult = validateEmail(data.email)
  if (!emailResult.success) {
    errors.push(...(emailResult.errors || []))
  } else {
    validatedData.email = emailResult.data!
  }
  
  // Validate password
  const passwordResult = validatePassword(data.password)
  if (!passwordResult.success) {
    errors.push(...(passwordResult.errors || []))
  } else {
    validatedData.password = passwordResult.data!
  }
  
  // Validate name
  const nameResult = validateName(data.name)
  if (!nameResult.success) {
    errors.push(...(nameResult.errors || []))
  } else {
    validatedData.name = nameResult.data!
  }
  
  // Validate business name (optional)
  if (data.businessName) {
    const businessNameResult = validateBusinessName(data.businessName)
    if (!businessNameResult.success) {
      errors.push(...(businessNameResult.errors || []))
    } else {
      validatedData.businessName = businessNameResult.data!
    }
  }
  
  // Validate phone (optional)
  if (data.phone) {
    const phoneResult = validatePhone(data.phone)
    if (!phoneResult.success) {
      errors.push(...(phoneResult.errors || []))
    } else {
      validatedData.phone = phoneResult.data!
    }
  }
  
  // Validate business type
  const validBusinessTypes = ['SALON', 'BARBERSHOP', 'SPA', 'MASSAGE', 'BEAUTY', 'OTHER']
  if (data.businessType && !validBusinessTypes.includes(data.businessType)) {
    errors.push('Invalid business type')
  } else {
    validatedData.businessType = data.businessType || 'SALON'
  }
  
  if (errors.length > 0) {
    return { success: false, errors }
  }
  
  return { success: true, data: validatedData as UserRegistrationData }
}

// Sanitization functions
export function sanitizeString(input: string): string {
  if (!input) return ''
  return input.trim().replace(/[<>]/g, '')
}

export function sanitizeHtml(input: string): string {
  if (!input) return ''
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Service validation
export interface ServiceData {
  name: string
  description?: string
  duration: number
  price: number
  color: string
  category: string
  bufferTime?: number
  maxAdvanceBook?: number
}

export function validateService(data: any): ValidationResult<ServiceData> {
  const errors: string[] = []
  const validatedData: Partial<ServiceData> = {}
  
  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Service name is required')
  } else if (data.name.trim().length > 100) {
    errors.push('Service name too long')
  } else {
    validatedData.name = sanitizeString(data.name)
  }
  
  // Validate description (optional)
  if (data.description) {
    if (data.description.length > 500) {
      errors.push('Description too long')
    } else {
      validatedData.description = sanitizeString(data.description)
    }
  }
  
  // Validate duration
  const duration = parseInt(data.duration)
  if (isNaN(duration) || duration < 15) {
    errors.push('Duration must be at least 15 minutes')
  } else if (duration > 480) {
    errors.push('Duration cannot exceed 8 hours')
  } else {
    validatedData.duration = duration
  }
  
  // Validate price
  const price = parseFloat(data.price)
  if (isNaN(price) || price < 0) {
    errors.push('Price cannot be negative')
  } else if (price > 100000) {
    errors.push('Price too high')
  } else {
    validatedData.price = price
  }
  
  // Validate color
  if (!data.color || !/^#[0-9A-F]{6}$/i.test(data.color)) {
    errors.push('Invalid color format')
  } else {
    validatedData.color = data.color
  }
  
  // Validate category
  const validCategories = ['HAIR', 'BEAUTY', 'MASSAGE', 'SPA', 'NAILS', 'OTHER']
  if (!data.category || !validCategories.includes(data.category)) {
    errors.push('Invalid category')
  } else {
    validatedData.category = data.category
  }
  
  // Validate buffer time (optional)
  if (data.bufferTime !== undefined) {
    const bufferTime = parseInt(data.bufferTime)
    if (isNaN(bufferTime) || bufferTime < 0 || bufferTime > 120) {
      errors.push('Buffer time must be between 0 and 120 minutes')
    } else {
      validatedData.bufferTime = bufferTime
    }
  } else {
    validatedData.bufferTime = 0
  }
  
  // Validate max advance book (optional)
  if (data.maxAdvanceBook !== undefined) {
    const maxAdvanceBook = parseInt(data.maxAdvanceBook)
    if (isNaN(maxAdvanceBook) || maxAdvanceBook < 1 || maxAdvanceBook > 365) {
      errors.push('Max advance booking must be between 1 and 365 days')
    } else {
      validatedData.maxAdvanceBook = maxAdvanceBook
    }
  } else {
    validatedData.maxAdvanceBook = 30
  }
  
  if (errors.length > 0) {
    return { success: false, errors }
  }
  
  return { success: true, data: validatedData as ServiceData }
}

// Booking validation
export interface BookingData {
  serviceId: string
  startTime: string
  endTime: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  notes?: string
}

export function validateBooking(data: any): ValidationResult<BookingData> {
  const errors: string[] = []
  const validatedData: Partial<BookingData> = {}
  
  // Validate service ID
  if (!data.serviceId || typeof data.serviceId !== 'string') {
    errors.push('Invalid service ID')
  } else {
    validatedData.serviceId = data.serviceId
  }
  
  // Validate start time
  if (!data.startTime) {
    errors.push('Start time is required')
  } else {
    const startTime = new Date(data.startTime)
    if (isNaN(startTime.getTime())) {
      errors.push('Invalid start time')
    } else if (startTime <= new Date()) {
      errors.push('Booking time must be in the future')
    } else {
      validatedData.startTime = data.startTime
    }
  }
  
  // Validate end time
  if (!data.endTime) {
    errors.push('End time is required')
  } else {
    const endTime = new Date(data.endTime)
    if (isNaN(endTime.getTime())) {
      errors.push('Invalid end time')
    } else if (data.startTime && endTime <= new Date(data.startTime)) {
      errors.push('End time must be after start time')
    } else {
      validatedData.endTime = data.endTime
    }
  }
  
  // Validate client name
  const nameResult = validateName(data.clientName)
  if (!nameResult.success) {
    errors.push(...(nameResult.errors || []))
  } else {
    validatedData.clientName = nameResult.data!
  }
  
  // Validate client email
  const emailResult = validateEmail(data.clientEmail)
  if (!emailResult.success) {
    errors.push(...(emailResult.errors || []))
  } else {
    validatedData.clientEmail = emailResult.data!
  }
  
  // Validate client phone (optional)
  if (data.clientPhone) {
    const phoneResult = validatePhone(data.clientPhone)
    if (!phoneResult.success) {
      errors.push(...(phoneResult.errors || []))
    } else {
      validatedData.clientPhone = phoneResult.data!
    }
  }
  
  // Validate notes (optional)
  if (data.notes) {
    if (data.notes.length > 500) {
      errors.push('Notes too long')
    } else {
      validatedData.notes = sanitizeString(data.notes)
    }
  }
  
  if (errors.length > 0) {
    return { success: false, errors }
  }
  
  return { success: true, data: validatedData as BookingData }
}
