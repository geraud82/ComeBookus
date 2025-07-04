import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type UserWithServices = {
  id: string;
  businessName: string | null;
  businessAddress: string | null;
  businessPhone: string | null;
  businessType: string;
  bookingPageSlug: string | null;
  bookingPageTitle: string | null;
  bookingPageBio: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  services: {
    id: string;
    name: string;
    description: string | null;
    duration: number;
    price: number;
    category: string;
  }[];
};

type UserWithDistance = UserWithServices & {
  distance: number;
};

// Fonction pour calculer la distance entre deux points géographiques (formule de Haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en kilomètres
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latitude = parseFloat(searchParams.get('lat') || '0');
    const longitude = parseFloat(searchParams.get('lng') || '0');
    const serviceCategory = searchParams.get('service');
    const businessType = searchParams.get('type');
    const maxDistance = parseFloat(searchParams.get('maxDistance') || '50'); // 50km par défaut
    const limit = parseInt(searchParams.get('limit') || '20');

    // Construire les filtres
    const whereClause: any = {
      bookingPageEnabled: true,
      latitude: { not: null },
      longitude: { not: null },
    };

    if (businessType) {
      whereClause.businessType = businessType;
    }

    // Récupérer tous les utilisateurs avec leurs services
    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        services: {
          where: {
            isActive: true,
            ...(serviceCategory && { category: serviceCategory })
          }
        }
      }
    });

    // Calculer les distances et filtrer par distance maximale
    const usersWithDistance = users
      .map((user: any) => {
        if (!user.latitude || !user.longitude) return null;
        
        const distance = calculateDistance(
          latitude,
          longitude,
          user.latitude,
          user.longitude
        );

        return {
          ...user,
          distance: Math.round(distance * 100) / 100, // Arrondir à 2 décimales
        };
      })
      .filter((user: any): user is NonNullable<typeof user> => 
        user !== null && user.distance <= maxDistance
      )
      .sort((a: any, b: any) => a.distance - b.distance) // Trier par distance croissante
      .slice(0, limit);

    // Formater la réponse
    const response = usersWithDistance.map((user: any) => ({
      id: user.id,
      businessName: user.businessName,
      businessAddress: user.businessAddress,
      businessPhone: user.businessPhone,
      businessType: user.businessType,
      bookingPageSlug: user.bookingPageSlug,
      bookingPageTitle: user.bookingPageTitle,
      bookingPageBio: user.bookingPageBio,
      city: user.city,
      distance: user.distance,
      services: user.services.map((service: any) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        category: service.category,
      }))
    }));

    return NextResponse.json({
      success: true,
      data: response,
      total: response.length
    });

  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la recherche' },
      { status: 500 }
    );
  }
}
