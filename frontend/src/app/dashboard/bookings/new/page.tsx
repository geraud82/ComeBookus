'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Save, 
  ArrowLeft,
  ArrowRight,
  Plus,
  Search,
  Check,
  AlertCircle,
  Users,
  MapPin,
  FileText,
  DollarSign,
  ChevronDown,
  X,
  UserPlus,
  Sparkles,
  CheckCircle2,
  Star,
  Heart,
  Zap,
  Gift,
  Info,
  Calendar as CalendarIcon2,
  Timer,
  Repeat,
  Bell,
  MessageSquare,
  Camera,
  Scissors,
  Palette
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface Service {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  color: string
  category?: string
  isActive?: boolean
  bufferTime?: number
  maxAdvanceBook?: number
}

interface Client {
  id: string
  name: string
  email: string
  phone?: string
  lastVisit?: string
  totalBookings: number
}

interface TimeSlot {
  time: string
  available: boolean
  reason?: string
}

interface CreateBookingData {
  serviceId: string
  startTime: Date
  clientEmail: string
  clientName: string
  clientPhone: string
  notes: string
  requiresPayment: boolean
}

export default function NewBookingPage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [step, setStep] = useState(1)
  const [searchClient, setSearchClient] = useState('')
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [formData, setFormData] = useState<CreateBookingData>({
    serviceId: '',
    startTime: new Date(),
    clientEmail: '',
    clientName: '',
    clientPhone: '',
    notes: '',
    requiresPayment: false
  })
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringType, setRecurringType] = useState<'weekly' | 'monthly'>('weekly')
  const [recurringCount, setRecurringCount] = useState(4)
  const [sendReminder, setSendReminder] = useState(true)
  const [reminderTime, setReminderTime] = useState(24)
  const [specialRequests, setSpecialRequests] = useState('')

  useEffect(() => {
    fetchServices()
    fetchClients()
  }, [])

  useEffect(() => {
    if (selectedService && selectedDate) {
      generateAvailableSlots()
    }
  }, [selectedService, selectedDate])

  const fetchServices = async () => {
    try {
      // Try to fetch real services from API
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          setServices(data)
          return
        }
      }

      // Fallback to mock data
      const mockServices: Service[] = [
        {
          id: '1',
          name: 'Hair Cut & Styling',
          description: 'Professional haircut with styling',
          duration: 60,
          price: 4500,
          color: '#8B5CF6',
          category: 'HAIR',
          isActive: true,
          bufferTime: 15,
          maxAdvanceBook: 30
        },
        {
          id: '2',
          name: 'Facial Treatment',
          description: 'Complete facial treatment with cleansing and hydration',
          duration: 90,
          price: 7500,
          color: '#10B981',
          category: 'FACIAL',
          isActive: true,
          bufferTime: 15,
          maxAdvanceBook: 60
        },
        {
          id: '3',
          name: 'Manicure',
          description: 'Nail care with polish application',
          duration: 45,
          price: 3500,
          color: '#F59E0B',
          category: 'NAILS',
          isActive: true,
          bufferTime: 10,
          maxAdvanceBook: 14
        },
        {
          id: '4',
          name: 'Relaxing Massage',
          description: '60-minute relaxation massage',
          duration: 60,
          price: 6500,
          color: '#EF4444',
          category: 'MASSAGE',
          isActive: true,
          bufferTime: 20,
          maxAdvanceBook: 21
        },
        {
          id: '5',
          name: 'Hair Coloring',
          description: 'Complete hair coloring with treatment',
          duration: 120,
          price: 8500,
          color: '#6366F1',
          category: 'HAIR',
          isActive: true,
          bufferTime: 30,
          maxAdvanceBook: 45
        },
        {
          id: '6',
          name: 'Eyebrow Threading',
          description: 'Eyebrow threading and shaping',
          duration: 30,
          price: 2500,
          color: '#EC4899',
          category: 'EYEBROWS',
          isActive: true,
          bufferTime: 5,
          maxAdvanceBook: 7
        }
      ]
      setServices(mockServices)
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const fetchClients = async () => {
    try {
      // Try to fetch real clients from API
      const response = await fetch('/api/clients')
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          setClients(data)
          return
        }
      }

      // Fallback to mock data
      const mockClients: Client[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 123-4567',
          lastVisit: '2024-01-15',
          totalBookings: 12
        },
        {
          id: '2',
          name: 'Emily Davis',
          email: 'emily.davis@email.com',
          phone: '+1 (555) 987-6543',
          lastVisit: '2024-01-10',
          totalBookings: 8
        },
        {
          id: '3',
          name: 'Michael Brown',
          email: 'michael.brown@email.com',
          phone: '+1 (555) 456-7890',
          lastVisit: '2024-01-08',
          totalBookings: 15
        },
        {
          id: '4',
          name: 'Jessica Wilson',
          email: 'jessica.wilson@email.com',
          phone: '+1 (555) 321-0987',
          totalBookings: 3
        }
      ]
      setClients(mockClients)
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const generateAvailableSlots = () => {
    // Generate available time slots
    const baseSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ]
    
    const slots: TimeSlot[] = baseSlots.map(time => {
      // Simulate some unavailable slots
      const unavailable = ['10:30', '15:00'].includes(time)
      return {
        time,
        available: !unavailable,
        reason: unavailable ? 'Already booked' : undefined
      }
    })
    
    setAvailableSlots(slots)
  }

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setFormData(prev => ({
      ...prev,
      serviceId: service.id,
      requiresPayment: service.price > 0
    }))
    setErrors(prev => ({ ...prev, service: '' }))
  }

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client)
    setFormData(prev => ({
      ...prev,
      clientEmail: client.email,
      clientName: client.name,
      clientPhone: client.phone || ''
    }))
    setShowNewClientForm(false)
    setErrors(prev => ({ ...prev, client: '' }))
  }

  const handleDateChange = (date: string) => {
    const newDate = new Date(date)
    setSelectedDate(newDate)
    setFormData(prev => ({
      ...prev,
      startTime: newDate
    }))
    setErrors(prev => ({ ...prev, date: '' }))
  }

  const handleTimeSelect = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    const newDate = new Date(selectedDate)
    newDate.setHours(hours, minutes, 0, 0)
    setFormData(prev => ({
      ...prev,
      startTime: newDate
    }))
    setErrors(prev => ({ ...prev, time: '' }))
  }

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {}

    if (stepNumber === 1) {
      if (!selectedService) {
        newErrors.service = 'Please select a service'
      }
    }

    if (stepNumber === 2) {
      if (!selectedDate) {
        newErrors.date = 'Please select a date'
      }
      if (!formData.startTime || formData.startTime.getHours() === 0) {
        newErrors.time = 'Please select a time slot'
      }
    }

    if (stepNumber === 3) {
      if (!formData.clientEmail) {
        newErrors.clientEmail = 'Client email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
        newErrors.clientEmail = 'Invalid email format'
      }
      if (!formData.clientName) {
        newErrors.clientName = 'Client name is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(3)) return

    setSaving(true)

    try {
      // Calculate end time
      const endTime = new Date(formData.startTime)
      endTime.setMinutes(endTime.getMinutes() + (selectedService?.duration || 60))

      const bookingData = {
        serviceId: formData.serviceId,
        serviceName: selectedService?.name,
        serviceColor: selectedService?.color,
        serviceCategory: selectedService?.category,
        duration: selectedService?.duration,
        price: selectedService?.price,
        startTime: formData.startTime.toISOString(),
        endTime: endTime.toISOString(),
        clientEmail: formData.clientEmail,
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        notes: formData.notes,
        requiresPayment: formData.requiresPayment
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        // Show success step
        setStep(4)

        // Trigger calendar refresh if available
        if (typeof window !== 'undefined' && (window as any).refreshCalendar) {
          (window as any).refreshCalendar()
        }

        // Dispatch event for calendar refresh
        window.dispatchEvent(new CustomEvent('booking-created'))
        
        // Set localStorage flag for cross-tab communication
        localStorage.setItem('booking-created', Date.now().toString())

        // Redirect after showing success
        setTimeout(() => {
          router.push('/dashboard/bookings')
        }, 2000)
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.error || 'Error creating booking' })
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      setErrors({ submit: 'Error creating booking' })
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

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const getEndTime = () => {
    if (!selectedService) return null
    const endTime = new Date(formData.startTime)
    endTime.setMinutes(endTime.getMinutes() + selectedService.duration)
    return endTime
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchClient.toLowerCase()) ||
    client.email.toLowerCase().includes(searchClient.toLowerCase())
  )

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((stepNumber) => (
        <div key={stepNumber} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
            step > stepNumber 
              ? 'bg-green-500 text-white' 
              : step === stepNumber 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-600'
          }`}>
            {step > stepNumber ? <Check className="w-5 h-5" /> : stepNumber}
          </div>
          {stepNumber < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              step > stepNumber ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderServiceSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Service</h2>
        <p className="text-gray-600">Select the service you want to book</p>
      </div>

      {errors.service && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{errors.service}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
              selectedService?.id === service.id
                ? 'ring-2 ring-purple-500 bg-purple-50'
                : 'hover:shadow-md'
            }`}
            onClick={() => handleServiceSelect(service)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: service.color }}
                />
                <h3 className="font-semibold text-gray-900">{service.name}</h3>
              </div>
              {selectedService?.id === service.id && (
                <CheckCircle2 className="w-5 h-5 text-purple-500" />
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
            
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
    </div>
  )

  const renderDateTimeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Date and Time</h2>
        <p className="text-gray-600">Select the time slot that works for you</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Calendar className="w-4 h-4 inline mr-2" />
            Appointment Date
          </label>
          {errors.date && (
            <div className="mb-3 text-red-600 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.date}
            </div>
          )}
          <Input
            type="date"
            value={formatDate(selectedDate)}
            onChange={(e) => handleDateChange(e.target.value)}
            min={formatDate(new Date())}
            className="text-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Clock className="w-4 h-4 inline mr-2" />
            Available Time Slots
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
                    : formData.startTime.toTimeString().startsWith(slot.time)
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
    </div>
  )

  const renderClientSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Client Information</h2>
        <p className="text-gray-600">Select an existing client or create a new one</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search for a client..."
              value={searchClient}
              onChange={(e) => setSearchClient(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowNewClientForm(!showNewClientForm)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          New Client
        </Button>
      </div>

      {!showNewClientForm && (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {filteredClients.map((client) => (
            <Card
              key={client.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedClient?.id === client.id
                  ? 'ring-2 ring-purple-500 bg-purple-50'
                  : ''
              }`}
              onClick={() => handleClientSelect(client)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-600">{client.email}</p>
                    {client.phone && (
                      <p className="text-sm text-gray-500">{client.phone}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {client.totalBookings} appointments
                  </div>
                  {client.lastVisit && (
                    <div className="text-xs text-gray-400">
                      Last visit: {new Date(client.lastVisit).toLocaleDateString('en-US')}
                    </div>
                  )}
                  {selectedClient?.id === client.id && (
                    <CheckCircle2 className="w-5 h-5 text-purple-500 mt-1" />
                  )}
                </div>
              </div>
            </Card>
          ))}
          {filteredClients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No clients found</p>
            </div>
          )}
        </div>
      )}

      {showNewClientForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">New Client</h3>
            <button
              type="button"
              onClick={() => setShowNewClientForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                value={formData.clientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                placeholder="client@example.com"
                className={errors.clientEmail ? 'border-red-300' : ''}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Full Name *
              </label>
              {errors.clientName && (
                <div className="mb-2 text-red-600 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.clientName}
                </div>
              )}
              <Input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                placeholder="John Doe"
                className={errors.clientName ? 'border-red-300' : ''}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone
              </label>
              <Input
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Special information, allergies, preferences..."
              />
            </div>
          </div>
        </Card>
      )}

      {/* Advanced Options */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-purple-500" />
          Advanced Options
        </h3>
        
        <div className="space-y-6">
          {/* Recurring Appointments */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                id="isRecurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700 flex items-center">
                <Repeat className="w-4 h-4 mr-1" />
                Recurring Appointment
              </label>
            </div>
            
            {isRecurring && (
              <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Frequency</label>
                  <select
                    value={recurringType}
                    onChange={(e) => setRecurringType(e.target.value as 'weekly' | 'monthly')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Number of repetitions</label>
                  <select
                    value={recurringCount}
                    onChange={(e) => setRecurringCount(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    {[2, 3, 4, 5, 6, 8, 10, 12].map(count => (
                      <option key={count} value={count}>{count} times</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Automatic Reminders */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                id="sendReminder"
                checked={sendReminder}
                onChange={(e) => setSendReminder(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="sendReminder" className="text-sm font-medium text-gray-700 flex items-center">
                <Bell className="w-4 h-4 mr-1" />
                Send automatic reminder
              </label>
            </div>
            
            {sendReminder && (
              <div className="ml-6">
                <label className="block text-sm text-gray-600 mb-1">Reminder timing</label>
                <select
                  value={reminderTime}
                  onChange={(e) => setReminderTime(parseInt(e.target.value))}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value={1}>1 hour before</option>
                  <option value={2}>2 hours before</option>
                  <option value={4}>4 hours before</option>
                  <option value={24}>24 hours before</option>
                  <option value={48}>48 hours before</option>
                </select>
              </div>
            )}
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              Special Requests
            </label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Special client requests (specific equipment, preparation...)"
            />
          </div>
        </div>
      </Card>
    </div>
  )

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Created Successfully!</h2>
        <p className="text-gray-600">
          The appointment has been saved and a confirmation has been sent to the client.
        </p>
      </div>

      <Card className="p-6 max-w-md mx-auto">
        <h3 className="font-semibold text-gray-900 mb-4">Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium">{selectedService?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Client:</span>
            <span className="font-medium">{formData.clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {formData.startTime.toLocaleDateString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">
              {formData.startTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
              {getEndTime() && (
                <span className="text-gray-500">
                  {' - '}
                  {getEndTime()!.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              )}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="text-gray-600">Total:</span>
            <span className="font-bold text-purple-600">
              {selectedService && formatCurrency(selectedService.price)}
            </span>
          </div>
        </div>
      </Card>

      <div className="text-sm text-gray-500">
        Redirecting to bookings list...
      </div>
    </div>
  )

  if (step === 4) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        {renderSuccessStep()}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">New Appointment</h1>
            <p className="text-gray-600">Create a new appointment for your client</p>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {step === 1 && renderServiceSelection()}
          {step === 2 && renderDateTimeSelection()}
          {step === 3 && renderClientSelection()}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
              Summary
            </h3>
            
            {selectedService ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Service</span>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedService.name}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedService.duration} min
                  </span>
                </div>
                
                {step >= 2 && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Date</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedDate.toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>
                    
                    {formData.startTime.getHours() > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Time</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatTime(formData.startTime)}
                        </span>
                      </div>
                    )}
                  </>
                )}
                
                {step >= 3 && formData.clientName && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Client</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formData.clientName}
                    </span>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-900">Total</span>
                    <span className="text-lg font-bold text-purple-600">
                      {formatCurrency(selectedService.price)}
                    </span>
                  </div>
                </div>

                {selectedService.price > 0 && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="requiresPayment"
                      checked={formData.requiresPayment}
                      onChange={(e) => setFormData(prev => ({ ...prev, requiresPayment: e.target.checked }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="requiresPayment" className="text-sm text-gray-700">
                      Payment required before appointment
                    </label>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a service to see the summary</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 space-y-3">
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (step === 1 && !selectedService) ||
                    (step === 2 && (!selectedDate || formData.startTime.getHours() === 0))
                  }
                  className="w-full"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!formData.clientEmail || !formData.clientName || saving}
                  className="w-full"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Appointment
                    </>
                  )}
                </Button>
              )}
              
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="w-full"
                >
                  Back
                </Button>
              )}
            </div>

            {errors.submit && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
                <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-red-700 text-sm">{errors.submit}</span>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )

  // Helper function to format time
  function formatTime(date: Date) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}
