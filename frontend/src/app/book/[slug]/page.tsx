'use client'

import { useState, useEffect } from 'react'
import { MapPin, Clock, Euro, Calendar, User, Mail, Phone, MessageSquare } from 'lucide-react'

interface Service {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  color: string
  maxAdvanceBook: number
}

interface BookingPageData {
  id: string
  name?: string
  businessName?: string
  businessAddress?: string
  businessPhone?: string
  bookingPageTitle?: string
  bookingPageBio?: string
  avatar?: string
  timezone: string
  services: Service[]
}

interface BookingFormData {
  serviceId: string
  startTime: string
  clientEmail: string
  clientName: string
  clientPhone: string
  notes: string
}

export default function PublicBookingPage({ params }: { params: { slug: string } }) {
  const [bookingData, setBookingData] = useState<BookingPageData | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: '',
    startTime: '',
    clientEmail: '',
    clientName: '',
    clientPhone: '',
    notes: '',
  })

  useEffect(() => {
    fetchBookingPageData()
  }, [params.slug])

  useEffect(() => {
    if (selectedService && selectedDate) {
      fetchAvailableSlots()
    }
  }, [selectedService, selectedDate])

  const fetchBookingPageData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004'
      const response = await fetch(`${apiUrl}/api/public/${params.slug}`)
      
      if (response.ok) {
        const data = await response.json()
        setBookingData(data)
      } else {
        // Fallback to mock data for demo
        const mockData: BookingPageData = {
          id: '1',
          name: 'Barber Khalil',
          businessName: 'Barber Khalil',
          businessAddress: '123 Main St, Citytown',
          bookingPageTitle: 'Barber Khalil',
          bookingPageBio: 'Professional barber with 10+ years of experience',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
          timezone: 'Europe/Paris',
          services: [
            {
              id: '1',
              name: 'Coupe classique',
              duration: 20,
              price: 1500, // 15€ in cents
              color: '#3B82F6',
              maxAdvanceBook: 30
            },
            {
              id: '2',
              name: 'Fade + Barbe',
              duration: 30,
              price: 2500, // 25€ in cents
              color: '#10B981',
              maxAdvanceBook: 30
            },
            {
              id: '3',
              name: 'Coupe enfant',
              duration: 20,
              price: 1200, // 12€ in cents
              color: '#F59E0B',
              maxAdvanceBook: 30
            }
          ]
        }
        setBookingData(mockData)
      }
    } catch (error) {
      console.error('Error fetching booking page:', error)
      // Use mock data as fallback
      const mockData: BookingPageData = {
        id: '1',
        name: 'Barber Khalil',
        businessName: 'Barber Khalil',
        businessAddress: '123 Main St, Citytown',
        bookingPageTitle: 'Barber Khalil',
        bookingPageBio: 'Professional barber with 10+ years of experience',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        timezone: 'Europe/Paris',
        services: [
          {
            id: '1',
            name: 'Coupe classique',
            duration: 20,
            price: 1500,
            color: '#3B82F6',
            maxAdvanceBook: 30
          },
          {
            id: '2',
            name: 'Fade + Barbe',
            duration: 30,
            price: 2500,
            color: '#10B981',
            maxAdvanceBook: 30
          },
          {
            id: '3',
            name: 'Coupe enfant',
            duration: 20,
            price: 1200,
            color: '#F59E0B',
            maxAdvanceBook: 30
          }
        ]
      }
      setBookingData(mockData)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableSlots = async () => {
    // Mock available slots for the selected date
    const slots = ['10:00 AM', '11:00 AM', '1:00 PM', '1:30 PM', '2:00 PM']
    setAvailableSlots(slots)
  }

  const formatPrice = (price: number) => {
    return `${(price / 100).toFixed(0)}€`
  }

  const formatDuration = (minutes: number) => {
    return `${minutes} min`
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
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const isDateSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  const isDateAvailable = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today
  }

  const handleDateSelect = (date: Date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date)
      setSelectedTime(null)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleBookNow = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      alert('Veuillez sélectionner un service, une date et une heure')
      return
    }

    // For demo purposes, show a simple form
    const clientName = prompt('Votre nom complet:')
    const clientEmail = prompt('Votre email:')
    const clientPhone = prompt('Votre téléphone (optionnel):')

    if (!clientName || !clientEmail) {
      alert('Nom et email sont requis')
      return
    }

    setSubmitting(true)

    try {
      const [hours, minutes] = selectedTime.replace(/[AP]M/, '').split(':').map(Number)
      const isPM = selectedTime.includes('PM')
      const adjustedHours = isPM && hours !== 12 ? hours + 12 : (!isPM && hours === 12 ? 0 : hours)
      
      const startTime = new Date(selectedDate)
      startTime.setHours(adjustedHours, minutes, 0, 0)

      const bookingData = {
        serviceId: selectedService.id,
        startTime: startTime.toISOString(),
        clientEmail,
        clientName,
        clientPhone: clientPhone || '',
        notes: '',
        requiresPayment: selectedService.price > 0,
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004'
      const response = await fetch(`${apiUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        alert(`Réservation confirmée pour ${selectedService.name} le ${selectedDate.toLocaleDateString('fr-FR')} à ${selectedTime}`)
        // Reset form
        setSelectedService(null)
        setSelectedDate(new Date())
        setSelectedTime(null)
      } else {
        const error = await response.json()
        alert(error.error || 'Erreur lors de la réservation')
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Erreur lors de la réservation')
    } finally {
      setSubmitting(false)
    }
  }

  const monthNames = [
    'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December', 'January', 'February', 'March'
  ]

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page de réservation introuvable</h1>
          <p className="text-gray-600">La page de réservation que vous cherchez n'existe pas.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Profile Section */}
        <div className="px-6 pt-8 pb-6 text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-300 overflow-hidden shadow-lg">
            <img 
              src={bookingData.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'} 
              alt={bookingData.name || 'Profile'}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {bookingData.bookingPageTitle || bookingData.name}
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            {bookingData.businessAddress}
          </p>
          
          {/* Google Maps placeholder */}
          <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
            <div className="relative text-center z-10">
              <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <span className="text-sm text-gray-600 font-medium">Google</span>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="px-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Services</h2>
          <div className="space-y-3">
            {bookingData.services.map((service) => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all border ${
                  selectedService?.id === service.id 
                    ? 'bg-blue-50 border-blue-200 shadow-md' 
                    : 'hover:bg-gray-50 border-gray-200 hover:shadow-sm'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{service.name}</span>
                    <span className="font-bold text-gray-900">{formatPrice(service.price)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDuration(service.duration)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date and Time Selection */}
        <div className="px-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select a date and time</h2>
          
          {/* Calendar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <div className="text-sm text-gray-600">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentMonth).map((date, index) => (
                <div key={index} className="aspect-square">
                  {date && (
                    <button
                      onClick={() => handleDateSelect(date)}
                      disabled={!isDateAvailable(date)}
                      className={`w-full h-full flex items-center justify-center text-sm rounded-lg transition-colors ${
                        isDateSelected(date)
                          ? 'bg-blue-600 text-white shadow-md'
                          : isDateAvailable(date)
                          ? 'hover:bg-gray-100 text-gray-900'
                          : 'text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div className="mb-6">
              <div className="space-y-2">
                {availableSlots.map((time, index) => (
                  <button
                    key={index}
                    onClick={() => handleTimeSelect(time)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                      selectedTime === time
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 text-gray-900 hover:shadow-sm'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Book Now Button */}
        <div className="px-6 pb-8">
          <button
            onClick={handleBookNow}
            disabled={!selectedService || !selectedDate || !selectedTime || submitting}
            className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
              selectedService && selectedDate && selectedTime && !submitting
                ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {submitting ? 'Réservation en cours...' : 'Réserver maintenant'}
          </button>
        </div>
      </div>
    </div>
  )
}
