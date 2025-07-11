'use client'

import { useState, useEffect } from 'react'
import { MapPin, Clock, Euro, Calendar, User, Mail, Phone, MessageSquare, CreditCard, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { validateEmail, validatePhone, validateName } from '@/lib/validation'

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

interface FormErrors {
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  general?: string
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
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [requiresPayment, setRequiresPayment] = useState(false)
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
      // Try to fetch from backend API first, then fallback to mock data
      const response = await fetch(`/api/public/${params.slug}`)
      
      if (response.ok) {
        const data = await response.json()
        // Map the API response to the expected structure
        const mappedData: BookingPageData = {
          id: data.id,
          name: data.businessName,
          businessName: data.businessName,
          businessAddress: data.address,
          businessPhone: data.phone,
          bookingPageTitle: data.businessName,
          bookingPageBio: data.description,
          avatar: data.images?.[0] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
          timezone: 'America/New_York',
          services: data.services.map((service: any) => ({
            id: service.id,
            name: service.name,
            description: service.description,
            duration: service.duration,
            price: service.price,
            color: service.color,
            maxAdvanceBook: service.maxAdvanceBook
          }))
        }
        setBookingData(mappedData)
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

  const handleBookNow = () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      setFormErrors({ general: 'Veuillez sélectionner un service, une date et une heure' })
      return
    }

    setRequiresPayment(selectedService.price > 0)
    setShowBookingForm(true)
    setFormErrors({})
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    // Validate name
    const nameValidation = validateName(formData.clientName)
    if (!nameValidation.success) {
      errors.clientName = nameValidation.errors?.[0]
    }

    // Validate email
    const emailValidation = validateEmail(formData.clientEmail)
    if (!emailValidation.success) {
      errors.clientEmail = emailValidation.errors?.[0]
    }

    // Validate phone (optional but must be valid if provided)
    if (formData.clientPhone.trim()) {
      const phoneValidation = validatePhone(formData.clientPhone)
      if (!phoneValidation.success) {
        errors.clientPhone = phoneValidation.errors?.[0]
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (!selectedService || !selectedDate || !selectedTime) {
      setFormErrors({ general: 'Informations de réservation manquantes' })
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
        clientEmail: formData.clientEmail,
        clientName: formData.clientName,
        clientPhone: formData.clientPhone || '',
        notes: formData.notes || '',
        requiresPayment: selectedService.price > 0,
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        // Show success message
        alert(`Réservation confirmée pour ${selectedService.name} le ${selectedDate.toLocaleDateString('fr-FR')} à ${selectedTime}`)
        
        // Reset form and state
        setSelectedService(null)
        setSelectedDate(new Date())
        setSelectedTime(null)
        setShowBookingForm(false)
        setFormData({
          serviceId: '',
          startTime: '',
          clientEmail: '',
          clientName: '',
          clientPhone: '',
          notes: '',
        })
        setFormErrors({})
      } else {
        const error = await response.json()
        setFormErrors({ general: error.error || 'Erreur lors de la réservation' })
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      setFormErrors({ general: 'Erreur lors de la réservation' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleBackToSelection = () => {
    setShowBookingForm(false)
    setFormErrors({})
    setFormData({
      serviceId: '',
      startTime: '',
      clientEmail: '',
      clientName: '',
      clientPhone: '',
      notes: '',
    })
  }

  const monthNames = [
    'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December', 'January', 'February', 'March'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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
              {dayNames.map((day, index) => (
                <div key={`day-${index}`} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day.charAt(0)}
                </div>
              ))}
              {getDaysInMonth(currentMonth).map((date, index) => (
                <div key={`date-${index}`} className="aspect-square">
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
                    key={`time-${index}`}
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

        {/* Booking Form or Book Now Button */}
        {showBookingForm ? (
          <div className="px-6 pb-8">
            {/* Booking Summary */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2">Résumé de votre réservation</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{selectedDate.toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Heure:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Durée:</span>
                  <span className="font-medium">{formatDuration(selectedService?.duration || 0)}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-blue-200">
                  <span>Prix:</span>
                  <span>{formatPrice(selectedService?.price || 0)}</span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vos informations</h3>
              
              {/* General Error */}
              {formErrors.general && (
                <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-red-700">{formErrors.general}</span>
                </div>
              )}

              {/* Name Field */}
              <Input
                label="Nom complet"
                icon={<User className="h-4 w-4" />}
                type="text"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                error={formErrors.clientName}
                placeholder="Votre nom complet"
                required
              />

              {/* Email Field */}
              <Input
                label="Adresse email"
                icon={<Mail className="h-4 w-4" />}
                type="email"
                value={formData.clientEmail}
                onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                error={formErrors.clientEmail}
                placeholder="votre@email.com"
                required
              />

              {/* Phone Field */}
              <Input
                label="Numéro de téléphone (optionnel)"
                icon={<Phone className="h-4 w-4" />}
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                error={formErrors.clientPhone}
                placeholder="+33 6 12 34 56 78"
              />

              {/* Notes Field */}
              <div className="form-field">
                <label className="form-label">
                  <MessageSquare className="h-4 w-4 inline-flex items-center mr-1" />
                  Notes (optionnel)
                </label>
                <textarea
                  className="form-textarea"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Informations supplémentaires..."
                  rows={3}
                />
              </div>

              {/* Payment Information */}
              {requiresPayment && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CreditCard className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="font-medium text-yellow-800">Paiement requis</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Un paiement de <strong>{formatPrice(selectedService?.price || 0)}</strong> sera requis pour confirmer votre réservation. 
                    Vous recevrez un lien de paiement sécurisé par email après la confirmation.
                  </p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleBackToSelection}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                    submitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {submitting ? 'Confirmation...' : 'Confirmer la réservation'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="px-6 pb-8">
            {formErrors.general && (
              <div className="flex items-center p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-red-700">{formErrors.general}</span>
              </div>
            )}
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
        )}
      </div>
    </div>
  )
}
