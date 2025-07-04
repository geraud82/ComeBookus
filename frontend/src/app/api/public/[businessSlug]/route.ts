import { NextRequest, NextResponse } from 'next/server'

interface BusinessData {
  id: string
  businessName: string
  slug: string
  description: string
  address: string
  phone: string
  email: string
  website?: string
  socialMedia: {
    instagram?: string
    facebook?: string
  }
  openingHours: {
    [key: string]: { open: string; close: string; closed: boolean }
  }
  images: string[]
  rating: number
  reviewCount: number
  specialties: string[]
  certifications: string[]
  services: Array<{
    id: string
    name: string
    description: string
    duration: number
    price: number
    color: string
    category: string
    isActive: boolean
    bufferTime: number
    maxAdvanceBook: number
  }>
}

export async function GET(
  request: NextRequest,
  { params }: { params: { businessSlug: string } }
) {
  try {
    const { businessSlug } = params

    // Mock data - replace with actual database query
    const mockBusinessData: BusinessData = {
      id: '1',
      businessName: 'Salon Belle Époque',
      slug: businessSlug,
      description: 'Salon de coiffure et institut de beauté situé au cœur de Paris. Nous offrons des services de qualité dans une ambiance chaleureuse et moderne.',
      address: '123 Rue de la Paix, 75001 Paris',
      phone: '+33 1 42 86 87 88',
      email: 'contact@salon-belle-epoque.fr',
      website: 'https://salon-belle-epoque.fr',
      socialMedia: {
        instagram: '@salonbelleepoque',
        facebook: 'SalonBelleEpoqueParis'
      },
      openingHours: {
        monday: { open: '09:00', close: '19:00', closed: false },
        tuesday: { open: '09:00', close: '19:00', closed: false },
        wednesday: { open: '09:00', close: '19:00', closed: false },
        thursday: { open: '09:00', close: '20:00', closed: false },
        friday: { open: '09:00', close: '20:00', closed: false },
        saturday: { open: '08:00', close: '18:00', closed: false },
        sunday: { open: '10:00', close: '17:00', closed: false }
      },
      images: [
        '/salon-1.jpg',
        '/salon-2.jpg',
        '/salon-3.jpg'
      ],
      rating: 4.8,
      reviewCount: 127,
      specialties: ['Coiffure', 'Coloration', 'Soins du visage', 'Manucure'],
      certifications: ['Label Qualité', 'Produits Bio', 'Formation Continue'],
      services: [
        {
          id: '1',
          name: 'Coupe Femme',
          description: 'Coupe personnalisée avec conseil en image',
          duration: 45,
          price: 5500,
          color: '#8B5CF6',
          category: 'HAIR',
          isActive: true,
          bufferTime: 15,
          maxAdvanceBook: 30
        },
        {
          id: '2',
          name: 'Coupe + Brushing',
          description: 'Coupe avec mise en forme et brushing professionnel',
          duration: 60,
          price: 6500,
          color: '#10B981',
          category: 'HAIR',
          isActive: true,
          bufferTime: 15,
          maxAdvanceBook: 30
        },
        {
          id: '3',
          name: 'Coloration',
          description: 'Coloration complète avec soin nourrissant',
          duration: 120,
          price: 8500,
          color: '#F59E0B',
          category: 'HAIR',
          isActive: true,
          bufferTime: 30,
          maxAdvanceBook: 45
        },
        {
          id: '4',
          name: 'Soin du Visage',
          description: 'Soin complet adapté à votre type de peau',
          duration: 75,
          price: 7500,
          color: '#EF4444',
          category: 'FACIAL',
          isActive: true,
          bufferTime: 15,
          maxAdvanceBook: 60
        },
        {
          id: '5',
          name: 'Manucure',
          description: 'Soin des ongles avec pose de vernis',
          duration: 45,
          price: 4500,
          color: '#EC4899',
          category: 'NAILS',
          isActive: true,
          bufferTime: 10,
          maxAdvanceBook: 14
        },
        {
          id: '6',
          name: 'Épilation Sourcils',
          description: 'Épilation et restructuration des sourcils',
          duration: 30,
          price: 3500,
          color: '#6366F1',
          category: 'EYEBROWS',
          isActive: true,
          bufferTime: 5,
          maxAdvanceBook: 7
        }
      ]
    }

    // Simulate database lookup
    if (businessSlug === 'salon-belle-epoque') {
      return NextResponse.json(mockBusinessData)
    }

    // Business not found
    return NextResponse.json(
      { error: 'Business not found' },
      { status: 404 }
    )

  } catch (error) {
    console.error('Error fetching business data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
