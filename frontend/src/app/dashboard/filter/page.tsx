'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Filter, 
  ArrowLeft, 
  Calendar, 
  Users, 
  DollarSign, 
  Clock,
  Search,
  X,
  Check,
  RefreshCw,
  Save
} from 'lucide-react'
import { BookingStatus } from '@/shared/types/booking'

interface FilterOptions {
  dateRange: {
    start?: string
    end?: string
    preset?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'
  }
  status: BookingStatus[]
  services: string[]
  clients: string[]
  priceRange: {
    min?: number
    max?: number
  }
  timeRange: {
    start?: string
    end?: string
  }
  paymentStatus: string[]
  searchTerm: string
}

export default function FilterPage() {
  const router = useRouter()
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: { preset: 'month' },
    status: [],
    services: [],
    clients: [],
    priceRange: {},
    timeRange: {},
    paymentStatus: [],
    searchTerm: ''
  })

  const [savedFilters, setSavedFilters] = useState([
    { id: '1', name: 'This Week Confirmed', description: 'Confirmed bookings for this week' },
    { id: '2', name: 'High Value Clients', description: 'Bookings over $100' },
    { id: '3', name: 'Pending Payments', description: 'Bookings with pending payments' }
  ])

  // Mock data - replace with actual API calls
  const availableServices = [
    { id: '1', name: 'Consultation' },
    { id: '2', name: 'Premium Service' },
    { id: '3', name: 'Basic Service' }
  ]

  const availableClients = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com' }
  ]

  const statusOptions = [
    { value: BookingStatus.PENDING, label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: BookingStatus.CONFIRMED, label: 'Confirmed', color: 'bg-green-100 text-green-800' },
    { value: BookingStatus.COMPLETED, label: 'Completed', color: 'bg-blue-100 text-blue-800' },
    { value: BookingStatus.CANCELLED, label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: BookingStatus.NO_SHOW, label: 'No Show', color: 'bg-gray-100 text-gray-800' }
  ]

  const paymentStatusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'PAID', label: 'Paid' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'REFUNDED', label: 'Refunded' }
  ]

  const datePresets = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const handleStatusToggle = (status: BookingStatus) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }))
  }

  const handleServiceToggle = (serviceId: string) => {
    setFilters(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }))
  }

  const handleClientToggle = (clientId: string) => {
    setFilters(prev => ({
      ...prev,
      clients: prev.clients.includes(clientId)
        ? prev.clients.filter(c => c !== clientId)
        : [...prev.clients, clientId]
    }))
  }

  const handlePaymentStatusToggle = (status: string) => {
    setFilters(prev => ({
      ...prev,
      paymentStatus: prev.paymentStatus.includes(status)
        ? prev.paymentStatus.filter(s => s !== status)
        : [...prev.paymentStatus, status]
    }))
  }

  const handleClearFilters = () => {
    setFilters({
      dateRange: { preset: 'month' },
      status: [],
      services: [],
      clients: [],
      priceRange: {},
      timeRange: {},
      paymentStatus: [],
      searchTerm: ''
    })
  }

  const handleApplyFilters = () => {
    // In a real implementation, this would apply the filters and redirect
    console.log('Applying filters:', filters)
    router.back()
  }

  const handleSaveFilter = () => {
    const name = prompt('Enter a name for this filter:')
    if (name) {
      const newFilter = {
        id: Date.now().toString(),
        name,
        description: 'Custom filter'
      }
      setSavedFilters(prev => [...prev, newFilter])
    }
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.status.length > 0) count++
    if (filters.services.length > 0) count++
    if (filters.clients.length > 0) count++
    if (filters.priceRange.min || filters.priceRange.max) count++
    if (filters.timeRange.start || filters.timeRange.end) count++
    if (filters.paymentStatus.length > 0) count++
    if (filters.searchTerm) count++
    return count
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
            <h1 className="text-2xl font-bold text-gray-900">Advanced Filters</h1>
            <p className="mt-1 text-sm text-gray-500">
              Filter your data with advanced criteria
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active
          </span>
          <button
            onClick={handleClearFilters}
            className="btn btn-outline btn-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Options */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by client name, email, or service..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Date Range</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {datePresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      dateRange: { preset: preset.value as any } 
                    }))}
                    className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                      filters.dateRange.preset === preset.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              
              {filters.dateRange.preset === 'custom' && (
                <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={filters.dateRange.start || ''}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, start: e.target.value } 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={filters.dateRange.end || ''}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, end: e.target.value } 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {statusOptions.map((status) => (
                <label
                  key={status.value}
                  className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status.value)}
                    onChange={() => handleStatusToggle(status.value)}
                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
            <div className="space-y-2">
              {availableServices.map((service) => (
                <label
                  key={service.id}
                  className="flex items-center p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={filters.services.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{service.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={filters.priceRange.min || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    priceRange: { ...prev.priceRange, min: parseFloat(e.target.value) || undefined } 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={filters.priceRange.max || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    priceRange: { ...prev.priceRange, max: parseFloat(e.target.value) || undefined } 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1000.00"
                />
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
            <div className="grid grid-cols-2 gap-3">
              {paymentStatusOptions.map((status) => (
                <label
                  key={status.value}
                  className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={filters.paymentStatus.includes(status.value)}
                    onChange={() => handlePaymentStatusToggle(status.value)}
                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{status.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Filters Summary */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Filters</h3>
            
            {getActiveFilterCount() === 0 ? (
              <p className="text-sm text-gray-500">No filters applied</p>
            ) : (
              <div className="space-y-2">
                {filters.status.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium">{filters.status.length} selected</span>
                  </div>
                )}
                {filters.services.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Services:</span>
                    <span className="font-medium">{filters.services.length} selected</span>
                  </div>
                )}
                {filters.clients.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Clients:</span>
                    <span className="font-medium">{filters.clients.length} selected</span>
                  </div>
                )}
                {(filters.priceRange.min || filters.priceRange.max) && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">
                      ${filters.priceRange.min || 0} - ${filters.priceRange.max || '∞'}
                    </span>
                  </div>
                )}
                {filters.paymentStatus.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-medium">{filters.paymentStatus.length} selected</span>
                  </div>
                )}
                {filters.searchTerm && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Search:</span>
                    <span className="font-medium truncate max-w-20">"{filters.searchTerm}"</span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button
                onClick={handleApplyFilters}
                className="w-full btn btn-primary"
              >
                <Check className="h-4 w-4 mr-2" />
                Apply Filters
              </button>
              
              <button
                onClick={handleSaveFilter}
                disabled={getActiveFilterCount() === 0}
                className="w-full btn btn-outline"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Filter
              </button>
            </div>
          </div>

          {/* Saved Filters */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Filters</h3>
            <div className="space-y-2">
              {savedFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{filter.name}</h4>
                      <p className="text-xs text-gray-500">{filter.description}</p>
                    </div>
                    <button className="text-gray-400 hover:text-red-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
