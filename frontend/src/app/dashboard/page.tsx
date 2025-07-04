'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  Settings,
  BarChart3,
  CalendarDays,
  Star,
  MapPin,
  Phone,
  Mail,
  Eye,
  Edit,
  Filter,
  Download,
  User
} from 'lucide-react'

interface DashboardStats {
  thisMonth: {
    bookings: number
    revenue: number
  }
  lastMonth: {
    bookings: number
    revenue: number
  }
  growth: {
    bookings: number
    revenue: number
  }
  upcomingBookings: any[]
  recentBookings: any[]
  servicePerformance: any[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const navigateTo = (path: string) => {
    router.push(path)
  }

  const fetchDashboardStats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004'
      const response = await fetch(`${apiUrl}/api/dashboard`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner h-8 w-8"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-sm text-gray-600">
                Welcome back! Here's an overview of your business performance.
              </p>
            </div>
            <div className="flex items-center space-x-3">
            <button className="btn btn-outline btn-sm" onClick={() => navigateTo('/dashboard/export')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => navigateTo('/dashboard/filter')}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => navigateTo('/dashboard/bookings/new')}>
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
              onClick={() => navigateTo('/dashboard/calendar')}
            >
              <CalendarDays className="h-8 w-8 text-blue-600 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">View Calendar</p>
                <p className="text-xs text-gray-500">Manage appointments</p>
              </div>
            </button>
            <button 
              className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
              onClick={() => navigateTo('/dashboard/services')}
            >
              <Settings className="h-8 w-8 text-gray-600 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Services</p>
                <p className="text-xs text-gray-500">Manage your services</p>
              </div>
            </button>
            <button 
              className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
              onClick={() => navigateTo('/dashboard/clients')}
            >
              <Users className="h-8 w-8 text-green-600 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Clients</p>
                <p className="text-xs text-gray-500">View client list</p>
              </div>
            </button>
            <button 
              className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
              onClick={() => navigateTo('/dashboard/analytics')}
            >
              <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Analytics</p>
                <p className="text-xs text-gray-500">Detailed reports</p>
              </div>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 overflow-hidden shadow-lg rounded-xl">
              <div className="p-6 text-white">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-8 w-8 text-blue-100" />
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-blue-100 truncate">
                        This Month's Bookings
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-3xl font-bold text-white">
                          {stats?.thisMonth.bookings || 0}
                        </div>
                        {stats?.growth.bookings !== undefined && (
                          <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stats.growth.bookings >= 0 ? 'text-green-200' : 'text-red-200'
                          }`}>
                            {stats.growth.bookings >= 0 ? (
                              <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                            ) : (
                              <TrendingDown className="self-center flex-shrink-0 h-4 w-4" />
                            )}
                            <span className="ml-1">
                              {Math.abs(stats.growth.bookings).toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 overflow-hidden shadow-lg rounded-xl">
              <div className="p-6 text-white">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-green-100" />
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-green-100 truncate">
                        This Month's Revenue
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-3xl font-bold text-white">
                          {formatCurrency(stats?.thisMonth.revenue || 0)}
                        </div>
                        {stats?.growth.revenue !== undefined && (
                          <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stats.growth.revenue >= 0 ? 'text-green-200' : 'text-red-200'
                          }`}>
                            {stats.growth.revenue >= 0 ? (
                              <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                            ) : (
                              <TrendingDown className="self-center flex-shrink-0 h-4 w-4" />
                            )}
                            <span className="ml-1">
                              {Math.abs(stats.growth.revenue).toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 overflow-hidden shadow-lg rounded-xl">
              <div className="p-6 text-white">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-purple-100" />
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-purple-100 truncate">
                        Upcoming This Week
                      </dt>
                      <dd className="text-3xl font-bold text-white">
                        {stats?.upcomingBookings.length || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 overflow-hidden shadow-lg rounded-xl">
              <div className="p-6 text-white">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Star className="h-8 w-8 text-orange-100" />
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-orange-100 truncate">
                        Active Services
                      </dt>
                      <dd className="text-3xl font-bold text-white">
                        {stats?.servicePerformance.length || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Upcoming Bookings */}
          <div className="lg:col-span-2 bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Upcoming Bookings
                </h3>
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => navigateTo('/dashboard/bookings')}
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats?.upcomingBookings.length ? (
                  stats.upcomingBookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.service.name}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {booking.clientName || booking.clientEmail}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(booking.startTime)}
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          {formatCurrency(booking.totalAmount || 0)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No upcoming bookings this week</p>
                    <button 
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => navigateTo('/dashboard/bookings/new')}
                    >
                      Create a booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats?.recentBookings.length ? (
                  stats.recentBookings.slice(0, 4).map((booking) => (
                    <div key={booking.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        booking.status === 'CONFIRMED' ? 'bg-green-400' :
                        booking.status === 'PENDING' ? 'bg-yellow-400' :
                        booking.status === 'CANCELLED' ? 'bg-red-400' :
                        'bg-gray-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{booking.service.name}</span> booking
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.clientName || booking.clientEmail} • {formatDate(booking.startTime)}
                        </p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status.toLowerCase()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Service Performance */}
        {stats?.servicePerformance.length ? (
          <div className="bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Service Performance This Month
                </h3>
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => navigateTo('/dashboard/services')}
                >
                  View Details
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.servicePerformance.map((service, index) => (
                  <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {service.serviceName}
                      </h4>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Bookings</span>
                        <span className="text-sm font-medium text-gray-900">
                          {service.bookings}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Revenue</span>
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency(service.revenue)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-8 text-center">
            <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Service Data</h3>
            <p className="text-gray-500 mb-4">Start by creating your first service to see performance metrics.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigateTo('/dashboard/services/new')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Service
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
