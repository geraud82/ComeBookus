'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Download, 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Users, 
  DollarSign,
  CheckCircle,
  Clock,
  Filter,
  Settings
} from 'lucide-react'

interface ExportOptions {
  type: 'bookings' | 'clients' | 'services' | 'analytics'
  format: 'csv' | 'pdf' | 'excel'
  dateRange: 'all' | '7d' | '30d' | '90d' | 'custom'
  startDate?: string
  endDate?: string
  includeFields: string[]
}

export default function ExportPage() {
  const router = useRouter()
  const [exporting, setExporting] = useState(false)
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    type: 'bookings',
    format: 'csv',
    dateRange: '30d',
    includeFields: []
  })

  const exportTypes = [
    {
      id: 'bookings' as const,
      name: 'Bookings',
      description: 'Export all booking data including client info and service details',
      icon: Calendar,
      fields: [
        'Booking ID',
        'Client Name',
        'Client Email',
        'Client Phone',
        'Service Name',
        'Date & Time',
        'Duration',
        'Status',
        'Amount',
        'Payment Status',
        'Notes'
      ]
    },
    {
      id: 'clients' as const,
      name: 'Clients',
      description: 'Export client database with contact information and booking history',
      icon: Users,
      fields: [
        'Client ID',
        'Name',
        'Email',
        'Phone',
        'Total Bookings',
        'Total Spent',
        'Last Booking',
        'Member Since'
      ]
    },
    {
      id: 'services' as const,
      name: 'Services',
      description: 'Export service catalog with pricing and booking settings',
      icon: Settings,
      fields: [
        'Service ID',
        'Name',
        'Description',
        'Duration',
        'Price',
        'Buffer Time',
        'Max Advance Booking',
        'Active Status',
        'Total Bookings',
        'Total Revenue'
      ]
    },
    {
      id: 'analytics' as const,
      name: 'Analytics',
      description: 'Export business analytics and performance metrics',
      icon: DollarSign,
      fields: [
        'Date',
        'Total Bookings',
        'Total Revenue',
        'New Clients',
        'Returning Clients',
        'Average Booking Value',
        'Popular Services',
        'Peak Hours'
      ]
    }
  ]

  const formats = [
    { id: 'csv', name: 'CSV', description: 'Comma-separated values, compatible with Excel and Google Sheets' },
    { id: 'excel', name: 'Excel', description: 'Microsoft Excel format with formatting and charts' },
    { id: 'pdf', name: 'PDF', description: 'Formatted report document for printing and sharing' }
  ]

  const dateRanges = [
    { id: 'all', name: 'All Time', description: 'Export all available data' },
    { id: '7d', name: 'Last 7 Days', description: 'Data from the past week' },
    { id: '30d', name: 'Last 30 Days', description: 'Data from the past month' },
    { id: '90d', name: 'Last 90 Days', description: 'Data from the past quarter' },
    { id: 'custom', name: 'Custom Range', description: 'Select specific start and end dates' }
  ]

  const selectedType = exportTypes.find(type => type.id === exportOptions.type)

  const handleFieldToggle = (field: string) => {
    setExportOptions(prev => ({
      ...prev,
      includeFields: prev.includeFields.includes(field)
        ? prev.includeFields.filter(f => f !== field)
        : [...prev.includeFields, field]
    }))
  }

  const handleSelectAllFields = () => {
    if (!selectedType) return
    
    if (exportOptions.includeFields.length === selectedType.fields.length) {
      setExportOptions(prev => ({ ...prev, includeFields: [] }))
    } else {
      setExportOptions(prev => ({ ...prev, includeFields: [...selectedType.fields] }))
    }
  }

  const handleExport = async () => {
    setExporting(true)
    
    try {
      // Mock export process - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, this would trigger a file download
      console.log('Exporting with options:', exportOptions)
      
      // Show success message or redirect
      alert('Export completed successfully!')
      
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
            <h1 className="text-2xl font-bold text-gray-900">Export Data</h1>
            <p className="mt-1 text-sm text-gray-500">
              Export your business data in various formats
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Type Selection */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What would you like to export?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exportTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setExportOptions(prev => ({ ...prev, type: type.id, includeFields: [] }))}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    exportOptions.type === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <type.icon className="h-5 w-5 text-gray-600 mr-2" />
                    <h4 className="font-medium text-gray-900">{type.name}</h4>
                  </div>
                  <p className="text-sm text-gray-500">{type.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Format</h3>
            <div className="space-y-3">
              {formats.map((format) => (
                <label
                  key={format.id}
                  className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="format"
                    value={format.id}
                    checked={exportOptions.format === format.id}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as any }))}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{format.name}</div>
                    <div className="text-sm text-gray-500">{format.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Date Range</h3>
            <div className="space-y-3 mb-4">
              {dateRanges.map((range) => (
                <label
                  key={range.id}
                  className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="dateRange"
                    value={range.id}
                    checked={exportOptions.dateRange === range.id}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, dateRange: e.target.value as any }))}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{range.name}</div>
                    <div className="text-sm text-gray-500">{range.description}</div>
                  </div>
                </label>
              ))}
            </div>

            {exportOptions.dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={exportOptions.startDate || ''}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={exportOptions.endDate || ''}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Field Selection */}
          {selectedType && (
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Fields to Include</h3>
                <button
                  type="button"
                  onClick={handleSelectAllFields}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {exportOptions.includeFields.length === selectedType.fields.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {selectedType.fields.map((field) => (
                  <label
                    key={field}
                    className="flex items-center p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={exportOptions.includeFields.includes(field)}
                      onChange={() => handleFieldToggle(field)}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{field}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Export Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Summary</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Data Type</span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedType?.name || 'Not selected'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Format</span>
                <span className="text-sm font-medium text-gray-900">
                  {exportOptions.format.toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Date Range</span>
                <span className="text-sm font-medium text-gray-900">
                  {exportOptions.dateRange === 'custom' 
                    ? `${exportOptions.startDate ? formatDate(exportOptions.startDate) : 'Start'} - ${exportOptions.endDate ? formatDate(exportOptions.endDate) : 'End'}`
                    : dateRanges.find(r => r.id === exportOptions.dateRange)?.name
                  }
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fields</span>
                <span className="text-sm font-medium text-gray-900">
                  {exportOptions.includeFields.length} selected
                </span>
              </div>
            </div>

            {exportOptions.includeFields.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-green-700 font-medium">Ready to export</span>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button
                onClick={handleExport}
                disabled={exportOptions.includeFields.length === 0 || exporting}
                className="w-full btn btn-primary"
              >
                {exporting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Start Export
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
