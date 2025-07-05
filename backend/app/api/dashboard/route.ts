import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths } from 'date-fns'

// GET /api/dashboard - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized - Missing or invalid authorization header' }, { status: 401 })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Create Supabase client with the token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const thisMonth = {
      start: startOfMonth(now),
      end: endOfMonth(now),
    }
    const lastMonth = {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1)),
    }
    const thisWeek = {
      start: startOfWeek(now),
      end: endOfWeek(now),
    }

    // Get total bookings this month
    const thisMonthBookings = await prisma.booking.count({
      where: {
        userId: user.id,
        startTime: {
          gte: thisMonth.start,
          lte: thisMonth.end,
        },
        status: { in: ['CONFIRMED', 'COMPLETED'] },
      },
    })

    // Get total bookings last month
    const lastMonthBookings = await prisma.booking.count({
      where: {
        userId: user.id,
        startTime: {
          gte: lastMonth.start,
          lte: lastMonth.end,
        },
        status: { in: ['CONFIRMED', 'COMPLETED'] },
      },
    })

    // Get total revenue this month
    const thisMonthRevenue = await prisma.booking.aggregate({
      where: {
        userId: user.id,
        startTime: {
          gte: thisMonth.start,
          lte: thisMonth.end,
        },
        status: { in: ['CONFIRMED', 'COMPLETED'] },
        paymentStatus: 'PAID',
      },
      _sum: {
        totalAmount: true,
      },
    })

    // Get total revenue last month
    const lastMonthRevenue = await prisma.booking.aggregate({
      where: {
        userId: user.id,
        startTime: {
          gte: lastMonth.start,
          lte: lastMonth.end,
        },
        status: { in: ['CONFIRMED', 'COMPLETED'] },
        paymentStatus: 'PAID',
      },
      _sum: {
        totalAmount: true,
      },
    })

    // Get upcoming bookings this week
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
        startTime: {
          gte: now,
          lte: thisWeek.end,
        },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      include: {
        service: true,
        client: true,
      },
      orderBy: {
        startTime: 'asc',
      },
      take: 5,
    })

    // Get recent bookings
    const recentBookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
      },
      include: {
        service: true,
        client: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    })

    // Get service performance
    const serviceStats = await prisma.booking.groupBy({
      by: ['serviceId'],
      where: {
        userId: user.id,
        startTime: {
          gte: thisMonth.start,
          lte: thisMonth.end,
        },
        status: { in: ['CONFIRMED', 'COMPLETED'] },
      },
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
      },
    })

    // Get service names for the stats
    const services = await prisma.service.findMany({
      where: {
        userId: user.id,
        id: {
          in: serviceStats.map(stat => stat.serviceId),
        },
      },
    })

    const servicePerformance = serviceStats.map(stat => {
      const service = services.find(s => s.id === stat.serviceId)
      return {
        serviceName: service?.name || 'Unknown',
        bookings: stat._count.id,
        revenue: stat._sum.totalAmount || 0,
      }
    })

    // Calculate growth percentages
    const bookingGrowth = lastMonthBookings > 0 
      ? ((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100 
      : thisMonthBookings > 0 ? 100 : 0

    const revenueGrowth = (lastMonthRevenue._sum.totalAmount || 0) > 0
      ? (((thisMonthRevenue._sum.totalAmount || 0) - (lastMonthRevenue._sum.totalAmount || 0)) / (lastMonthRevenue._sum.totalAmount || 0)) * 100
      : (thisMonthRevenue._sum.totalAmount || 0) > 0 ? 100 : 0

    return NextResponse.json({
      thisMonth: {
        bookings: thisMonthBookings,
        revenue: thisMonthRevenue._sum.totalAmount || 0,
      },
      lastMonth: {
        bookings: lastMonthBookings,
        revenue: lastMonthRevenue._sum.totalAmount || 0,
      },
      growth: {
        bookings: Math.round(bookingGrowth * 100) / 100,
        revenue: Math.round(revenueGrowth * 100) / 100,
      },
      upcomingBookings,
      recentBookings,
      servicePerformance,
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
