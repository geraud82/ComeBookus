import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { validateUserRegistration, sanitizeString } from '@/lib/validation'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function rateLimit(ip: string, limit: number = 30, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const key = `${ip}-${Math.floor(now / windowMs)}`
  
  const current = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs }
  
  if (now > current.resetTime) {
    rateLimitStore.delete(key)
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (current.count >= limit) {
    return false
  }
  
  current.count++
  rateLimitStore.set(key, current)
  return true
}

// Validate profile update data
function validateProfileUpdate(data: any) {
  const errors: string[] = []
  
  if (data.name && (typeof data.name !== 'string' || data.name.length > 100)) {
    errors.push('Invalid name')
  }
  
  if (data.businessName && (typeof data.businessName !== 'string' || data.businessName.length > 200)) {
    errors.push('Invalid business name')
  }
  
  if (data.businessAddress && (typeof data.businessAddress !== 'string' || data.businessAddress.length > 300)) {
    errors.push('Invalid business address')
  }
  
  if (data.businessPhone && (typeof data.businessPhone !== 'string' || !/^\+?[1-9]\d{1,14}$/.test(data.businessPhone.replace(/\s+/g, '')))) {
    errors.push('Invalid business phone')
  }
  
  if (data.businessWebsite && (typeof data.businessWebsite !== 'string' || !isValidUrl(data.businessWebsite))) {
    errors.push('Invalid business website URL')
  }
  
  if (data.businessType && !['SALON', 'BARBERSHOP', 'SPA', 'MASSAGE', 'BEAUTY', 'OTHER'].includes(data.businessType)) {
    errors.push('Invalid business type')
  }
  
  if (data.bookingPageSlug && (typeof data.bookingPageSlug !== 'string' || !/^[a-z0-9-]+$/.test(data.bookingPageSlug))) {
    errors.push('Invalid booking page slug (only lowercase letters, numbers, and hyphens allowed)')
  }
  
  if (data.bookingPageTitle && (typeof data.bookingPageTitle !== 'string' || data.bookingPageTitle.length > 100)) {
    errors.push('Invalid booking page title')
  }
  
  if (data.bookingPageBio && (typeof data.bookingPageBio !== 'string' || data.bookingPageBio.length > 500)) {
    errors.push('Invalid booking page bio')
  }
  
  return errors
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

// GET /api/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!rateLimit(ip as string, 50)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        businessName: true,
        businessAddress: true,
        businessPhone: true,
        businessWebsite: true,
        businessType: true,
        timezone: true,
        emailNotifications: true,
        smsNotifications: true,
        bookingPageSlug: true,
        bookingPageEnabled: true,
        bookingPageTitle: true,
        bookingPageBio: true,
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!rateLimit(ip as string, 10)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate input
    const validationErrors = validateProfileUpdate(body)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      )
    }

    // Check if booking page slug is unique (if provided)
    if (body.bookingPageSlug) {
      const existingUser = await prisma.user.findFirst({
        where: {
          bookingPageSlug: body.bookingPageSlug,
          id: { not: user.id },
        },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Booking page URL is already taken' },
          { status: 400 }
        )
      }
    }

    // Sanitize string inputs
    const updateData: any = {}
    
    if (body.name !== undefined) {
      updateData.name = body.name ? sanitizeString(body.name) : null
    }
    
    if (body.businessName !== undefined) {
      updateData.businessName = body.businessName ? sanitizeString(body.businessName) : null
    }
    
    if (body.businessAddress !== undefined) {
      updateData.businessAddress = body.businessAddress ? sanitizeString(body.businessAddress) : null
    }
    
    if (body.businessPhone !== undefined) {
      updateData.businessPhone = body.businessPhone ? sanitizeString(body.businessPhone) : null
    }
    
    if (body.businessWebsite !== undefined) {
      updateData.businessWebsite = body.businessWebsite ? sanitizeString(body.businessWebsite) : null
    }
    
    if (body.businessType !== undefined) {
      updateData.businessType = body.businessType
    }
    
    if (body.timezone !== undefined) {
      updateData.timezone = body.timezone
    }
    
    if (body.emailNotifications !== undefined) {
      updateData.emailNotifications = Boolean(body.emailNotifications)
    }
    
    if (body.smsNotifications !== undefined) {
      updateData.smsNotifications = Boolean(body.smsNotifications)
    }
    
    if (body.bookingPageSlug !== undefined) {
      updateData.bookingPageSlug = body.bookingPageSlug ? sanitizeString(body.bookingPageSlug.toLowerCase()) : null
    }
    
    if (body.bookingPageEnabled !== undefined) {
      updateData.bookingPageEnabled = Boolean(body.bookingPageEnabled)
    }
    
    if (body.bookingPageTitle !== undefined) {
      updateData.bookingPageTitle = body.bookingPageTitle ? sanitizeString(body.bookingPageTitle) : null
    }
    
    if (body.bookingPageBio !== undefined) {
      updateData.bookingPageBio = body.bookingPageBio ? sanitizeString(body.bookingPageBio) : null
    }

    const updatedProfile = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        businessName: true,
        businessAddress: true,
        businessPhone: true,
        businessWebsite: true,
        businessType: true,
        timezone: true,
        emailNotifications: true,
        smsNotifications: true,
        bookingPageSlug: true,
        bookingPageEnabled: true,
        bookingPageTitle: true,
        bookingPageBio: true,
      },
    })

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
