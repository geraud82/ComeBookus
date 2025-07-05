import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function rateLimit(ip: string, limit: number = 20, windowMs: number = 15 * 60 * 1000): boolean {
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

// DELETE /api/clients/[id] - Delete a client
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const clientId = params.id

    // Validate client ID format
    if (!clientId || typeof clientId !== 'string') {
      return NextResponse.json({ error: 'Invalid client ID' }, { status: 400 })
    }

    // Check if client exists and belongs to the user
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
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

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Check if client has bookings
    if (client._count.bookings > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete client with existing bookings. Please cancel or complete all bookings first.' 
        },
        { status: 400 }
      )
    }

    // Delete the client
    await prisma.client.delete({
      where: {
        id: clientId,
      },
    })

    return NextResponse.json({ message: 'Client deleted successfully' })
  } catch (error) {
    console.error('Error deleting client:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/clients/[id] - Get a specific client
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const clientId = params.id

    // Validate client ID format
    if (!clientId || typeof clientId !== 'string') {
      return NextResponse.json({ error: 'Invalid client ID' }, { status: 400 })
    }

    // Get client with bookings
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: user.id,
      },
      include: {
        bookings: {
          include: {
            service: {
              select: {
                name: true,
                duration: true,
                price: true,
              },
            },
          },
          orderBy: {
            startTime: 'desc',
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error fetching client:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/clients/[id] - Update a client
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const clientId = params.id
    const body = await request.json()

    // Validate client ID format
    if (!clientId || typeof clientId !== 'string') {
      return NextResponse.json({ error: 'Invalid client ID' }, { status: 400 })
    }

    // Check if client exists and belongs to the user
    const existingClient = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: user.id,
      },
    })

    if (!existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Validate input data
    const updateData: any = {}
    
    if (body.name !== undefined) {
      if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 })
      }
      if (body.name.length > 100) {
        return NextResponse.json({ error: 'Name too long' }, { status: 400 })
      }
      updateData.name = body.name.trim()
    }

    if (body.email !== undefined) {
      if (!body.email || typeof body.email !== 'string') {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 })
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
      }
      
      // Check if email is already used by another client
      const emailExists = await prisma.client.findFirst({
        where: {
          email: body.email.toLowerCase().trim(),
          userId: user.id,
          id: { not: clientId },
        },
      })
      
      if (emailExists) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
      }
      
      updateData.email = body.email.toLowerCase().trim()
    }

    if (body.phone !== undefined) {
      if (body.phone && (typeof body.phone !== 'string' || !/^\+?[1-9]\d{1,14}$/.test(body.phone.replace(/\s+/g, '')))) {
        return NextResponse.json({ error: 'Invalid phone format' }, { status: 400 })
      }
      updateData.phone = body.phone ? body.phone.trim() : null
    }

    if (body.notes !== undefined) {
      if (body.notes && (typeof body.notes !== 'string' || body.notes.length > 500)) {
        return NextResponse.json({ error: 'Notes too long' }, { status: 400 })
      }
      updateData.notes = body.notes ? body.notes.trim() : null
    }

    // Update the client
    const updatedClient = await prisma.client.update({
      where: {
        id: clientId,
      },
      data: updateData,
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    })

    return NextResponse.json(updatedClient)
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
