import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  Users, 
  Zap, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Smartphone,
  BarChart3,
  Bell,
  Globe,
  Settings,
  MessageSquare
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: Calendar,
      title: 'Interactive Calendar',
      description: 'Manage your schedule with an intuitive drag-and-drop calendar interface.',
      features: [
        'Drag & drop appointment scheduling',
        'Multiple calendar views (day, week, month)',
        'Color-coded services and appointments',
        'Recurring appointment support',
        'Buffer time management',
        'Availability settings',
        'Time zone support',
        'Calendar sync with Google/Outlook'
      ],
      color: 'blue'
    },
    {
      icon: CreditCard,
      title: 'Payment Processing',
      description: 'Accept secure payments instantly with integrated Stripe processing.',
      features: [
        'Secure Stripe integration',
        'Accept all major credit cards',
        'Instant payment processing',
        'Automatic invoicing',
        'Payment receipts',
        'Refund management',
        'Payment analytics',
        'PCI compliance'
      ],
      color: 'green'
    },
    {
      icon: Users,
      title: 'Client Management',
      description: 'Keep track of your clients with comprehensive customer profiles.',
      features: [
        'Client contact information',
        'Appointment history',
        'Client notes and preferences',
        'Service history tracking',
        'Client communication log',
        'Birthday and anniversary reminders',
        'Client segmentation',
        'Export client data'
      ],
      color: 'purple'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Automated email and SMS reminders that reduce no-shows by 80%.',
      features: [
        'Email appointment confirmations',
        'SMS reminders (24h before)',
        'Custom notification templates',
        'Automated follow-up messages',
        'Notification scheduling',
        'Multi-language support',
        'Delivery tracking',
        'Unsubscribe management'
      ],
      color: 'yellow'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Track your business performance with detailed insights and analytics.',
      features: [
        'Revenue tracking and forecasting',
        'Booking trends analysis',
        'Client behavior insights',
        'Service performance metrics',
        'No-show rate tracking',
        'Peak hours identification',
        'Custom date range reports',
        'Export to CSV/PDF'
      ],
      color: 'red'
    },
    {
      icon: Globe,
      title: 'Public Booking Pages',
      description: 'Share your personalized booking link for 24/7 client bookings.',
      features: [
        'Custom branded booking pages',
        'Mobile-optimized design',
        'Real-time availability',
        'Service descriptions and pricing',
        'Photo galleries',
        'Business information display',
        'SEO-friendly URLs',
        'Social media integration'
      ],
      color: 'indigo'
    }
  ]

  const additionalFeatures = [
    {
      icon: Smartphone,
      title: 'Mobile App',
      description: 'Manage your business on the go with our mobile app.'
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      description: 'Enterprise-grade security with GDPR compliance.'
    },
    {
      icon: Settings,
      title: 'Customization',
      description: 'Customize your booking flow and branding.'
    },
    {
      icon: MessageSquare,
      title: '24/7 Support',
      description: 'Get help when you need it with our support team.'
    },
    {
      icon: Zap,
      title: 'API Access',
      description: 'Integrate with your existing tools and workflows.'
    },
    {
      icon: Clock,
      title: 'Time Tracking',
      description: 'Track time spent on appointments and services.'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      yellow: 'from-yellow-500 to-yellow-600',
      red: 'from-red-500 to-red-600',
      indigo: 'from-indigo-500 to-indigo-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Powerful features for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> modern businesses</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Everything you need to manage appointments, accept payments, and grow your business. 
            Built specifically for solo entrepreneurs and small businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="px-8 py-4 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Core features that drive results
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of tools helps you streamline operations, 
              increase bookings, and provide exceptional customer experiences.
            </p>
          </div>

          <div className="space-y-24">
            {mainFeatures.map((feature, index) => (
              <div 
                key={feature.title} 
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } items-center gap-12`}
              >
                <div className="flex-1">
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getColorClasses(feature.color)} rounded-2xl flex items-center justify-center mr-4`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-lg text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {feature.features.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <Card className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="aspect-video bg-white rounded-lg shadow-sm flex items-center justify-center">
                      <div className="text-center">
                        <feature.icon className={`h-16 w-16 mx-auto mb-4 text-gray-400`} />
                        <p className="text-gray-500">Feature Preview</p>
                        <p className="text-sm text-gray-400">Interactive demo coming soon</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              And much more...
            </h2>
            <p className="text-lg text-gray-600">
              Additional features to help you run your business efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Integrates with your favorite tools
            </h2>
            <p className="text-lg text-gray-600">
              Connect ComeBookUs with the tools you already use
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              'Stripe', 'Google Calendar', 'Outlook', 'Zoom', 'Mailchimp', 'Zapier',
              'QuickBooks', 'Xero', 'Slack', 'WhatsApp', 'Instagram', 'Facebook'
            ].map((integration, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">{integration.slice(0, 2)}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{integration}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by thousands of businesses
            </h2>
            <p className="text-xl text-blue-100">
              See the impact ComeBookUs has on businesses like yours
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '10,000+', label: 'Active Users' },
              { number: '1M+', label: 'Appointments Booked' },
              { number: '80%', label: 'Reduction in No-Shows' },
              { number: '99.9%', label: 'Uptime Guarantee' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100 text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to transform your business?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of entrepreneurs who have streamlined their booking process with ComeBookUs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="px-8 py-4 text-lg">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                Schedule a Demo
              </Button>
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
