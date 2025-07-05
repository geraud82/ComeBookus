import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function rateLimit(ip: string, limit: number = 50, windowMs: number = 15 * 60 * 1000): boolean {
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

// Input validation functions
function validateServiceInput(data: any) {
  const errors: string[] = []
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Service name is required')
  } else if (data.name.length > 100) {
    errors.push('Service name too long')
  }
  
  if (data.description && data.description.length > 500) {
    errors.push('Description too long')
  }
  
  const duration = parseInt(data.duration)
  if (isNaN(duration) || duration < 15 || duration > 480) {
    errors.push('Duration must be between 15 and 480 minutes')
  }
  
  const price = parseFloat(data.price)
  if (isNaN(price) || price < 0 || price > 100000) {
    errors.push('Invalid price')
  }
  
  if (data.color && !/^#[0-9A-F]{6}$/i.test(data.color)) {
    errors.push('Invalid color format')
  }
  
  const validCategories = ['HAIR', 'BEAUTY', 'MASSAGE', 'SPA', 'NAILS', 'OTHER']
  if (data.category && !validCategories.includes(data.category)) {
    errors.push('Invalid category')
  }
  
  return errors
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

// GET /api/services - Get user's services
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const services = await prisma.service.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/services - Create a new service
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!rateLimit(ip as string, 20)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const supabase = createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate input
    const validationErrors = validateServiceInput(body)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      )
    }

    const {
      name,
      description,
      duration,
      price,
      color = '#3B82F6',
      category = 'HAIR',
      bufferTime = 0,
      maxAdvanceBook = 30,
    } = body

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name)
    const sanitizedDescription = description ? sanitizeInput(description) : null

    // Convert price to cents if it's in dollars
    const priceInCents = Math.round(parseFloat(price) * 100)

    const service = await prisma.service.create({
      data: {
        name: sanitizedName,
        description: sanitizedDescription,
        duration: parseInt(duration),
        price: priceInCents,
        color,
        category,
        bufferTime: parseInt(bufferTime),
        maxAdvanceBook: parseInt(maxAdvanceBook),
        userId: user.id,
      },
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
