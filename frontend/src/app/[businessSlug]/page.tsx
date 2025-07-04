'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Star,
  Check,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Heart,
  Shield,
  Award,
  Users,
  MessageSquare,
  Camera,
  Instagram,
  Facebook,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Service, ServiceCategory } from '@/shared/types/service'

interface BusinessProfile {
  id: string
  businessName: string
  slug: string
  description: string
  address: string
  phone: string
  email: string
  website?: string
  socialMedia: {
    instagram?: string
    facebook?: string
  }
  openingHours: {
    [key: string]: { open: string; close: string; closed: boolean }
  }
  images: string[]
  rating: number
  reviewCount: number
  specialties: string[]
  certifications: string[]
}

interface TimeSlot {
  time: string
  available: boolean
  reason?: string
}

interface BookingForm {
  serviceId: string
  date: string
  time: string
  clientName: string
  clientEmail: string
  clientPhone: string
  notes: string
}

export default function PublicBookingPage() {
  const params = useParams()
  const businessSlug = params.businessSlug as string
  
  const [business, setBusiness] = useState<BusinessProfile | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    serviceId: '',
    date: '',
    time: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    notes: ''
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    fetchBusinessData()
  }, [businessSlug])

  useEffect(() => {
    if (selectedService && selectedDate) {
      generateAvailableSlots()
    }
  }, [selectedService, selectedDate])

  const fetchBusinessData = async () => {
    try {
      // Fetch business data from API
      const response = await fetch(`/api/public/${businessSlug}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setBusiness(null)
          setLoading(false)
          return
        }
        throw new Error('Failed to fetch business data')
      }
      
      const businessData = await response.json()
      
      // Convert API response to BusinessProfile format
      const business: BusinessProfile = {
        id: businessData.id,
        businessName: businessData.businessName,
        slug: businessData.slug,
        description: businessData.description,
        address: businessData.address,
        phone: businessData.phone,
        email: businessData.email,
        website: businessData.website,
        socialMedia: businessData.socialMedia,
        openingHours: businessData.openingHours,
        images: businessData.images,
        rating: businessData.rating,
        reviewCount: businessData.reviewCount,
        specialties: businessData.specialties,
        certifications: businessData.certifications
      }
      
      // Convert services to the expected format
      const services: Service[] = businessData.services.map((service: any) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        color: service.color,
        category: service.category as ServiceCategory,
        isActive: service.isActive,
        bufferTime: service.bufferTime,
        maxAdvanceBook: service.maxAdvanceBook,
        userId: 'user1', // This would come from the API in a real implementation
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      
      setBusiness(business)
      setServices(services)
    } catch (error) {
      console.error('Error fetching business data:', error)
      setBusiness(null)
    } finally {
      setLoading(false)
    }
  }

  const generateAvailableSlots = () => {
    if (!business || !selectedService) return

    const today = new Date()
    const selectedDateObj = new Date(selectedDate)
    const dayName = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    const daySchedule = business.openingHours[dayName]

    if (daySchedule.closed) {
      setAvailableSlots([])
      return
    }

    const slots: TimeSlot[] = []
    const [openHour, openMinute] = daySchedule.open.split(':').map(Number)
    const [closeHour, closeMinute] = daySchedule.close.split(':').map(Number)

    let currentHour = openHour
    let currentMinute = openMinute

    while (currentHour < closeHour || (currentHour === closeHour && currentMinute < closeMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
      
      // Check if slot is in the past for today
      const isToday = selectedDateObj.toDateString() === today.toDateString()
      const isPast = isToday && (currentHour < today.getHours() || 
        (currentHour === today.getHours() && currentMinute <= today.getMinutes()))

      // Simulate some unavailable slots
      const isUnavailable = ['10:30', '15:00', '16:30'].includes(timeString)

      slots.push({
        time: timeString,
        available: !isPast && !isUnavailable,
        reason: isPast ? 'Passé' : isUnavailable ? 'Réservé' : undefined
      })

      // Add 30 minutes
      currentMinute += 30
      if (currentMinute >= 60) {
        currentMinute = 0
        currentHour += 1
      }
    }

    setAvailableSlots(slots)
  }

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setBookingForm(prev => ({ ...prev, serviceId: service.id }))
    setErrors({})
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    setBookingForm(prev => ({ ...prev, date, time: '' }))
    setErrors({})
  }

  const handleTimeSelect = (time: string) => {
    setBookingForm(prev => ({ ...prev, time }))
    setErrors({})
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1 && !selectedService) {
      newErrors.service = 'Veuillez sélectionner un service'
    }

    if (step === 2) {
      if (!bookingForm.date) {
        newErrors.date = 'Veuillez sélectionner une date'
      }
      if (!bookingForm.time) {
        newErrors.time = 'Veuillez sélectionner un créneau'
      }
    }

    if (step === 3) {
      if (!bookingForm.clientName.trim()) {
        newErrors.clientName = 'Votre nom est requis'
      }
      if (!bookingForm.clientEmail.trim()) {
        newErrors.clientEmail = 'Votre email est requis'
      } else if (!/\S+@\S+\.\S+/.test(bookingForm.clientEmail)) {
        newErrors.clientEmail = 'Format d\'email invalide'
      }
      if (!bookingForm.clientPhone.trim()) {
        newErrors.clientPhone = 'Votre téléphone est requis'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const submitBooking = async () => {
    if (!validateStep(3)) return

    setSubmitting(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setBookingSuccess(true)
      setCurrentStep(4)
    } catch (error) {
      console.error('Error submitting booking:', error)
      setErrors({ submit: 'Erreur lors de la réservation' })
    } finally {
      setSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `${(amount / 100).toFixed(2)}€`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + (selectedService?.maxAdvanceBook || 30))
    return maxDate.toISOString().split('T')[0]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Salon non trouvé</h1>
          <p className="text-gray-600">Le salon que vous recherchez n'existe pas ou n'est plus disponible.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{business.businessName}</h1>
                <p className="text-sm text-gray-600">Réservation en ligne</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 text-sm font-medium text-gray-900">{business.rating}</span>
                <span className="text-sm text-gray-500">({business.reviewCount} avis)</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Choisissez votre service</h2>
                
                {errors.service && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700">{errors.service}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <Card
                      key={service.id}
                      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedService?.id === service.id
                          ? 'ring-2 ring-purple-500 bg-purple-50'
                          : 'hover:shadow-lg'
                      }`}
                      onClick={() => handleServiceSelect(service)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        {selectedService?.id === service.id && (
                          <Check className="w-5 h-5 text-purple-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {service.duration} min
                        </div>
                        <div className="text-lg font-bold text-purple-600">
                          {formatCurrency(service.price)}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={nextStep}
                    disabled={!selectedService}
                    className="px-8"
                  >
                    Continuer
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Choisissez votre créneau</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Date souhaitée
                    </label>
                    {errors.date && (
                      <div className="mb-3 text-red-600 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.date}
                      </div>
                    )}
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      min={getTodayDate()}
                      max={getMaxDate()}
                      className="text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Créneaux disponibles
                    </label>
                    {errors.time && (
                      <div className="mb-3 text-red-600 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.time}
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => slot.available && handleTimeSelect(slot.time)}
                          className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                            !slot.available
                              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                              : bookingForm.time === slot.time
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                          }`}
                          title={!slot.available ? slot.reason : undefined}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Retour
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={!bookingForm.date || !bookingForm.time}
                    className="px-8"
                  >
                    Continuer
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Vos informations</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Nom complet *
                    </label>
                    {errors.clientName && (
                      <div className="mb-2 text-red-600 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.clientName}
                      </div>
                    )}
                    <Input
                      type="text"
                      value={bookingForm.clientName}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, clientName: e.target.value }))}
                      placeholder="Votre nom complet"
                      className={errors.clientName ? 'border-red-300' : ''}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email *
                    </label>
                    {errors.clientEmail && (
                      <div className="mb-2 text-red-600 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.clientEmail}
                      </div>
                    )}
                    <Input
                      type="email"
                      value={bookingForm.clientEmail}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, clientEmail: e.target.value }))}
                      placeholder="votre@email.com"
                      className={errors.clientEmail ? 'border-red-300' : ''}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Téléphone *
                    </label>
                    {errors.clientPhone && (
                      <div className="mb-2 text-red-600 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.clientPhone}
                      </div>
                    )}
                    <Input
                      type="tel"
                      value={bookingForm.clientPhone}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, clientPhone: e.target.value }))}
                      placeholder="+33 6 12 34 56 78"
                      className={errors.clientPhone ? 'border-red-300' : ''}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      Notes (optionnel)
                    </label>
                    <textarea
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Demandes particulières, allergies, préférences..."
                    />
                  </div>
                </div>

                {errors.submit && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700">{errors.submit}</span>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Retour
                  </Button>
                  <Button
                    onClick={submitBooking}
                    disabled={submitting}
                    className="px-8"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Réservation...
                      </>
                    ) : (
                      'Confirmer la réservation'
                    )}
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === 4 && bookingSuccess && (
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Réservation confirmée !</h2>
                <p className="text-gray-600 mb-6">
                  Votre rendez-vous a été enregistré avec succès. Vous recevrez une confirmation par email.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Récapitulatif</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{formatDate(bookingForm.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Heure:</span>
                      <span className="font-medium">{bookingForm.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée:</span>
                      <span className="font-medium">{selectedService?.duration} min</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-gray-600">Prix:</span>
                      <span className="font-bold text-purple-600">
                        {selectedService && formatCurrency(selectedService.price)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  Un email de confirmation a été envoyé à {bookingForm.clientEmail}
                </p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations du salon</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Adresse</p>
                    <p className="text-sm text-gray-600">{business.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Téléphone</p>
                    <p className="text-sm text-gray-600">{business.phone}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Horaires</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      {Object.entries(business.openingHours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="capitalize">{day}:</span>
                          <span>
                            {hours.closed ? 'Fermé' : `${hours.open} - ${hours.close}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Spécialités</h4>
                  <div className="flex flex-wrap gap-2">
                    {business.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Certifications</h4>
                  <div className="space-y-1">
                    {business.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <Award className="w-4 h-4 text-yellow-500 mr-2" />
                        {cert}
                      </div>
                    ))}
                  </div>
                </div>

                {business.socialMedia && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Suivez-nous</h4>
                    <div className="flex space-x-3">
                      {business.socialMedia.instagram && (
                        <a
                          href={`https://instagram.com/${business.socialMedia.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:text-pink-600"
                        >
                          <Instagram className="w-5 h-5" />
                        </a>
                      )}
                      {business.socialMedia.facebook && (
                        <a
                          href={`https://facebook.com/${business.socialMedia.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Facebook className="w-5 h-5" />
                        </a>
                      )}
                      {business.website && (
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-700"
                        >
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Récapitulatif de réservation */}
            {(selectedService || bookingForm.date || bookingForm.time) && (
              <Card className="p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Votre réservation</h3>
                
                <div className="space-y-3">
                  {selectedService && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Service:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedService.name}
                      </span>
                    </div>
                  )}
                  
                  {bookingForm.date && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Date:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(bookingForm.date)}
                      </span>
                    </div>
                  )}
                  
                  {bookingForm.time && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Heure:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {bookingForm.time}
                      </span>
                    </div>
                  )}
                  
                  {selectedService && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Durée:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedService.duration} min
                        </span>
                      </div>
                      
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-base font-medium text-gray-900">Prix:</span>
                        <span className="text-lg font-bold text-purple-600">
                          {formatCurrency(selectedService.price)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
