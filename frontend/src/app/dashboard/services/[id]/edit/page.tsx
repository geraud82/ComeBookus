'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  Save, 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  Palette, 
  Calendar,
  Settings,
  Eye,
  AlertCircle,
  Trash2
} from 'lucide-react'
import { CreateServiceData } from '@/shared/types/service'

interface Service extends CreateServiceData {
  id: string
  isActive: boolean
  bookingsCount: number
  revenue: number
  createdAt: string
}

export default function EditServicePage() {
  const router = useRouter()
  const params = useParams()
  const serviceId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [service, setService] = useState<Service | null>(null)
  const [formData, setFormData] = useState<CreateServiceData>({
    name: '',
    description: '',
    duration: 60,
    price: 0,
    color: '#3B82F6',
    bufferTime: 15,
    maxAdvanceBook: 30
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const predefinedColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6B7280'  // Gray
  ]

  useEffect(() => {
    fetchService()
  }, [serviceId])

  const fetchService = async () => {
    try {
      // Try to fetch real service from API
      const response = await fetch(`/api/services/${serviceId}`)
      if (response.ok) {
        const data = await response.json()
        setService(data)
        setFormData({
          name: data.name,
          description: data.description || '',
          duration: data.duration,
          price: data.price,
          color: data.color,
          bufferTime: data.bufferTime || 15,
          maxAdvanceBook: data.maxAdvanceBook || 30
        })
        setLoading(false)
        return
      }

      // Fallback to mock data based on service ID
      const mockServices: Record<string, Service> = {
        '1': {
          id: '1',
          name: 'Coupe classique',
          description: 'Coupe de cheveux traditionnelle avec finition soignée',
          duration: 30,
          price: 2500,
          color: '#3B82F6',
          isActive: true,
          bookingsCount: 45,
          revenue: 112500,
          createdAt: '2024-01-15',
          bufferTime: 15,
          maxAdvanceBook: 30
        },
        '2': {
          id: '2',
          name: 'Fade + Barbe',
          description: 'Coupe dégradée avec taille de barbe',
          duration: 45,
          price: 3500,
          color: '#10B981',
          isActive: true,
          bookingsCount: 32,
          revenue: 112000,
          createdAt: '2024-01-20',
          bufferTime: 15,
          maxAdvanceBook: 30
        },
        '3': {
          id: '3',
          name: 'Coupe enfant',
          description: 'Coupe spécialement adaptée aux enfants',
          duration: 20,
          price: 1500,
          color: '#F59E0B',
          isActive: true,
          bookingsCount: 28,
          revenue: 42000,
          createdAt: '2024-02-01',
          bufferTime: 10,
          maxAdvanceBook: 14
        },
        '4': {
          id: '4',
          name: 'Shampoing + Coupe',
          description: 'Service complet avec shampoing et coupe',
          duration: 40,
          price: 3000,
          color: '#8B5CF6',
          isActive: false,
          bookingsCount: 12,
          revenue: 36000,
          createdAt: '2024-02-10',
          bufferTime: 15,
          maxAdvanceBook: 30
        },
        '5': {
          id: '5',
          name: 'Coloration',
          description: 'Coloration complète avec produits professionnels',
          duration: 90,
          price: 6500,
          color: '#EC4899',
          isActive: true,
          bookingsCount: 18,
          revenue: 117000,
          createdAt: '2024-02-15',
          bufferTime: 30,
          maxAdvanceBook: 45
        },
        '6': {
          id: '6',
          name: 'Soin capillaire',
          description: 'Traitement nourrissant pour cheveux abîmés',
          duration: 60,
          price: 4000,
          color: '#06B6D4',
          isActive: true,
          bookingsCount: 22,
          revenue: 88000,
          createdAt: '2024-02-20',
          bufferTime: 20,
          maxAdvanceBook: 30
        }
      }

      const mockService = mockServices[serviceId]
      if (mockService) {
        setService(mockService)
        setFormData({
          name: mockService.name,
          description: mockService.description || '',
          duration: mockService.duration,
          price: mockService.price,
          color: mockService.color,
          bufferTime: mockService.bufferTime || 15,
          maxAdvanceBook: mockService.maxAdvanceBook || 30
        })
      } else {
        // Service not found
        setErrors({ general: 'Service not found' })
      }
    } catch (error) {
      console.error('Error fetching service:', error)
      setErrors({ general: 'Error loading service' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // Redirect to services list
        router.push('/dashboard/services')
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.error || 'Error updating service' })
      }
    } catch (error) {
      console.error('Error updating service:', error)
      setErrors({ submit: 'Error updating service' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return
    }

    setDeleting(true)

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Redirect to services list
        router.push('/dashboard/services')
      } else {
        const errorData = await response.json()
        setErrors({ delete: errorData.error || 'Error deleting service' })
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      setErrors({ delete: 'Error deleting service' })
    } finally {
      setDeleting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100)
  }

  const handlePriceChange = (value: string) => {
    // Convert dollars to cents
    const dollars = parseFloat(value) || 0
    setFormData(prev => ({ ...prev, price: Math.round(dollars * 100) }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (errors.general) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-900 mb-2">Error</h2>
          <p className="text-red-700">{errors.general}</p>
          <button
            onClick={() => router.push('/dashboard/services')}
            className="mt-4 btn btn-outline"
          >
            Back to Services
          </button>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Service Not Found</h2>
          <p className="text-gray-600">The service you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/dashboard/services')}
            className="mt-4 btn btn-outline"
          >
            Back to Services
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="btn btn-outline btn-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
            <p className="mt-1 text-sm text-gray-500">
              Update service details and settings
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="btn btn-outline btn-sm text-red-600 hover:bg-red-50"
        >
          {deleting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
          ) : (
            <Trash2 className="h-4 w-4 mr-2" />
          )}
          {deleting ? 'Deleting...' : 'Delete Service'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Consultation, Haircut, Massage"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe what this service includes..."
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Duration */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Duration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Duration (minutes) *
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                    <option value={180}>3 hours</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="h-4 w-4 inline mr-1" />
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price / 100}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter 0 for free services
                  </p>
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Palette className="h-4 w-4 inline mr-1" />
                  Color
                </label>
                <div className="grid grid-cols-5 gap-3 mb-4">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        formData.color === color 
                          ? 'border-gray-900 scale-110' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">Custom color</span>
                </div>
              </div>
            </div>

            {/* Booking Settings */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Buffer Time (minutes)
                  </label>
                  <select
                    value={formData.bufferTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, bufferTime: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={0}>No buffer</option>
                    <option value={5}>5 minutes</option>
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Time between appointments for preparation
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Max Advance Booking (days)
                  </label>
                  <select
                    value={formData.maxAdvanceBook}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxAdvanceBook: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={7}>1 week</option>
                    <option value={14}>2 weeks</option>
                    <option value={30}>1 month</option>
                    <option value={60}>2 months</option>
                    <option value={90}>3 months</option>
                    <option value={365}>1 year</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    How far in advance clients can book
                  </p>
                </div>
              </div>
            </div>

            {/* Service Statistics */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{service.bookingsCount}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(service.revenue)}</div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {service.isActive ? 'Active' : 'Inactive'}
                  </div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Preview */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Preview</h3>
              
              <div className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: formData.color }}
                    ></div>
                    <h4 className="font-medium text-gray-900">
                      {formData.name || 'Service Name'}
                    </h4>
                  </div>
                  <Eye className="h-4 w-4 text-gray-400" />
                </div>
                
                {formData.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {formData.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {formData.duration} min
                  </div>
                  <div className="font-medium text-green-600">
                    {formData.price === 0 ? 'Free' : formatCurrency(formData.price)}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{formData.duration} minutes</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">
                    {formData.price === 0 ? 'Free' : formatCurrency(formData.price)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Buffer time:</span>
                  <span className="font-medium">{formData.bufferTime || 0} minutes</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Advance booking:</span>
                  <span className="font-medium">{formData.maxAdvanceBook} days</span>
                </div>
              </div>

              {(formData.bufferTime || 0) > 0 && (
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                    <div className="text-xs text-blue-700">
                      <p className="font-medium">Buffer time included</p>
                      <p>
                        Total slot duration: {formData.duration + (formData.bufferTime || 0)} minutes
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={!formData.name || saving}
                  className="w-full btn btn-primary"
                >
                  {saving ? (
                    <div className="loading-spinner h-4 w-4 mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {saving ? 'Updating...' : 'Update Service'}
                </button>
                
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full btn btn-outline"
                >
                  Cancel
                </button>
              </div>

              {(errors.submit || errors.delete) && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
                  <AlertCircle className="w-4 w-4 text-red-500 mr-2" />
                  <span className="text-red-700 text-sm">{errors.submit || errors.delete}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
