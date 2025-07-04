import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/public/[slug] - Get public booking page data
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        bookingPageSlug: params.slug,
        bookingPageEnabled: true,
      },
      select: {
        id: true,
        name: true,
        businessName: true,
        businessAddress: true,
        businessPhone: true,
        businessWebsite: true,
        bookingPageTitle: true,
        bookingPageBio: true,
        timezone: true,
        services: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            description: true,
            duration: true,
            price: true,
            color: true,
            maxAdvanceBook: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Booking page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching public booking page:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
