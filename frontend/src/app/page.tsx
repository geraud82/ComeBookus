'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Search, 
  Star, 
  Clock, 
  Phone, 
  Navigation,
  Scissors,
  Sparkles,
  Heart,
  Filter,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface BusinessResult {
  id: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessType: string;
  bookingPageSlug: string;
  bookingPageTitle: string;
  bookingPageBio: string;
  city: string;
  distance: number;
  services: {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    category: string;
  }[];
}

const businessTypes = [
  { value: 'SALON', label: 'Hair Salon', icon: Scissors },
  { value: 'SPA', label: 'Spa', icon: Sparkles },
  { value: 'MASSAGE', label: 'Massage', icon: Heart },
  { value: 'BARBERSHOP', label: 'Barbershop', icon: Scissors },
  { value: 'BEAUTY_CENTER', label: 'Beauty Center', icon: Sparkles },
  { value: 'NAIL_SALON', label: 'Nail Salon', icon: Sparkles },
  { value: 'WELLNESS_CENTER', label: 'Wellness Center', icon: Heart },
];

const serviceCategories = [
  { value: 'HAIR', label: 'Hair Services' },
  { value: 'NAILS', label: 'Nails' },
  { value: 'MASSAGE', label: 'Massage' },
  { value: 'FACIAL', label: 'Facial Treatments' },
  { value: 'BODY_TREATMENT', label: 'Body Treatments' },
  { value: 'WAXING', label: 'Waxing' },
  { value: 'MAKEUP', label: 'Makeup' },
  { value: 'EYEBROWS', label: 'Eyebrows' },
  { value: 'EYELASHES', label: 'Eyelashes' },
  { value: 'WELLNESS', label: 'Wellness' },
];

export default function HomePage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchResults, setSearchResults] = useState<BusinessResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBusinessType, setSelectedBusinessType] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [maxDistance, setMaxDistance] = useState(25);
  const [locationError, setLocationError] = useState('');

  // Get user geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          // Automatically search for nearby businesses
          searchNearbyBusinesses(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError('Unable to get your location. Please allow geolocation access.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  }, []);

  const searchNearbyBusinesses = async (lat?: number, lng?: number) => {
    if (!lat || !lng) {
      if (!userLocation) return;
      lat = userLocation.lat;
      lng = userLocation.lng;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        maxDistance: maxDistance.toString(),
        limit: '20'
      });

      if (selectedBusinessType) {
        params.append('type', selectedBusinessType);
      }

      if (selectedService) {
        params.append('service', selectedService);
      }

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data);
      } else {
        console.error('Search error:', data.error);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (userLocation) {
      searchNearbyBusinesses();
    }
  };

  const formatPrice = (price: number) => {
    return `${(price / 100).toFixed(2)}€`;
  };

  const getBusinessTypeIcon = (type: string) => {
    const businessType = businessTypes.find(bt => bt.value === type);
    return businessType ? businessType.icon : Scissors;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section avec recherche */}
      <section className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 pt-20 pb-16">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find your beauty salon
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"> near you</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover the best hair salons, spas, and massage centers in your area. 
              Book online in just a few clicks.
            </p>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 shadow-lg">
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type
                  </label>
                  <select
                    value={selectedBusinessType}
                    onChange={(e) => setSelectedBusinessType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Types</option>
                    {businessTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Needed
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Services</option>
                    {serviceCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Distance (miles)
                  </label>
                  <select
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={5}>3 miles</option>
                    <option value={10}>6 miles</option>
                    <option value={25}>15 miles</option>
                    <option value={50}>30 miles</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={handleSearch}
                    disabled={!userLocation || loading}
                    className="w-full"
                  >
                    {loading ? (
                      'Searching...'
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {locationError && (
                <div className="text-red-600 text-sm mt-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {locationError}
                </div>
              )}

              {userLocation && (
                <div className="text-green-600 text-sm mt-2 flex items-center">
                  <Navigation className="w-4 h-4 mr-1" />
                  Location detected - Searching for nearby businesses
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Résultats de recherche */}
      {searchResults.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Businesses Near You
              </h2>
              <p className="text-lg text-gray-600">
                {searchResults.length} business{searchResults.length !== 1 ? 'es' : ''} found
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((business) => {
                const IconComponent = getBusinessTypeIcon(business.businessType);
                return (
                  <Card key={business.id} className="p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {business.businessName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {businessTypes.find(bt => bt.value === business.businessType)?.label}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {business.distance} km
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-600 text-sm mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {business.businessAddress}
                      </p>
                      {business.businessPhone && (
                        <p className="text-gray-600 text-sm flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {business.businessPhone}
                        </p>
                      )}
                    </div>

                    {business.bookingPageBio && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {business.bookingPageBio}
                      </p>
                    )}

                    {business.services.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Available Services:</h4>
                        <div className="space-y-1">
                          {business.services.slice(0, 3).map((service) => (
                            <div key={service.id} className="flex justify-between items-center text-sm">
                              <span className="text-gray-700">{service.name}</span>
                              <div className="flex items-center text-gray-600">
                                <Clock className="w-3 h-3 mr-1" />
                                {service.duration}min - {formatPrice(service.price)}
                              </div>
                            </div>
                          ))}
                          {business.services.length > 3 && (
                            <p className="text-xs text-gray-500">
                              +{business.services.length - 3} more service{business.services.length - 3 !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <Link href={`/book/${business.bookingPageSlug}`}>
                      <Button className="w-full">
                        Book Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Section des catégories populaires */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-lg text-gray-600">
              Discover all beauty and wellness services near you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessTypes.slice(0, 4).map((type) => {
              const IconComponent = type.icon;
              const categoryUrls = {
                'SALON': '/categories/hair-salon',
                'SPA': '/categories/spa',
                'MASSAGE': '/categories/massage',
                'BARBERSHOP': '/categories/barbershop'
              };
              
              return (
                <Link key={type.value} href={categoryUrls[type.value as keyof typeof categoryUrls] || '#'}>
                  <Card className="p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group border-2 hover:border-purple-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      {type.label}
                    </h3>
                    <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">
                      Find the best businesses near you
                    </p>
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-purple-600 text-sm font-medium flex items-center justify-center">
                        View all businesses
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section avantages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Location-Based Search
              </h3>
              <p className="text-gray-600">
                Automatically find the closest businesses to your location
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Advanced Filters
              </h3>
              <p className="text-gray-600">
                Search by business type, specific services, and distance
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Easy Booking
              </h3>
              <p className="text-gray-600">
                Book your appointments online 24/7 with just a few clicks
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
