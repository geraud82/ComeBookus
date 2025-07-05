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
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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

const serviceCategories = [
  { value: 'HAIR', label: 'Hair Services' },
  { value: 'MAKEUP', label: 'Makeup' },
  { value: 'EYEBROWS', label: 'Eyebrows' },
  { value: 'EYELASHES', label: 'Eyelashes' },
];

export default function HairSalonPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchResults, setSearchResults] = useState<BusinessResult[]>([]);
  const [loading, setLoading] = useState(false);
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
          // Automatically search for nearby hair salons
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
        type: 'SALON', // Filter only hair salons
        limit: '20'
      });

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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 pt-20 pb-16">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-purple-600 transition-colors">
              Home
            </Link>
            <ArrowRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 font-medium">Hair Salons</span>
          </div>

          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Scissors className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Hair Salons
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"> near you</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover the best hair salons in your area. 
              Cuts, coloring, styling, and much more.
            </p>
          </div>

          {/* Search bar and filters */}
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 shadow-lg">
              <div className="grid md:grid-cols-3 gap-4 mb-4">
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
                  Location detected - Searching for nearby hair salons
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Popular services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Hair Salon Services
            </h2>
            <p className="text-lg text-gray-600">
              Discover the most requested services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((service) => (
              <Card key={service.value} className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Scissors className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {service.label}
                </h3>
                <p className="text-gray-600 text-sm">
                  Find the best professionals
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Search results */}
      {searchResults.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Hair Salons Near You
              </h2>
              <p className="text-lg text-gray-600">
                {searchResults.length} salon{searchResults.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((business) => (
                <Card key={business.id} className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                        <Scissors className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {business.businessName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Hair Salon
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
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tips section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tips for Choosing Your Hair Salon
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Check Reviews
              </h3>
              <p className="text-gray-600">
                Read customer reviews to choose the best salon
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Scissors className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Salon Specialties
              </h3>
              <p className="text-gray-600">
                Choose a salon that specializes in the service you're looking for
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Location
              </h3>
              <p className="text-gray-600">
                Find a salon close to you for convenience
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
