'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  DollarSign, 
  Users, 
  Search,
  Filter,
  MoreVertical,
  Eye,
  Copy,
  Settings
} from 'lucide-react'
import { apiRequest, API_CONFIG } from '@/lib/config'

interface Service {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  color: string
  isActive: boolean
  bookingsCount: number
  revenue: number
  createdAt: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<boolean | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      // Always show mock data for development/demo purposes
      // In production, this would be replaced with real API calls
      const mockServices: Service[] = [
        {
          id: '1',
          name: 'Coupe classique',
          description: 'Coupe de cheveux traditionnelle avec finition soignée',
          duration: 30,
          price: 2500, // 25€ in cents
          color: '#3B82F6',
          isActive: true,
          bookingsCount: 45,
          revenue: 112500,
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Fade + Barbe',
          description: 'Coupe dégradée avec taille de barbe',
          duration: 45,
          price: 3500, // 35€ in cents
          color: '#10B981',
          isActive: true,
          bookingsCount: 32,
          revenue: 112000,
          createdAt: '2024-01-20'
        },
        {
          id: '3',
          name: 'Coupe enfant',
          description: 'Coupe spécialement adaptée aux enfants',
          duration: 20,
          price: 1500, // 15€ in cents
          color: '#F59E0B',
          isActive: true,
          bookingsCount: 28,
          revenue: 42000,
          createdAt: '2024-02-01'
        },
        {
          id: '4',
          name: 'Shampoing + Coupe',
          description: 'Service complet avec shampoing et coupe',
          duration: 40,
          price: 3000, // 30€ in cents
          color: '#8B5CF6',
          isActive: false,
          bookingsCount: 12,
          revenue: 36000,
          createdAt: '2024-02-10'
        },
        {
          id: '5',
          name: 'Coloration',
          description: 'Coloration complète avec produits professionnels',
          duration: 90,
          price: 6500, // 65€ in cents
          color: '#EC4899',
          isActive: true,
          bookingsCount: 18,
          revenue: 117000,
          createdAt: '2024-02-15'
        },
        {
          id: '6',
          name: 'Soin capillaire',
          description: 'Traitement nourrissant pour cheveux abîmés',
          duration: 60,
          price: 4000, // 40€ in cents
          color: '#06B6D4',
          isActive: true,
          bookingsCount: 22,
          revenue: 88000,
          createdAt: '2024-02-20'
        }
      ]
      
      setServices(mockServices)
      console.log('Loaded mock services:', mockServices.length)
    } catch (error) {
      console.error('Error loading services:', error)
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return `${(price / 100).toFixed(0)}€`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
    }
    return `${mins}m`
  }

  const formatRevenue = (revenue: number) => {
    return `${(revenue / 100).toFixed(0)}€`
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterActive === null || service.isActive === filterActive
    return matchesSearch && matchesFilter
  })

  const toggleServiceStatus = (serviceId: string) => {
    setServices(services.map(service => 
      service.id === serviceId 
        ? { ...service, isActive: !service.isActive }
        : service
    ))
  }

  const deleteService = (serviceId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      setServices(services.filter(service => service.id !== serviceId))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos services et leurs tarifs
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.href = '/dashboard/services/new'}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Service
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Settings className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Services</p>
              <p className="text-2xl font-semibold text-gray-900">{services.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Services Actifs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {services.filter(s => s.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Réservations</p>
              <p className="text-2xl font-semibold text-gray-900">
                {services.reduce((sum, s) => sum + s.bookingsCount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Revenus Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatRevenue(services.reduce((sum, s) => sum + s.revenue, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={filterActive === null ? 'all' : filterActive ? 'active' : 'inactive'}
                onChange={(e) => {
                  const value = e.target.value
                  setFilterActive(value === 'all' ? null : value === 'active')
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les services</option>
                <option value="active">Services actifs</option>
                <option value="inactive">Services inactifs</option>
              </select>
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="overflow-hidden">
          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun service trouvé</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Aucun service ne correspond à votre recherche.' : 'Commencez par créer votre premier service.'}
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = '/dashboard/services/new'}
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer un Service
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredServices.map((service) => (
                <div key={service.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: service.color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {service.name}
                          </h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            service.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {service.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                        {service.description && (
                          <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                        )}
                        <div className="flex items-center space-x-6 mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDuration(service.duration)}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {formatPrice(service.price)}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="h-4 w-4 mr-1" />
                            {service.bookingsCount} réservations
                          </div>
                          <div className="text-sm font-medium text-green-600">
                            {formatRevenue(service.revenue)} de revenus
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.location.href = `/dashboard/services/${service.id}/edit`}
                        className="btn btn-outline btn-sm"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleServiceStatus(service.id)}
                        className={`btn btn-sm ${
                          service.isActive ? 'btn-outline' : 'btn-primary'
                        }`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteService(service.id)}
                        className="btn btn-outline btn-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
