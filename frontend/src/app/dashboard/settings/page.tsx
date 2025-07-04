'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  User, 
  Bell, 
  CreditCard, 
  Globe, 
  Shield, 
  Save,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Building
} from 'lucide-react'

interface UserSettings {
  // Personal Info
  name: string
  email: string
  phone: string
  avatar?: string
  timezone: string
  
  // Business Info
  businessName: string
  businessAddress: string
  businessPhone: string
  businessWebsite: string
  
  // Booking Page
  bookingPageSlug: string
  bookingPageEnabled: boolean
  bookingPageTitle: string
  bookingPageBio: string
  
  // Notifications
  emailNotifications: boolean
  smsNotifications: boolean
  
  // Stripe
  stripeAccountEnabled: boolean
  stripeAccountId?: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    businessName: 'My Business',
    businessAddress: '123 Main St, City, State 12345',
    businessPhone: '+1 (555) 987-6543',
    businessWebsite: 'https://mybusiness.com',
    bookingPageSlug: 'john-doe',
    bookingPageEnabled: true,
    bookingPageTitle: 'Book with John',
    bookingPageBio: 'Professional service provider with 10+ years of experience.',
    emailNotifications: true,
    smsNotifications: false,
    stripeAccountEnabled: false
  })
  
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'business', name: 'Business', icon: Building },
    { id: 'booking', name: 'Booking Page', icon: Globe },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'security', name: 'Security', icon: Shield }
  ]

  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney'
  ]

  const handleSave = async () => {
    setLoading(true)
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyBookingUrl = () => {
    const url = `${window.location.origin}/book/${settings.bookingPageSlug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({...settings, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({...settings, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({...settings, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({...settings, timezone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {timezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBusinessTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name
            </label>
            <input
              type="text"
              value={settings.businessName}
              onChange={(e) => setSettings({...settings, businessName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Address
            </label>
            <textarea
              value={settings.businessAddress}
              onChange={(e) => setSettings({...settings, businessAddress: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Phone
            </label>
            <input
              type="tel"
              value={settings.businessPhone}
              onChange={(e) => setSettings({...settings, businessPhone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={settings.businessWebsite}
              onChange={(e) => setSettings({...settings, businessWebsite: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderBookingTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Public Booking Page</h3>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Your booking page URL:</p>
              <p className="text-sm text-blue-700 font-mono">
                {window.location.origin}/book/{settings.bookingPageSlug}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={copyBookingUrl}
                className="btn btn-outline btn-sm"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => window.open(`/book/${settings.bookingPageSlug}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Enable Public Booking Page
              </label>
              <p className="text-sm text-gray-500">
                Allow clients to book appointments through your public page
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.bookingPageEnabled}
                onChange={(e) => setSettings({...settings, bookingPageEnabled: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Profile Photo Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden">
                <img 
                  src={settings.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <button className="btn btn-outline btn-sm">
                  Upload Photo
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG up to 2MB. Recommended: 200x200px
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Slug
              </label>
              <input
                type="text"
                value={settings.bookingPageSlug}
                onChange={(e) => setSettings({...settings, bookingPageSlug: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your-name"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be your unique booking page URL
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title
              </label>
              <input
                type="text"
                value={settings.bookingPageTitle}
                onChange={(e) => setSettings({...settings, bookingPageTitle: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Book with John"
              />
              <p className="text-xs text-gray-500 mt-1">
                This appears as the main heading on your booking page
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio/Description
            </label>
            <textarea
              value={settings.bookingPageBio}
              onChange={(e) => setSettings({...settings, bookingPageBio: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell your clients about yourself and your services..."
            />
            <p className="text-xs text-gray-500 mt-1">
              This description will appear below your name on the booking page
            </p>
          </div>

          {/* Preview Section */}
          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Preview</h4>
            <div className="bg-gray-50 rounded-lg p-4 max-w-sm mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-300 overflow-hidden">
                  <img 
                    src={settings.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'} 
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {settings.bookingPageTitle || 'Your Name'}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {settings.businessAddress || 'Your Address'}
                </p>
                <div className="w-full h-20 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <MapPin className="h-6 w-6 text-red-500 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Google</span>
                  </div>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 mb-2">Services</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-white rounded border">
                      <span className="text-sm">Service Example</span>
                      <span className="text-sm font-bold">25€</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Notifications
              </label>
              <p className="text-sm text-gray-500">
                Receive booking confirmations, reminders, and updates via email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                SMS Notifications
              </label>
              <p className="text-sm text-gray-500">
                Receive booking alerts and reminders via text message
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPaymentsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Settings</h3>
        
        {!settings.stripeAccountEnabled ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <h4 className="text-lg font-medium text-yellow-900">Connect Stripe Account</h4>
                <p className="text-sm text-yellow-700">
                  Connect your Stripe account to accept payments from clients
                </p>
              </div>
            </div>
            <button className="btn btn-primary">
              Connect Stripe Account
            </button>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-green-900">Stripe Connected</h4>
                  <p className="text-sm text-green-700">
                    Your Stripe account is connected and ready to accept payments
                  </p>
                </div>
              </div>
              <button className="btn btn-outline btn-sm">
                Manage Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>
          <button className="btn btn-primary">
            Update Password
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? (
            <div className="loading-spinner h-4 w-4 mr-2" />
          ) : saved ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'business' && renderBusinessTab()}
          {activeTab === 'booking' && renderBookingTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'payments' && renderPaymentsTab()}
          {activeTab === 'security' && renderSecurityTab()}
        </div>
      </div>
    </div>
  )
}
