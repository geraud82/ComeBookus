'use client'

import { useState, useEffect } from 'react'
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Download, 
  Filter, 
  Search, 
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Eye,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface Payment {
  id: string
  amount: number
  currency: string
  status: 'succeeded' | 'pending' | 'failed' | 'refunded' | 'cancelled'
  paymentMethod: 'card' | 'cash' | 'bank_transfer' | 'paypal'
  clientName: string
  clientEmail: string
  serviceName: string
  bookingId: string
  createdAt: string
  processedAt?: string
  refundedAt?: string
  description?: string
  fees?: number
  netAmount?: number
  stripePaymentId?: string
}

interface PaymentStats {
  totalRevenue: number
  totalTransactions: number
  successfulPayments: number
  pendingPayments: number
  failedPayments: number
  refundedAmount: number
  averageTransactionValue: number
  revenueGrowth: number
}

const paymentStatusConfig = {
  succeeded: { 
    label: 'Succeeded', 
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    dotColor: '#10B981'
  },
  pending: { 
    label: 'Pending', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    dotColor: '#F59E0B'
  },
  failed: { 
    label: 'Failed', 
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    dotColor: '#EF4444'
  },
  refunded: { 
    label: 'Refunded', 
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: RefreshCw,
    dotColor: '#6B7280'
  },
  cancelled: { 
    label: 'Cancelled', 
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    dotColor: '#EF4444'
  }
}

const paymentMethodConfig = {
  card: { label: 'Credit Card', icon: CreditCard },
  cash: { label: 'Cash', icon: DollarSign },
  bank_transfer: { label: 'Bank Transfer', icon: ArrowUpRight },
  paypal: { label: 'PayPal', icon: DollarSign }
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [methodFilter, setMethodFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('30')
  const [selectedPayments, setSelectedPayments] = useState<string[]>([])

  useEffect(() => {
    fetchPayments()
    fetchStats()
  }, [dateRange])

  useEffect(() => {
    filterPayments()
  }, [payments, searchTerm, statusFilter, methodFilter])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      // Mock data for demonstration
      const today = new Date()
      const mockPayments: Payment[] = [
        {
          id: '1',
          amount: 7500,
          currency: 'USD',
          status: 'succeeded',
          paymentMethod: 'card',
          clientName: 'Sarah Johnson',
          clientEmail: 'sarah.johnson@email.com',
          serviceName: 'Hair Cut & Styling',
          bookingId: 'booking_1',
          createdAt: new Date(today.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          processedAt: new Date(today.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          description: 'Hair Cut & Styling - Sarah Johnson',
          fees: 247,
          netAmount: 7253,
          stripePaymentId: 'pi_1234567890'
        },
        {
          id: '2',
          amount: 12000,
          currency: 'USD',
          status: 'succeeded',
          paymentMethod: 'card',
          clientName: 'Emily Davis',
          clientEmail: 'emily.davis@email.com',
          serviceName: 'Facial Treatment',
          bookingId: 'booking_2',
          createdAt: new Date(today.getTime() - 6 * 60 * 60 * 1000).toISOString(),
          processedAt: new Date(today.getTime() - 6 * 60 * 60 * 1000).toISOString(),
          description: 'Facial Treatment - Emily Davis',
          fees: 378,
          netAmount: 11622,
          stripePaymentId: 'pi_0987654321'
        },
        {
          id: '3',
          amount: 8500,
          currency: 'USD',
          status: 'pending',
          paymentMethod: 'bank_transfer',
          clientName: 'Michael Brown',
          clientEmail: 'michael.brown@email.com',
          serviceName: 'Deep Tissue Massage',
          bookingId: 'booking_3',
          createdAt: new Date(today.getTime() - 12 * 60 * 60 * 1000).toISOString(),
          description: 'Deep Tissue Massage - Michael Brown'
        },
        {
          id: '4',
          amount: 5500,
          currency: 'USD',
          status: 'failed',
          paymentMethod: 'card',
          clientName: 'Jessica Wilson',
          clientEmail: 'jessica.wilson@email.com',
          serviceName: 'Manicure & Pedicure',
          bookingId: 'booking_4',
          createdAt: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString(),
          description: 'Manicure & Pedicure - Jessica Wilson'
        },
        {
          id: '5',
          amount: 15000,
          currency: 'USD',
          status: 'refunded',
          paymentMethod: 'card',
          clientName: 'Amanda Taylor',
          clientEmail: 'amanda.taylor@email.com',
          serviceName: 'Color & Highlights',
          bookingId: 'booking_5',
          createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          processedAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          refundedAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Color & Highlights - Amanda Taylor (Refunded)',
          fees: 465,
          netAmount: 14535,
          stripePaymentId: 'pi_1122334455'
        },
        {
          id: '6',
          amount: 6000,
          currency: 'USD',
          status: 'succeeded',
          paymentMethod: 'cash',
          clientName: 'David Miller',
          clientEmail: 'david.miller@email.com',
          serviceName: 'Beard Trim',
          bookingId: 'booking_6',
          createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          processedAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Beard Trim - David Miller (Cash Payment)',
          netAmount: 6000
        }
      ]
      setPayments(mockPayments)
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Mock stats calculation
      const mockStats: PaymentStats = {
        totalRevenue: 54500,
        totalTransactions: 6,
        successfulPayments: 3,
        pendingPayments: 1,
        failedPayments: 1,
        refundedAmount: 15000,
        averageTransactionValue: 9083,
        revenueGrowth: 12.5
      }
      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const filterPayments = () => {
    let filtered = payments

    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter)
    }

    if (methodFilter !== 'all') {
      filtered = filtered.filter(payment => payment.paymentMethod === methodFilter)
    }

    setFilteredPayments(filtered)
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSelectPayment = (paymentId: string) => {
    setSelectedPayments(prev =>
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    )
  }

  const handleSelectAll = () => {
    if (selectedPayments.length === filteredPayments.length) {
      setSelectedPayments([])
    } else {
      setSelectedPayments(filteredPayments.map(payment => payment.id))
    }
  }

  const exportPayments = () => {
    // Mock export functionality
    console.log('Exporting payments...', selectedPayments.length > 0 ? selectedPayments : 'all')
  }

  const refundPayment = async (paymentId: string) => {
    if (confirm('Are you sure you want to refund this payment?')) {
      try {
        // Mock refund API call
        setPayments(prev => prev.map(payment => 
          payment.id === paymentId 
            ? { ...payment, status: 'refunded' as const, refundedAt: new Date().toISOString() }
            : payment
        ))
      } catch (error) {
        console.error('Error refunding payment:', error)
      }
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage all your payment transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportPayments}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+{stats.revenueGrowth}%</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.successfulPayments} successful
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Transaction</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.averageTransactionValue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Per transaction</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <RefreshCw className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Refunded</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.refundedAmount)}
                </p>
                <p className="text-xs text-gray-500 mt-1">This period</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="succeeded">Succeeded</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Methods</option>
              <option value="card">Credit Card</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="paypal">PayPal</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>

        {selectedPayments.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              {selectedPayments.length} selected
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={exportPayments}>
                <Download className="h-4 w-4 mr-1" />
                Export Selected
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Payments Table */}
      <Card>
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || methodFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Payments will appear here once you start accepting bookings.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPayments.length === filteredPayments.length && filteredPayments.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => {
                  const StatusIcon = paymentStatusConfig[payment.status].icon
                  const MethodIcon = paymentMethodConfig[payment.paymentMethod].icon
                  const isSelected = selectedPayments.includes(payment.id)

                  return (
                    <tr key={payment.id} className={`hover:bg-gray-50 ${isSelected ? 'bg-purple-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectPayment(payment.id)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{payment.id}</div>
                        {payment.stripePaymentId && (
                          <div className="text-xs text-gray-500">{payment.stripePaymentId}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{payment.clientName}</div>
                            <div className="text-sm text-gray-500">{payment.clientEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payment.serviceName}</div>
                        <div className="text-sm text-gray-500">Booking #{payment.bookingId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount, payment.currency)}
                        </div>
                        {payment.fees && (
                          <div className="text-xs text-gray-500">
                            Fee: {formatCurrency(payment.fees, payment.currency)}
                          </div>
                        )}
                        {payment.netAmount && (
                          <div className="text-xs text-green-600">
                            Net: {formatCurrency(payment.netAmount, payment.currency)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MethodIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {paymentMethodConfig[payment.paymentMethod].label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <StatusIcon className="h-4 w-4 mr-2" style={{ color: paymentStatusConfig[payment.status].dotColor }} />
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentStatusConfig[payment.status].color}`}>
                            {paymentStatusConfig[payment.status].label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(payment.createdAt)}</div>
                        {payment.processedAt && payment.processedAt !== payment.createdAt && (
                          <div className="text-xs text-gray-500">
                            Processed: {formatDate(payment.processedAt)}
                          </div>
                        )}
                        {payment.refundedAt && (
                          <div className="text-xs text-red-600">
                            Refunded: {formatDate(payment.refundedAt)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {payment.status === 'succeeded' && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => refundPayment(payment.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
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
