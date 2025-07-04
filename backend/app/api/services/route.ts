import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase'

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
    const supabase = createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      duration,
      price,
      color = '#3B82F6',
      bufferTime = 0,
      maxAdvanceBook = 30,
    } = body

    // Validate required fields
    if (!name || !duration || price === undefined) {
      return NextResponse.json(
        { error: 'Name, duration, and price are required' },
        { status: 400 }
      )
    }

    // Convert price to cents if it's in dollars
    const priceInCents = Math.round(price * 100)

    const service = await prisma.service.create({
      data: {
        name,
        description,
        duration: parseInt(duration),
        price: priceInCents,
        color,
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
