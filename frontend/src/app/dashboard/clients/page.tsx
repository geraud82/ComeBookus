'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

interface Client {
  id: string
  email: string
  name: string | null
  phone: string | null
  notes: string | null
  createdAt: string
  _count?: {
    bookings: number
  }
}

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const response = await fetch('/api/clients')
      if (!response.ok) {
        throw new Error('Failed to fetch clients')
      }

      const data = await response.json()
      setClients(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClient),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add client')
      }

      const addedClient = await response.json()
      setClients([addedClient, ...clients])
      setNewClient({ name: '', email: '', phone: '', notes: '' })
      setShowAddForm(false)
      setSuccess('Client added successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add client')
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete client')
      }

      setClients(clients.filter(client => client.id !== clientId))
      setSuccess('Client deleted successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete client')
    }
  }

  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
              <p className="mt-2 text-gray-600">
                Manage your client database and contact information
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-full sm:w-auto"
              >
                {showAddForm ? 'Cancel' : 'Add Client'}
              </Button>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
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

        {/* Add Client Form */}
        {showAddForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Client</h2>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    placeholder="Enter client's full name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="Enter client's email"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    placeholder="Enter client's phone number"
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <Input
                    id="notes"
                    type="text"
                    value={newClient.notes}
                    onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                    placeholder="Any special notes about the client"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Add Client
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Search */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search clients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Clients List */}
        {filteredClients.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-500">
              {clients.length === 0 ? (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
                  <p>Add your first client to get started with managing your customer database.</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
                  <p>Try adjusting your search terms.</p>
                </>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {client.name || 'Unnamed Client'}
                    </h3>
                    <p className="text-sm text-gray-600">{client.email}</p>
                    {client.phone && (
                      <p className="text-sm text-gray-600">{client.phone}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>

                {client.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                      {client.notes}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {client._count?.bookings || 0} booking{client._count?.bookings !== 1 ? 's' : ''}
                  </span>
                  <span>
                    Added {new Date(client.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/dashboard/bookings/new?clientEmail=${client.email}`)}
                    className="flex-1"
                  >
                    Book Appointment
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`mailto:${client.email}`, '_blank')}
                  >
                    Email
                  </Button>
                  {client.phone && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`tel:${client.phone}`, '_blank')}
                    >
                      Call
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        {clients.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{clients.length}</div>
              <div className="text-sm text-gray-600">Total Clients</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                {clients.reduce((sum, client) => sum + (client._count?.bookings || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {clients.filter(client => (client._count?.bookings || 0) > 0).length}
              </div>
              <div className="text-sm text-gray-600">Active Clients</div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
