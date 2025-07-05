import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Try to forward the request to the backend first
    try {
      const backendUrl = `${BACKEND_URL}/api/public/${params.slug}`
      
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(data)
      } else {
        throw new Error('Backend not available')
      }
    } catch (backendError) {
      console.log('Backend not available, returning mock data for slug:', params.slug)
      
      // Return mock data based on the slug
      const mockData = {
        id: '1',
        name: params.slug === 'john-doe' ? 'John Doe Barber' : 'Professional Barber',
        businessName: params.slug === 'john-doe' ? 'John Doe Barber Shop' : 'Professional Barber Shop',
        businessAddress: '123 Main St, Citytown',
        businessPhone: '+1 (555) 123-4567',
        bookingPageTitle: params.slug === 'john-doe' ? 'John Doe Barber' : 'Professional Barber',
        bookingPageBio: 'Professional barber with 10+ years of experience. Specializing in modern cuts, traditional shaves, and beard grooming.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        timezone: 'America/New_York',
        services: [
          {
            id: '1',
            name: 'Classic Haircut',
            description: 'Traditional men\'s haircut with scissors and clippers',
            duration: 30,
            price: 2500, // $25 in cents
            color: '#3B82F6',
            maxAdvanceBook: 30
          },
          {
            id: '2',
            name: 'Fade + Beard Trim',
            description: 'Modern fade haircut with professional beard trimming',
            duration: 45,
            price: 3500, // $35 in cents
            color: '#10B981',
            maxAdvanceBook: 30
          },
          {
            id: '3',
            name: 'Traditional Shave',
            description: 'Hot towel shave with straight razor',
            duration: 30,
            price: 3000, // $30 in cents
            color: '#F59E0B',
            maxAdvanceBook: 30
          },
          {
            id: '4',
            name: 'Full Service',
            description: 'Haircut, beard trim, and traditional shave',
            duration: 60,
            price: 5500, // $55 in cents
            color: '#8B5CF6',
            maxAdvanceBook: 30
          }
        ]
      }
      
      return NextResponse.json(mockData)
    }
  } catch (error) {
    console.error('Error fetching public booking page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
