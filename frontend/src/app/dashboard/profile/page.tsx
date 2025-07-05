'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

interface UserProfile {
  id: string
  email: string
  name: string | null
  businessName: string | null
  businessAddress: string | null
  businessPhone: string | null
  businessWebsite: string | null
  businessType: string
  timezone: string
  emailNotifications: boolean
  smsNotifications: boolean
  bookingPageSlug: string | null
  bookingPageEnabled: boolean
  bookingPageTitle: string | null
  bookingPageBio: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const response = await fetch('/api/profile')
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: string | boolean) => {
    if (!profile) return
    setProfile({ ...profile, [field]: value })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account and business information
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <div className="mt-2 text-sm text-green-700">{success}</div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={profile.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>
            </div>
          </Card>

          {/* Business Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <Input
                  id="businessName"
                  type="text"
                  value={profile.businessName || ''}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Enter your business name"
                />
              </div>
              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                <select
                  id="businessType"
                  value={profile.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="SALON">Hair Salon</option>
                  <option value="BARBERSHOP">Barbershop</option>
                  <option value="SPA">Spa</option>
                  <option value="MASSAGE">Massage Therapy</option>
                  <option value="BEAUTY">Beauty Services</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address
                </label>
                <Input
                  id="businessAddress"
                  type="text"
                  value={profile.businessAddress || ''}
                  onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                  placeholder="Enter your business address"
                />
              </div>
              <div>
                <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Phone
                </label>
                <Input
                  id="businessPhone"
                  type="tel"
                  value={profile.businessPhone || ''}
                  onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                  placeholder="Enter your business phone"
                />
              </div>
              <div>
                <label htmlFor="businessWebsite" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Website
                </label>
                <Input
                  id="businessWebsite"
                  type="url"
                  value={profile.businessWebsite || ''}
                  onChange={(e) => handleInputChange('businessWebsite', e.target.value)}
                  placeholder="https://your-website.com"
                />
              </div>
            </div>
          </Card>

          {/* Booking Page Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Public Booking Page</h2>
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  id="bookingPageEnabled"
                  type="checkbox"
                  checked={profile.bookingPageEnabled}
                  onChange={(e) => handleInputChange('bookingPageEnabled', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="bookingPageEnabled" className="ml-2 block text-sm text-gray-900">
                  Enable public booking page
                </label>
              </div>
              
              {profile.bookingPageEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="bookingPageSlug" className="block text-sm font-medium text-gray-700 mb-2">
                      Booking Page URL
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        comebookus.com/
                      </span>
                      <Input
                        id="bookingPageSlug"
                        type="text"
                        value={profile.bookingPageSlug || ''}
                        onChange={(e) => handleInputChange('bookingPageSlug', e.target.value)}
                        placeholder="your-business-name"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="bookingPageTitle" className="block text-sm font-medium text-gray-700 mb-2">
                      Page Title
                    </label>
                    <Input
                      id="bookingPageTitle"
                      type="text"
                      value={profile.bookingPageTitle || ''}
                      onChange={(e) => handleInputChange('bookingPageTitle', e.target.value)}
                      placeholder="Book an appointment"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="bookingPageBio" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Description
                    </label>
                    <textarea
                      id="bookingPageBio"
                      rows={4}
                      value={profile.bookingPageBio || ''}
                      onChange={(e) => handleInputChange('bookingPageBio', e.target.value)}
                      placeholder="Tell your customers about your business..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="emailNotifications"
                  type="checkbox"
                  checked={profile.emailNotifications}
                  onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                  Email notifications for new bookings and reminders
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="smsNotifications"
                  type="checkbox"
                  checked={profile.smsNotifications}
                  onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-900">
                  SMS notifications for urgent updates
                </label>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="px-8 py-2"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
