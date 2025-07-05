'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  Tag,
  Info,
  CheckCircle,
  XCircle,
  Sparkles
} from 'lucide-react'
import { CreateServiceData, ServiceCategory } from '@/shared/types/service'

export default function NewServicePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<CreateServiceData>({
    name: '',
    description: '',
    duration: 60,
    price: 0,
    color: '#3B82F6',
    category: ServiceCategory.HAIR,
    bufferTime: 15,
    maxAdvanceBook: 30
  })

  const predefinedColors = [
    { color: '#3B82F6', name: 'Blue' },
    { color: '#10B981', name: 'Green' },
    { color: '#F59E0B', name: 'Amber' },
    { color: '#EF4444', name: 'Red' },
    { color: '#8B5CF6', name: 'Purple' },
    { color: '#F97316', name: 'Orange' },
    { color: '#06B6D4', name: 'Cyan' },
    { color: '#84CC16', name: 'Lime' },
    { color: '#EC4899', name: 'Pink' },
    { color: '#6B7280', name: 'Gray' }
  ]

  const serviceCategories = [
    { value: ServiceCategory.HAIR, label: 'Hair Services', icon: '✂️' },
    { value: ServiceCategory.NAILS, label: 'Nail Services', icon: '💅' },
    { value: ServiceCategory.MASSAGE, label: 'Massage', icon: '💆' },
    { value: ServiceCategory.FACIAL, label: 'Facial Treatments', icon: '🧴' },
    { value: ServiceCategory.BODY_TREATMENT, label: 'Body Treatments', icon: '🛁' },
    { value: ServiceCategory.WAXING, label: 'Waxing', icon: '🕯️' },
    { value: ServiceCategory.MAKEUP, label: 'Makeup', icon: '💄' },
    { value: ServiceCategory.EYEBROWS, label: 'Eyebrow Services', icon: '👁️' },
    { value: ServiceCategory.EYELASHES, label: 'Eyelash Services', icon: '👁️' },
    { value: ServiceCategory.WELLNESS, label: 'Wellness', icon: '🧘' },
    { value: ServiceCategory.OTHER, label: 'Other Services', icon: '⭐' }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Service name must be at least 2 characters'
    }
    
    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative'
    }
    
    if (formData.duration < 5) {
      newErrors.duration = 'Duration must be at least 5 minutes'
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setSaving(true)

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: formData.price / 100 // Convert to dollars for API
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create service')
      }

      // Redirect to services list
      router.push('/dashboard/services')
    } catch (error) {
      console.error('Error creating service:', error)
      setErrors({ submit: 'Failed to create service. Please try again.' })
    } finally {
      setSaving(false)
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
    // Clear price error when user starts typing
    if (errors.price) {
      setErrors(prev => ({ ...prev, price: '' }))
    }
  }

  const handleInputChange = (field: keyof CreateServiceData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
      <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 -mx-6 -mt-6 px-6 pt-6 pb-8 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">Create New Service</h1>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Set up a new service that clients can book through your booking page
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{errors.submit}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Premium Haircut, Deep Tissue Massage, Facial Treatment"
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value as ServiceCategory)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {serviceCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                      errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Describe what this service includes, what clients can expect, any special features..."
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.description && (
                      <p className="text-sm text-red-600 flex items-center">
                        <XCircle className="h-4 w-4 mr-1" />
                        {errors.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 ml-auto">
                      {formData.description?.length || 0}/500 characters
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Duration */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Pricing & Duration</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Duration (minutes) *
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.duration ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value={5}>5 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={75}>1 hour 15 minutes</option>
                    <option value={90}>1.5 hours</option>
                    <option value={105}>1 hour 45 minutes</option>
                    <option value={120}>2 hours</option>
                    <option value={150}>2.5 hours</option>
                    <option value={180}>3 hours</option>
                    <option value={240}>4 hours</option>
                  </select>
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {errors.duration}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="h-4 w-4 inline mr-1" />
                    Price *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price / 100}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {errors.price}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Enter 0.00 for free services
                  </p>
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Palette className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Service Color
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Choose a color to help identify this service in your calendar and booking interface
                </p>
                <div className="grid grid-cols-5 gap-3 mb-6">
                  {predefinedColors.map((colorOption) => (
                    <button
                      key={colorOption.color}
                      type="button"
                      onClick={() => handleInputChange('color', colorOption.color)}
                      className={`group relative w-14 h-14 rounded-xl border-2 transition-all hover:scale-105 ${
                        formData.color === colorOption.color 
                          ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: colorOption.color }}
                      title={colorOption.name}
                    >
                      {formData.color === colorOption.color && (
                        <CheckCircle className="absolute -top-1 -right-1 h-5 w-5 text-white bg-gray-900 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="w-12 h-12 border-2 border-white rounded-lg cursor-pointer shadow-sm"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Custom Color</span>
                    <p className="text-xs text-gray-500">Click to choose any color</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs font-mono text-gray-600 bg-white px-2 py-1 rounded">
                      {formData.color}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Settings */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Settings className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Booking Settings</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Buffer Time (minutes)
                  </label>
                  <select
                    value={formData.bufferTime}
                    onChange={(e) => handleInputChange('bufferTime', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={0}>No buffer time</option>
                    <option value={5}>5 minutes</option>
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={20}>20 minutes</option>
                    <option value={30}>30 minutes</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Time between appointments for preparation and cleanup
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Max Advance Booking (days)
                  </label>
                  <select
                    value={formData.maxAdvanceBook}
                    onChange={(e) => handleInputChange('maxAdvanceBook', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 day</option>
                    <option value={3}>3 days</option>
                    <option value={7}>1 week</option>
                    <option value={14}>2 weeks</option>
                    <option value={30}>1 month</option>
                    <option value={60}>2 months</option>
                    <option value={90}>3 months</option>
                    <option value={180}>6 months</option>
                    <option value={365}>1 year</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    How far in advance clients can book this service
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Preview */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow sticky top-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Eye className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div
                      className="w-5 h-5 rounded-full mr-3 border-2 border-white shadow-sm"
                      style={{ backgroundColor: formData.color }}
                    ></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {formData.name || 'Service Name'}
                      </h4>
                      {formData.category && (
                        <p className="text-xs text-gray-500">
                          {serviceCategories.find(cat => cat.value === formData.category)?.icon} {serviceCategories.find(cat => cat.value === formData.category)?.label}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-green-600">
                      {formData.price === 0 ? 'Free' : formatCurrency(formData.price)}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formData.duration} min
                    </div>
                  </div>
                </div>
                
                {formData.description && (
                  <p className="text-sm text-gray-600 mb-3 italic">
                    "{formData.description}"
                  </p>
                )}
              </div>

              <div className="space-y-4 text-sm mb-6">
                <div className="bg-white rounded-lg p-3 border">
                  <h4 className="font-medium text-gray-900 mb-2">Service Details</h4>
                  <div className="space-y-2">
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
                  className={`w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-colors ${
                    !formData.name || saving
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Service
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
