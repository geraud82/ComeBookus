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
          {/* Hero Content avec image */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Contenu texte à gauche */}
            <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Find your beauty salon
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"> near you</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Discover the best hair salons, spas, and massage centers in your area. 
                Book online in just a few clicks.
              </p>

              {/* Statistiques */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-purple-600">500+</div>
                  <div className="text-sm text-gray-600">Beauty Salons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-pink-600">10k+</div>
                  <div className="text-sm text-gray-600">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-indigo-600">24/7</div>
                  <div className="text-sm text-gray-600">Online Booking</div>
                </div>
              </div>
            </div>

            {/* Image à droite */}
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Beauty salon interior with modern styling chairs"
                  className="rounded-2xl shadow-2xl w-full h-[400px] md:h-[500px] object-cover"
                />
              </div>
              {/* Éléments décoratifs */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full opacity-20 blur-xl"></div>
              
              {/* Badge flottant */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <img className="w-6 h-6 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" alt="" />
                    <img className="w-6 h-6 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" alt="" />
                    <img className="w-6 h-6 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" alt="" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">4.9★</div>
                    <div className="text-gray-600 text-xs">2k+ reviews</div>
                  </div>
                </div>
              </div>
            </div>
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
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-red-800 font-medium text-sm">Location Access Required</div>
                      <div className="text-red-700 text-sm mt-1">
                        {locationError} Please enable location access in your browser settings to find nearby businesses automatically.
                      </div>
                      <button
                        onClick={() => {
                          setLocationError('');
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                setUserLocation({
                                  lat: position.coords.latitude,
                                  lng: position.coords.longitude
                                });
                                searchNearbyBusinesses(position.coords.latitude, position.coords.longitude);
                              },
                              (error) => {
                                console.error('Geolocation error:', error);
                                setLocationError('Unable to get your location. Please allow geolocation access.');
                              }
                            );
                          }
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium underline"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {userLocation && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                  <div className="flex items-center">
                    <Navigation className="w-5 h-5 text-green-500 mr-2" />
                    <div className="text-green-800 text-sm">
                      <span className="font-medium">Location detected!</span> Searching for nearby businesses in your area.
                    </div>
                  </div>
                </div>
              )}

              {!userLocation && !locationError && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-blue-500 mr-2" />
                    <div className="text-blue-800 text-sm">
                      <span className="font-medium">Getting your location...</span> This helps us find the best businesses near you.
                    </div>
                  </div>
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
