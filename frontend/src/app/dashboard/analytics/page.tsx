'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock,
  Filter,
  Download,
  RefreshCw,
  Star,
  Eye,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalRevenue: number
    totalBookings: number
    totalClients: number
    averageBookingValue: number
    revenueGrowth: number
    bookingsGrowth: number
    clientsGrowth: number
  }
  revenueByMonth: Array<{
    month: string
    revenue: number
    bookings: number
  }>
  servicePerformance: Array<{
    serviceName: string
    bookings: number
    revenue: number
    averageRating: number
    conversionRate: number
  }>
  clientMetrics: {
    newClients: number
    returningClients: number
    clientRetentionRate: number
  }
  timeSlotAnalysis: Array<{
    timeSlot: string
    bookings: number
    revenue: number
  }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockData: AnalyticsData = {
        overview: {
          totalRevenue: 125000, // in cents
          totalBookings: 156,
          totalClients: 89,
          averageBookingValue: 8013, // in cents
          revenueGrowth: 12.5,
          bookingsGrowth: 8.3,
          clientsGrowth: 15.2
        },
        revenueByMonth: [
          { month: 'Jan', revenue: 85000, bookings: 45 },
          { month: 'Feb', revenue: 92000, bookings: 52 },
          { month: 'Mar', revenue: 78000, bookings: 41 },
          { month: 'Apr', revenue: 105000, bookings: 58 },
          { month: 'May', revenue: 125000, bookings: 67 },
          { month: 'Jun', revenue: 118000, bookings: 63 }
        ],
        servicePerformance: [
          {
            serviceName: 'Consultation',
            bookings: 45,
            revenue: 45000,
            averageRating: 4.8,
            conversionRate: 85
          },
          {
            serviceName: 'Premium Service',
            bookings: 32,
            revenue: 64000,
            averageRating: 4.9,
            conversionRate: 78
          },
          {
            serviceName: 'Basic Service',
            bookings: 28,
            revenue: 16800,
            averageRating: 4.6,
            conversionRate: 92
          }
        ],
        clientMetrics: {
          newClients: 34,
          returningClients: 55,
          clientRetentionRate: 68
        },
        timeSlotAnalysis: [
          { timeSlot: '9:00 AM', bookings: 12, revenue: 12000 },
          { timeSlot: '10:00 AM', bookings: 18, revenue: 18000 },
          { timeSlot: '11:00 AM', bookings: 15, revenue: 15000 },
          { timeSlot: '2:00 PM', bookings: 22, revenue: 22000 },
          { timeSlot: '3:00 PM', bookings: 19, revenue: 19000 },
          { timeSlot: '4:00 PM', bookings: 16, revenue: 16000 }
        ]
      }
      setData(mockData)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAnalyticsData()
    setRefreshing(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner h-8 w-8"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data available</h3>
        <p className="text-gray-500">Data will appear here once you have bookings.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Detailed insights into your business performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn btn-outline btn-sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="btn btn-outline btn-sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(data.overview.totalRevenue)}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            {data.overview.revenueGrowth >= 0 ? (
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              data.overview.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatPercentage(data.overview.revenueGrowth)}
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{data.overview.totalBookings}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            {data.overview.bookingsGrowth >= 0 ? (
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              data.overview.bookingsGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatPercentage(data.overview.bookingsGrowth)}
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{data.overview.totalClients}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            {data.overview.clientsGrowth >= 0 ? (
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              data.overview.clientsGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatPercentage(data.overview.clientsGrowth)}
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Booking Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(data.overview.averageBookingValue)}
              </p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">
              {data.overview.totalBookings} bookings total
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Bookings</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {data.revenueByMonth.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900 w-8">{item.month}</span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(item.revenue / Math.max(...data.revenueByMonth.map(d => d.revenue))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.revenue)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.bookings} bookings
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Performance */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Performance</h3>
          <div className="space-y-4">
            {data.servicePerformance.map((service, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{service.serviceName}</h4>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">{service.averageRating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Bookings</p>
                    <p className="font-medium text-gray-900">{service.bookings}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Revenue</p>
                    <p className="font-medium text-green-600">{formatCurrency(service.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Conversion</p>
                    <p className="font-medium text-blue-600">{service.conversionRate}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Metrics */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Client Metrics</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">New Clients</p>
                <p className="text-2xl font-bold text-blue-600">{data.clientMetrics.newClients}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Returning Clients</p>
                <p className="text-2xl font-bold text-green-600">{data.clientMetrics.returningClients}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <RefreshCw className="h-6 w-6 text-green-600" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Client Retention Rate</p>
                <p className="text-sm font-bold text-purple-600">{data.clientMetrics.clientRetentionRate}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${data.clientMetrics.clientRetentionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Slot Analysis */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Popular Time Slots</h3>
          <div className="space-y-3">
            {data.timeSlotAnalysis.map((slot, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{slot.timeSlot}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{slot.bookings} bookings</div>
                    <div className="text-xs text-green-600">{formatCurrency(slot.revenue)}</div>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(slot.bookings / Math.max(...data.timeSlotAnalysis.map(s => s.bookings))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
