'use client'

import { useState, useEffect } from 'react'
import { 
  Bell, 
  Check, 
  X, 
  Mail, 
  MessageSquare, 
  Calendar, 
  CreditCard,
  User,
  Settings,
  Filter,
  Search,
  MoreHorizontal,
  Trash2,
  Eye,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface Notification {
  id: string
  type: 'booking' | 'payment' | 'reminder' | 'system' | 'message'
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
  metadata?: {
    clientName?: string
    serviceName?: string
    amount?: number
    bookingId?: string
  }
}

const notificationTypes = {
  booking: { icon: Calendar, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  payment: { icon: CreditCard, color: 'text-green-600', bgColor: 'bg-green-100' },
  reminder: { icon: Bell, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  system: { icon: Settings, color: 'text-gray-600', bgColor: 'bg-gray-100' },
  message: { icon: MessageSquare, color: 'text-purple-600', bgColor: 'bg-purple-100' }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [readFilter, setReadFilter] = useState<string>('all')
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    filterNotifications()
  }, [notifications, searchTerm, typeFilter, readFilter])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      // Mock data for demonstration
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'booking',
          title: 'New Booking Received',
          message: 'Sarah Johnson has booked a Hair Cut & Styling appointment for tomorrow at 9:00 AM.',
          read: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          actionUrl: '/dashboard/bookings/1',
          metadata: {
            clientName: 'Sarah Johnson',
            serviceName: 'Hair Cut & Styling',
            bookingId: '1'
          }
        },
        {
          id: '2',
          type: 'payment',
          title: 'Payment Received',
          message: 'Payment of $75.00 received from Emily Davis for Facial Treatment.',
          read: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          metadata: {
            clientName: 'Emily Davis',
            serviceName: 'Facial Treatment',
            amount: 7500
          }
        },
        {
          id: '3',
          type: 'reminder',
          title: 'Upcoming Appointment',
          message: 'Reminder: Michael Brown has a Deep Tissue Massage appointment in 1 hour.',
          read: true,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          actionUrl: '/dashboard/calendar',
          metadata: {
            clientName: 'Michael Brown',
            serviceName: 'Deep Tissue Massage'
          }
        },
        {
          id: '4',
          type: 'booking',
          title: 'Booking Cancelled',
          message: 'Jessica Wilson has cancelled her Manicure & Pedicure appointment scheduled for today.',
          read: true,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          metadata: {
            clientName: 'Jessica Wilson',
            serviceName: 'Manicure & Pedicure'
          }
        },
        {
          id: '5',
          type: 'system',
          title: 'System Update',
          message: 'Your booking system has been updated with new features. Check out the latest improvements.',
          read: false,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          actionUrl: '/dashboard/settings'
        },
        {
          id: '6',
          type: 'message',
          title: 'New Message',
          message: 'Amanda Taylor sent you a message about her upcoming Color & Highlights appointment.',
          read: false,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          metadata: {
            clientName: 'Amanda Taylor',
            serviceName: 'Color & Highlights'
          }
        }
      ]
      setNotifications(mockNotifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterNotifications = () => {
    let filtered = notifications

    if (searchTerm) {
      filtered = filtered.filter(notification => 
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.metadata?.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(notification => notification.type === typeFilter)
    }

    if (readFilter !== 'all') {
      filtered = filtered.filter(notification => 
        readFilter === 'read' ? notification.read : !notification.read
      )
    }

    setFilteredNotifications(filtered)
  }

  const markAsRead = async (notificationIds: string[]) => {
    try {
      setNotifications(prev => prev.map(notification => 
        notificationIds.includes(notification.id) 
          ? { ...notification, read: true }
          : notification
      ))
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    }
  }

  const markAsUnread = async (notificationIds: string[]) => {
    try {
      setNotifications(prev => prev.map(notification => 
        notificationIds.includes(notification.id) 
          ? { ...notification, read: false }
          : notification
      ))
    } catch (error) {
      console.error('Error marking notifications as unread:', error)
    }
  }

  const deleteNotifications = async (notificationIds: string[]) => {
    if (confirm('Are you sure you want to delete the selected notifications?')) {
      try {
        setNotifications(prev => prev.filter(notification => 
          !notificationIds.includes(notification.id)
        ))
        setSelectedNotifications([])
      } catch (error) {
        console.error('Error deleting notifications:', error)
      }
    }
  }

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })))
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev =>
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    )
  }

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map(notification => notification.id))
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  const unreadCount = notifications.filter(n => !n.read).length

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
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Stay updated with your business activities
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              <option value="booking">Bookings</option>
              <option value="payment">Payments</option>
              <option value="reminder">Reminders</option>
              <option value="message">Messages</option>
              <option value="system">System</option>
            </select>
            <select
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>

        {selectedNotifications.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              {selectedNotifications.length} selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => markAsRead(selectedNotifications)}
              >
                <Check className="h-4 w-4 mr-1" />
                Mark Read
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => markAsUnread(selectedNotifications)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Mark Unread
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => deleteNotifications(selectedNotifications)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Notifications List */}
      <Card className="divide-y divide-gray-200">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-500">
              {searchTerm || typeFilter !== 'all' || readFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'You\'re all caught up! New notifications will appear here.'}
            </p>
          </div>
        ) : (
          <>
            {/* Select All Header */}
            <div className="p-4 bg-gray-50">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Select all notifications
                </span>
              </label>
            </div>

            {filteredNotifications.map((notification) => {
              const TypeIcon = notificationTypes[notification.type].icon
              const isSelected = selectedNotifications.includes(notification.id)

              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  } ${isSelected ? 'bg-purple-50' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notificationTypes[notification.type].bgColor}`}>
                      <TypeIcon className={`w-5 h-5 ${notificationTypes[notification.type].color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <p className={`mt-1 text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                        {notification.message}
                      </p>

                      {notification.metadata && (
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                          {notification.metadata.clientName && (
                            <span className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {notification.metadata.clientName}
                            </span>
                          )}
                          {notification.metadata.amount && (
                            <span className="flex items-center">
                              <CreditCard className="w-3 h-3 mr-1" />
                              ${(notification.metadata.amount / 100).toFixed(2)}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-3 flex items-center space-x-2">
                        {notification.actionUrl && (
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        )}
                        {!notification.read ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead([notification.id])}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Mark Read
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsUnread([notification.id])}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Mark Unread
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNotifications([notification.id])}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </Card>
    </div>
  )
}
