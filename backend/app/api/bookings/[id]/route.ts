import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase'

// GET /api/bookings/[id] - Get a specific booking
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

    const booking = await prisma.booking.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        service: true,
        client: true,
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/bookings/[id] - Update a booking
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
    const { status, startTime, endTime, notes, clientName, clientPhone } = body

    // Verify the booking belongs to the user
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // If updating time, check for conflicts
    if (startTime && endTime) {
      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          userId: user.id,
          id: { not: params.id },
          status: { in: ['PENDING', 'CONFIRMED'] },
          OR: [
            {
              startTime: { lte: new Date(startTime) },
              endTime: { gt: new Date(startTime) },
            },
            {
              startTime: { lt: new Date(endTime) },
              endTime: { gte: new Date(endTime) },
            },
            {
              startTime: { gte: new Date(startTime) },
              endTime: { lte: new Date(endTime) },
            },
          ],
        },
      })

      if (conflictingBooking) {
        return NextResponse.json(
          { error: 'Time slot is already booked' },
          { status: 409 }
        )
      }
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(notes !== undefined && { notes }),
        ...(clientName && { clientName }),
        ...(clientPhone && { clientPhone }),
      },
      include: {
        service: true,
        client: true,
      },
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/bookings/[id] - Cancel/delete a booking
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

    // Verify the booking belongs to the user
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Instead of deleting, we'll mark as cancelled
    const cancelledBooking = await prisma.booking.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' },
      include: {
        service: true,
        client: true,
      },
    })

    return NextResponse.json(cancelledBooking)
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
