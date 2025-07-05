import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { validateEmail, validateName, validatePhone, sanitizeString } from '@/lib/validation'

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

// Validate client data
function validateClientData(data: any) {
  const errors: string[] = []
  
  // Validate email
  const emailResult = validateEmail(data.email)
  if (!emailResult.success) {
    errors.push(...(emailResult.errors || []))
  }
  
  // Validate name
  const nameResult = validateName(data.name)
  if (!nameResult.success) {
    errors.push(...(nameResult.errors || []))
  }
  
  // Validate phone (optional)
  if (data.phone) {
    const phoneResult = validatePhone(data.phone)
    if (!phoneResult.success) {
      errors.push(...(phoneResult.errors || []))
    }
  }
  
  // Validate notes (optional)
  if (data.notes && (typeof data.notes !== 'string' || data.notes.length > 500)) {
    errors.push('Notes must be less than 500 characters')
  }
  
  return errors
}

// GET /api/clients - Get user's clients
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

    const clients = await prisma.client.findMany({
      where: {
        userId: user.id,
      },
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
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
    const validationErrors = validateClientData(body)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      )
    }

    const { name, email, phone, notes } = body

    // Check if client already exists for this user
    const existingClient = await prisma.client.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        userId: user.id,
      },
    })

    if (existingClient) {
      return NextResponse.json(
        { error: 'A client with this email already exists' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedName = sanitizeString(name)
    const sanitizedEmail = email.toLowerCase().trim()
    const sanitizedPhone = phone ? sanitizeString(phone) : null
    const sanitizedNotes = notes ? sanitizeString(notes) : null

    const client = await prisma.client.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        notes: sanitizedNotes,
        userId: user.id,
      },
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
