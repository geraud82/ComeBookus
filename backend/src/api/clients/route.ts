import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase'

// GET /api/clients - Get user's clients
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
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
        bookings: {
          select: {
            totalAmount: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Transform the data to match the frontend interface
    const transformedClients = clients.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      totalBookings: client._count.bookings,
      totalSpent: client.bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0),
      lastBooking: client.bookings[0]?.createdAt?.toISOString(),
      createdAt: client.createdAt.toISOString(),
    }))

    return NextResponse.json(transformedClients)
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
    const supabase = createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if client already exists
    const existingClient = await prisma.client.findUnique({
      where: {
        email_userId: {
          email,
          userId: user.id,
        },
      },
    })

    if (existingClient) {
      return NextResponse.json(
        { error: 'Client with this email already exists' },
        { status: 409 }
      )
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        userId: user.id,
      },
    })

    return NextResponse.json({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      totalBookings: 0,
      totalSpent: 0,
      lastBooking: null,
      createdAt: client.createdAt.toISOString(),
    })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
