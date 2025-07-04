import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase'

// GET /api/services/[id] - Get a specific service
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const service = await prisma.service.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/services/[id] - Update a service
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      color,
      isActive,
      bufferTime,
      maxAdvanceBook,
    } = body

    // Verify the service belongs to the user
    const existingService = await prisma.service.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Convert price to cents if provided
    const priceInCents = price !== undefined ? Math.round(price * 100) : undefined

    const updatedService = await prisma.service.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(duration && { duration: parseInt(duration) }),
        ...(priceInCents !== undefined && { price: priceInCents }),
        ...(color && { color }),
        ...(isActive !== undefined && { isActive }),
        ...(bufferTime !== undefined && { bufferTime: parseInt(bufferTime) }),
        ...(maxAdvanceBook !== undefined && { maxAdvanceBook: parseInt(maxAdvanceBook) }),
      },
    })

    return NextResponse.json(updatedService)
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/services/[id] - Delete a service
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the service belongs to the user
    const existingService = await prisma.service.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Check if there are any future bookings for this service
    const futureBookings = await prisma.booking.findMany({
      where: {
        serviceId: params.id,
        startTime: { gte: new Date() },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    })

    if (futureBookings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete service with future bookings' },
        { status: 400 }
      )
    }

    await prisma.service.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Service deleted successfully' })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
