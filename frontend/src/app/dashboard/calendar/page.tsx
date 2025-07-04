'use client'

import { useState, useEffect } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

interface Service {
  id: string
  name: string
  duration: number
  price: number
  color: string
  category: string
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
  client: Client
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  notes?: string
  createdAt: string
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

const viewModes = [
  { id: 'month', label: 'Month' },
  { id: 'week', label: 'Week' },
  { id: 'day', label: 'Day' }
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [currentDate, viewMode])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchTerm, statusFilter])

  // Add refresh function to window object so other pages can trigger calendar refresh
  useEffect(() => {
    const refreshCalendar = () => {
      fetchBookings()
    }
    
    // Make refresh function available globally
    if (typeof window !== 'undefined') {
      (window as any).refreshCalendar = refreshCalendar
    }

    // Cleanup on unmount
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).refreshCalendar
      }
    }
  }, [])

  // Add event listener for storage changes (for cross-tab communication)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'booking-created' || e.key === 'booking-updated') {
        fetchBookings()
        // Clear the flag
        localStorage.removeItem(e.key)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom events in the same tab
    const handleBookingEvent = () => {
      fetchBookings()
    }

    window.addEventListener('booking-created', handleBookingEvent)
    window.addEventListener('booking-updated', handleBookingEvent)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('booking-created', handleBookingEvent)
      window.removeEventListener('booking-updated', handleBookingEvent)
    }
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      // Fetch all bookings without date restrictions to show everything on calendar
      const response = await fetch('/api/bookings')
      
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
            client: {
              id: booking.client?.id || booking.clientId,
              name: booking.clientName || booking.client?.name,
              email: booking.clientEmail || booking.client?.email,
              phone: booking.clientPhone || booking.client?.phone
            },
            status: booking.status,
            notes: booking.notes,
            createdAt: booking.createdAt
          }))
          setBookings(transformedBookings)
        } else {
          // Fallback to comprehensive mock data showing bookings across multiple days/weeks
          const today = new Date()
          const mockBookings: Booking[] = [
            // Today's appointments
            {
              id: '1',
              startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0).toISOString(),
              endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0).toISOString(),
              service: {
                id: '1',
                name: 'Hair Cut & Styling',
                duration: 60,
                price: 4500,
                color: '#8B5CF6',
                category: 'HAIR'
              },
              client: {
                id: '1',
                name: 'Sarah Johnson',
                email: 'sarah.johnson@email.com',
                phone: '+1 (555) 123-4567'
              },
              status: 'CONFIRMED',
              notes: 'First visit',
              createdAt: new Date().toISOString()
            },
            {
              id: '2',
              startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30).toISOString(),
              endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0).toISOString(),
              service: {
                id: '2',
                name: 'Facial Treatment',
                duration: 90,
                price: 7500,
                color: '#10B981',
                category: 'FACIAL'
              },
              client: {
                id: '2',
                name: 'Emily Davis',
                email: 'emily.davis@email.com',
                phone: '+1 (555) 987-6543'
              },
              status: 'PENDING',
              createdAt: new Date().toISOString()
            },
            {
              id: '3',
              startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0).toISOString(),
              endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30).toISOString(),
              service: {
                id: '3',
                name: 'Deep Tissue Massage',
                duration: 90,
                price: 8500,
                color: '#F59E0B',
                category: 'MASSAGE'
              },
              client: {
                id: '3',
                name: 'Michael Brown',
                email: 'michael.brown@email.com',
                phone: '+1 (555) 456-7890'
              },
              status: 'CONFIRMED',
              notes: 'Regular client - prefers firm pressure',
              createdAt: new Date().toISOString()
            },
            // Tomorrow's appointments
            {
              id: '4',
              startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0).toISOString(),
              endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 0).toISOString(),
              service: {
                id: '4',
                name: 'Manicure & Pedicure',
                duration: 60,
                price: 5500,
                color: '#EF4444',
                category: 'NAILS'
              },
              client: {
                id: '4',
                name: 'Jessica Wilson',
                email: 'jessica.wilson@email.com',
                phone: '+1 (555) 321-0987'
              },
              status: 'CONFIRMED',
              createdAt: new Date().toISOString()
            },
            {
              id: '5',
              startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 30).toISOString(),
              endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 16, 0).toISOString(),
              service: {
                id: '5',
                name: 'Swedish Massage',
                duration: 90,
                price: 9000,
                color: '#F59E0B',
                category: 'MASSAGE'
              },
              client: {
                id: '5',
                name: 'Robert Smith',
                email: 'robert.smith@email.com',
                phone: '+1 (555) 111-2222'
              },
              status: 'CONFIRMED',
              createdAt: new Date().toISOString()
            },
            // Day after tomorrow
            {
              id: '6',
              startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 15, 30).toISOString(),
              endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 17, 0).toISOString(),
              service: {
                id: '6',
                name: 'Color & Highlights',
                duration: 90,
                price: 12000,
                color: '#8B5CF6',
                category: 'HAIR'
              },
              client: {
                id: '6',
                name: 'Amanda Taylor',
                email: 'amanda.taylor@email.com',
                phone: '+1 (555) 654-3210'
              },
              status: 'PENDING',
              notes: 'Wants to go blonde',
              createdAt: new Date().toISOString()
            },
            // Next week appointments
            {
              id: '7',
              startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 9, 0).toISOString(),
              endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 10, 30).toISOString(),
              service: {
                id: '7',
                name: 'Eyebrow Threading',
                duration: 30,
                price: 3500,
                color: '#EC4899',
                category: 'EYEBROWS'
              },
              client: {
                id: '7',
                name: 'Lisa Chen',
                email: 'lisa.chen@email.com',
                phone: '+1 (555) 333-4444'
              },
              status: 'CONFIRMED',
              createdAt: new Date().toISOString()
            },
            {
              id: '8',
              startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8, 13, 0).toISOString(),
              endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8, 14, 0).toISOString(),
              service: {
                id: '8',
                name: 'Men\'s Haircut',
                duration: 60,
                price: 4000,
                color: '#6366F1',
                category: 'HAIR'
              },
              client: {
                id: '8',
                name: 'James Wilson',
                email: 'james.wilson@email.com',
                phone: '+1 (555) 555-6666'
              },
              status: 'CONFIRMED',
              createdAt: new Date().toISOString()
            },
            {
              id: '9',
              startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10, 11, 0).toISOString(),
              endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10, 12, 30).toISOString(),
              service: {
                id: '9',
                name: 'Anti-Aging Facial',
                duration: 90,
                price: 8500,
                color: '#10B981',
                category: 'FACIAL'
              },
              client: {
                id: '9',
                name: 'Maria Rodriguez',
                email: 'maria.rodriguez@email.com',
                phone: '+1 (555) 777-8888'
              },
              status: 'PENDING',
              notes: 'Sensitive skin',
              createdAt: new Date().toISOString()
            },
            // Previous week (for testing past appointments)
            {
              id: '10',
              startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3, 16, 0).toISOString(),
              endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3, 17, 0).toISOString(),
              service: {
                id: '10',
                name: 'Gel Manicure',
                duration: 60,
                price: 4500,
                color: '#EF4444',
                category: 'NAILS'
              },
              client: {
                id: '10',
                name: 'Jennifer Brown',
                email: 'jennifer.brown@email.com',
                phone: '+1 (555) 999-0000'
              },
              status: 'COMPLETED',
              createdAt: new Date().toISOString()
            },
            {
              id: '11',
              startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 10, 30).toISOString(),
              endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 11, 30).toISOString(),
              service: {
                id: '11',
                name: 'Beard Trim',
                duration: 60,
                price: 3000,
                color: '#6366F1',
                category: 'HAIR'
              },
              client: {
                id: '11',
                name: 'David Miller',
                email: 'david.miller@email.com',
                phone: '+1 (555) 123-9876'
              },
              status: 'COMPLETED',
              createdAt: new Date().toISOString()
            }
          ]
          setBookings(mockBookings)
        }
      } else {
        console.error('Failed to fetch bookings')
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      // Even on error, show mock data so calendar isn't empty
      const today = new Date()
      const fallbackBookings: Booking[] = [
        {
          id: 'fallback-1',
          startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0).toISOString(),
          endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0).toISOString(),
          service: {
            id: 'fallback-service-1',
            name: 'Sample Appointment',
            duration: 60,
            price: 5000,
            color: '#8B5CF6',
            category: 'HAIR'
          },
          client: {
            id: 'fallback-client-1',
            name: 'Sample Client',
            email: 'sample@email.com'
          },
          status: 'CONFIRMED',
          createdAt: new Date().toISOString()
        }
      ]
      setBookings(fallbackBookings)
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    return days
  }

  const getBookingsForDay = (date: Date | null) => {
    if (!date) return []
    
    return filteredBookings.filter(booking => {
      const bookingDate = new Date(booking.startTime)
      return (
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (viewMode === 'month') {
        newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1))
      } else if (viewMode === 'week') {
        newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7))
      } else {
        newDate.setDate(prev.getDate() + (direction === 'next' ? 1 : -1))
      }
      return newDate
    })
  }

  const updateBookingStatus = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      // API call would go here
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ))
    } catch (error) {
      console.error('Error updating booking status:', error)
    }
  }

  const deleteBooking = async (bookingId: string) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      try {
        // API call would go here
        setBookings(prev => prev.filter(booking => booking.id !== bookingId))
      } catch (error) {
        console.error('Error deleting booking:', error)
      }
    }
  }

  const getDateRangeText = () => {
    if (viewMode === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    } else if (viewMode === 'week') {
      const weekDays = getWeekDays(currentDate)
      const start = weekDays[0].toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
      const end = weekDays[6].toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      return `${start} - ${end}`
    } else {
      return formatDate(currentDate)
    }
  }

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate)
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayBookings = getBookingsForDay(day)
          const isToday = day && 
            day.getDate() === new Date().getDate() &&
            day.getMonth() === new Date().getMonth() &&
            day.getFullYear() === new Date().getFullYear()

          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border border-gray-200 cursor-pointer transition-colors ${
                day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
              } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
              onClick={() => day && setSelectedDate(day)}
            >
              {day && (
                <>
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayBookings.slice(0, 3).map(booking => (
                      <div
                        key={booking.id}
                        className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
                        style={{ 
                          backgroundColor: booking.service.color + '20',
                          borderLeft: `3px solid ${booking.service.color}`
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedBooking(booking)
                          setShowBookingModal(true)
                        }}
                      >
                        <div className="font-medium">{formatTime(booking.startTime)}</div>
                        <div className="text-gray-600 truncate">
                          {booking.service.name}
                        </div>
                        <div className="text-gray-500 truncate">
                          {booking.client.name}
                        </div>
                      </div>
                    ))}
                    {dayBookings.length > 3 && (
                      <div className="text-xs text-gray-500 p-1">
                        +{dayBookings.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate)
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="flex">
        {/* Time column */}
        <div className="w-16 flex-shrink-0">
          <div className="h-12"></div> {/* Header spacer */}
          {hours.map(hour => (
            <div key={hour} className="h-16 border-b border-gray-200 text-xs text-gray-500 p-1">
              {hour.toString().padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Days columns */}
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map((day, dayIndex) => {
            const dayBookings = getBookingsForDay(day)
            const isToday = day.getDate() === new Date().getDate() &&
              day.getMonth() === new Date().getMonth() &&
              day.getFullYear() === new Date().getFullYear()

            return (
              <div key={dayIndex} className="border-l border-gray-200">
                {/* Day header */}
                <div className={`h-12 p-2 border-b border-gray-200 text-center ${
                  isToday ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
                }`}>
                  <div className="text-xs">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="text-sm">{day.getDate()}</div>
                </div>

                {/* Hour slots */}
                <div className="relative">
                  {hours.map(hour => (
                    <div key={hour} className="h-16 border-b border-gray-200"></div>
                  ))}

                  {/* Bookings */}
                  {dayBookings.map(booking => {
                    const startHour = new Date(booking.startTime).getHours()
                    const startMinute = new Date(booking.startTime).getMinutes()
                    const duration = (new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / (1000 * 60)
                    const top = (startHour * 64) + (startMinute * 64 / 60)
                    const height = (duration * 64) / 60

                    return (
                      <div
                        key={booking.id}
                        className="absolute left-1 right-1 p-1 rounded text-xs cursor-pointer hover:opacity-80"
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          backgroundColor: booking.service.color + '90',
                          color: 'white'
                        }}
                        onClick={() => {
                          setSelectedBooking(booking)
                          setShowBookingModal(true)
                        }}
                      >
                        <div className="font-medium truncate">{booking.service.name}</div>
                        <div className="truncate">{booking.client.name}</div>
                        <div className="text-xs opacity-90">
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const dayBookings = getBookingsForDay(currentDate).sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )

    return (
      <div className="space-y-4">
        {dayBookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No appointments scheduled for this day</p>
          </div>
        ) : (
          dayBookings.map(booking => (
            <Card key={booking.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedBooking(booking)
                    setShowBookingModal(true)
                  }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: booking.service.color }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{booking.service.name}</h3>
                    <p className="text-sm text-gray-600">{booking.client.name}</p>
                    <p className="text-xs text-gray-500">{booking.client.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[booking.status].color}`}>
                    {statusConfig[booking.status].label}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    )
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your appointments and schedule
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/bookings/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by client, service..."
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
      </Card>

      {/* Calendar Controls */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">{getDateRangeText()}</h2>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {viewModes.map(mode => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === mode.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Calendar View */}
      <Card className="p-6">
        {viewMode === 'month' && (
          <>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            {renderMonthView()}
          </>
        )}
        
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
      </Card>

      {/* Today's Schedule (only show in month view) */}
      {viewMode === 'month' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
          {(() => {
            const todayBookings = getBookingsForDay(new Date()).sort((a, b) => 
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
            )
            
            if (todayBookings.length === 0) {
              return (
                <p className="text-gray-500 text-center py-4">
                  No appointments scheduled for today
                </p>
              )
            }

            return (
              <div className="space-y-3">
                {todayBookings.map(booking => {
                  const StatusIcon = statusConfig[booking.status].icon
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                         onClick={() => {
                           setSelectedBooking(booking)
                           setShowBookingModal(true)
                         }}>
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: booking.service.color }}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.service.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.client.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.client.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </p>
                        <div className="flex items-center justify-end mt-1">
                          <StatusIcon className="w-3 h-3 mr-1" style={{ color: statusConfig[booking.status].dotColor }} />
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[booking.status].color}`}>
                            {statusConfig[booking.status].label}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </Card>
      )}

      {/* Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Service */}
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedBooking.service.color }}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{selectedBooking.service.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedBooking.service.duration} min • ${(selectedBooking.service.price / 100).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(new Date(selectedBooking.startTime))}
                    </p>
                  </div>
                </div>

                {/* Client */}
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedBooking.client.name}</p>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="w-3 h-3 mr-1" />
                        {selectedBooking.client.email}
                      </div>
                      {selectedBooking.client.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="w-3 h-3 mr-1" />
                          {selectedBooking.client.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[selectedBooking.status].color}`}>
                      {statusConfig[selectedBooking.status].label}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {selectedBooking.notes && (
                  <div className="flex items-start space-x-3">
                    <Edit className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Notes</p>
                      <p className="text-sm text-gray-600">{selectedBooking.notes}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateBookingStatus(selectedBooking.id, 'CONFIRMED')}
                      disabled={selectedBooking.status === 'CONFIRMED'}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateBookingStatus(selectedBooking.id, 'COMPLETED')}
                      disabled={selectedBooking.status === 'COMPLETED'}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Complete
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/bookings/${selectedBooking.id}/edit`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteBooking(selectedBooking.id)}
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
