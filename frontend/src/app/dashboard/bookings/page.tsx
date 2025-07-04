'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Clock,
  User,
  Mail,
  Phone,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { apiRequest, API_CONFIG } from '@/lib/config'
import Link from 'next/link'

interface Service {
  id: string
  name: string
  duration: number
  price: number
  color: string
  category?: string
}

interface Client {
  id: string
  name: string
  email: string
  phone?: string
}

interface Booking {
  id: string
  startTime: string
  endTime: string
  service: Service
  client?: Client
  clientName?: string
  clientEmail: string
  clientPhone?: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  totalAmount?: number
  paymentStatus?: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED'
  notes?: string
  reminderSent?: boolean
  confirmationSent?: boolean
  createdAt: string
  updatedAt?: string
}

const statusConfig = {
  PENDING: { 
    label: 'Pending', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: AlertCircle,
    dotColor: '#F59E0B'
  },
  CONFIRMED: { 
    label: 'Confirmed', 
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    dotColor: '#10B981'
  },
  COMPLETED: { 
    label: 'Completed', 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: CheckCircle,
    dotColor: '#3B82F6'
  },
  CANCELLED: { 
    label: 'Cancelled', 
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    dotColor: '#EF4444'
  },
  NO_SHOW: { 
    label: 'No Show', 
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: XCircle,
    dotColor: '#6B7280'
  }
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedBookings, setSelectedBookings] = useState<string[]>([])

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchTerm, statusFilter])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      // Fetch all bookings from the API
      const response = await apiRequest(API_CONFIG.endpoints.bookings)
      
      if (response.ok) {
        const data = await response.json()
        
        // Check if we have real booking data from the API
        if (Array.isArray(data) && data.length > 0) {
          // Transform API data to match our interface
          const transformedBookings: Booking[] = data.map((booking: any) => ({
            id: booking.id,
            startTime: booking.startTime,
            endTime: booking.endTime,
            service: {
              id: booking.service.id,
              name: booking.service.name,
              duration: booking.service.duration,
              price: booking.service.price,
              color: booking.service.color || '#8B5CF6',
              category: booking.service.category || 'GENERAL'
            },
            client: booking.client ? {
              id: booking.client.id,
              name: booking.client.name,
              email: booking.client.email,
              phone: booking.client.phone
            } : undefined,
            clientName: booking.clientName || booking.client?.name,
            clientEmail: booking.clientEmail || booking.client?.email,
            clientPhone: booking.clientPhone || booking.client?.phone,
            status: booking.status,
            totalAmount: booking.totalAmount || booking.service.price,
            paymentStatus: booking.paymentStatus,
            notes: booking.notes,
            reminderSent: booking.reminderSent,
            confirmationSent: booking.confirmationSent,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
          }))
          setBookings(transformedBookings)
        } else {
          // Fallback to mock data if no real bookings exist
          const today = new Date()
          const mockBookings: Booking[] = [
            {
              id: '1',
              status: 'CONFIRMED',
              startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0).toISOString(),
              endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0).toISOString(),
              clientEmail: 'sarah.johnson@email.com',
              clientName: 'Sarah Johnson',
              clientPhone: '+1 (555) 123-4567',
              totalAmount: 4500,
              paymentStatus: 'PAID',
              reminderSent: true,
              confirmationSent: true,
              createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              service: {
                id: 'service1',
                name: 'Hair Cut & Styling',
                duration: 60,
                price: 4500,
                color: '#8B5CF6'
              }
            },
            {
              id: '2',
              status: 'PENDING',
              startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 0).toISOString(),
              endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 15, 30).toISOString(),
              clientEmail: 'emily.davis@email.com',
              clientName: 'Emily Davis',
              clientPhone: '+1 (555) 987-6543',
              totalAmount: 7500,
              paymentStatus: 'PENDING',
              reminderSent: false,
              confirmationSent: false,
              createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              service: {
                id: 'service2',
                name: 'Facial Treatment',
                duration: 90,
                price: 7500,
                color: '#10B981'
              }
            },
            {
              id: '3',
              status: 'COMPLETED',
              startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 9, 0).toISOString(),
              endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 10, 30).toISOString(),
              clientEmail: 'michael.brown@email.com',
              clientName: 'Michael Brown',
              clientPhone: '+1 (555) 456-7890',
              totalAmount: 8500,
              paymentStatus: 'PAID',
              reminderSent: true,
              confirmationSent: true,
              createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              service: {
                id: 'service3',
                name: 'Deep Tissue Massage',
                duration: 90,
                price: 8500,
                color: '#F59E0B'
              }
            },
            {
              id: '4',
              status: 'CANCELLED',
              startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 16, 0).toISOString(),
              endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 17, 0).toISOString(),
              clientEmail: 'jessica.wilson@email.com',
              clientName: 'Jessica Wilson',
              clientPhone: '+1 (555) 321-0987',
              totalAmount: 5500,
              paymentStatus: 'REFUNDED',
              reminderSent: false,
              confirmationSent: true,
              createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              service: {
                id: 'service4',
                name: 'Manicure & Pedicure',
                duration: 60,
                price: 5500,
                color: '#EF4444'
              }
            }
          ]
          setBookings(mockBookings)
        }
      } else {
        console.error('Failed to fetch bookings')
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      // Show empty state on error
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookings(prev =>
      prev.includes(bookingId)
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    )
  }

  const handleSelectAll = () => {
    if (selectedBookings.length === filteredBookings.length && filteredBookings.length > 0) {
      setSelectedBookings([])
    } else {
      setSelectedBookings(filteredBookings.map(booking => booking.id))
    }
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      // Update booking status
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() }
          : booking
      ))

      // Trigger calendar refresh if available
      if (typeof window !== 'undefined' && (window as any).refreshCalendar) {
        (window as any).refreshCalendar()
      }

      // Dispatch event for calendar refresh
      window.dispatchEvent(new CustomEvent('booking-updated'))
    } catch (error) {
      console.error('Error updating booking status:', error)
    }
  }

  const handleDeleteBooking = async (bookingId: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      try {
        // Remove booking from state
        setBookings(prev => prev.filter(booking => booking.id !== bookingId))
        setSelectedBookings(prev => prev.filter(id => id !== bookingId))

        // Trigger calendar refresh if available
        if (typeof window !== 'undefined' && (window as any).refreshCalendar) {
          (window as any).refreshCalendar()
        }

        // Dispatch event for calendar refresh
        window.dispatchEvent(new CustomEvent('booking-updated'))
      } catch (error) {
        console.error('Error deleting booking:', error)
      }
    }
  }

  const exportBookings = () => {
    const dataToExport = selectedBookings.length > 0 
      ? bookings.filter(booking => selectedBookings.includes(booking.id))
      : filteredBookings

    console.log('Exporting bookings:', dataToExport)
    // Implement actual export functionality here
  }

  const getStats = () => {
    const total = bookings.length
    const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length
    const pending = bookings.filter(b => b.status === 'PENDING').length
    const completed = bookings.filter(b => b.status === 'COMPLETED').length
    const revenue = bookings
      .filter(b => b.status === 'COMPLETED' || b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0)

    return { total, confirmed, pending, completed, revenue }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your appointments and reservations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportBookings}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={fetchBookings} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Link href="/dashboard/bookings/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.revenue)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Statuses</option>
              {Object.entries(statusConfig).map(([status, config]) => (
                <option key={status} value={status}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedBookings.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              {selectedBookings.length} selected
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={exportBookings}>
                <Download className="h-4 w-4 mr-1" />
                Export Selected
              </Button>
              <Button size="sm" variant="outline">
                <Mail className="h-4 w-4 mr-1" />
                Send Email
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Bookings Table */}
      <Card>
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Get started by creating your first booking.'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link href="/dashboard/bookings/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Booking
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => {
                  const StatusIcon = statusConfig[booking.status].icon
                  const isSelected = selectedBookings.includes(booking.id)

                  return (
                    <tr key={booking.id} className={`hover:bg-gray-50 ${isSelected ? 'bg-purple-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectBooking(booking.id)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.clientName || 'No name'}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {booking.clientEmail}
                            </div>
                            {booking.clientPhone && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {booking.clientPhone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: booking.service.color }}
                          ></div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.service.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.service.duration} minutes
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDateTime(booking.startTime)}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(booking.endTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <StatusIcon className="h-4 w-4 mr-2" style={{ color: statusConfig[booking.status].dotColor }} />
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[booking.status].color}`}>
                            {statusConfig[booking.status].label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.totalAmount ? formatCurrency(booking.totalAmount) : 'Free'}
                        </div>
                        {booking.paymentStatus && (
                          <div className="text-sm text-gray-500 capitalize">
                            {booking.paymentStatus.toLowerCase()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Link href={`/dashboard/bookings/${booking.id}/edit`}>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="relative">
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
