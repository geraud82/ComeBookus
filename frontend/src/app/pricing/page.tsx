import Link from 'next/link'
import { CheckCircle, X, Star, ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: 0,
      period: 'month',
      description: 'Perfect for getting started',
      features: [
        'Up to 50 bookings per month',
        'Basic calendar management',
        'Email notifications',
        'Public booking page',
        'Client management',
        'Basic analytics',
        'Mobile app access',
        'Email support'
      ],
      limitations: [
        'No SMS notifications',
        'No payment processing',
        'Limited customization',
        'Basic reporting only'
      ],
      cta: 'Get Started Free',
      popular: false,
      href: '/auth/signup'
    },
    {
      name: 'Professional',
      price: 29,
      period: 'month',
      description: 'Everything you need to grow',
      features: [
        'Unlimited bookings',
        'Advanced calendar features',
        'Email & SMS notifications',
        'Payment processing (Stripe)',
        'Custom booking page',
        'Advanced analytics',
        'Automated reminders',
        'Client history & notes',
        'Buffer time management',
        'Recurring appointments',
        'Priority email support',
        'Mobile app access'
      ],
      limitations: [],
      cta: 'Start Free Trial',
      popular: true,
      href: '/auth/signup'
    },
    {
      name: 'Enterprise',
      price: 99,
      period: 'month',
      description: 'For established businesses',
      features: [
        'Everything in Professional',
        'Custom branding & white-label',
        'API access & integrations',
        'Advanced reporting & exports',
        'Multi-location support',
        'Team management',
        'Custom notification templates',
        'Priority phone support',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee',
        'Advanced security features'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
      href: '/contact'
    }
  ]

  const faqs = [
    {
      question: 'Can I change plans at any time?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any charges.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! We offer a 14-day free trial for all paid plans. No credit card required to start.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. All payments are processed securely through Stripe.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Absolutely. You can cancel your subscription at any time from your account settings. There are no cancellation fees or long-term contracts.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied within the first 30 days, we\'ll provide a full refund.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we take security seriously. All data is encrypted in transit and at rest, and we\'re compliant with GDPR and other privacy regulations.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose the plan that fits your business. Start free, scale as you grow. 
            No hidden fees, no surprises.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <Star className="w-4 h-4 mr-2" />
            14-day free trial • No credit card required
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={plan.name} 
                className={`p-8 relative ${
                  plan.popular 
                    ? 'border-2 border-blue-500 shadow-xl scale-105' 
                    : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-500 ml-1">
                      /{plan.period}
                    </span>
                  </div>
                  <Link href={plan.href}>
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : ''
                      }`}
                      variant={plan.popular ? 'primary' : 'outline'}
                      size="lg"
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                    What's included:
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <>
                      <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mt-6">
                        Not included:
                      </h4>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, limitationIndex) => (
                          <li key={limitationIndex} className="flex items-start">
                            <X className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-500 text-sm">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compare all features
            </h2>
            <p className="text-lg text-gray-600">
              See exactly what's included in each plan
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Features
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Starter
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 bg-blue-50">
                      Professional
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { feature: 'Monthly bookings', starter: '50', professional: 'Unlimited', enterprise: 'Unlimited' },
                    { feature: 'Calendar management', starter: true, professional: true, enterprise: true },
                    { feature: 'Email notifications', starter: true, professional: true, enterprise: true },
                    { feature: 'SMS notifications', starter: false, professional: true, enterprise: true },
                    { feature: 'Payment processing', starter: false, professional: true, enterprise: true },
                    { feature: 'Custom branding', starter: false, professional: 'Limited', enterprise: 'Full' },
                    { feature: 'API access', starter: false, professional: false, enterprise: true },
                    { feature: 'Priority support', starter: false, professional: 'Email', enterprise: 'Phone & Email' },
                    { feature: 'Advanced analytics', starter: false, professional: true, enterprise: true },
                    { feature: 'Multi-location', starter: false, professional: false, enterprise: true },
                  ].map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {row.feature}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">
                        {typeof row.starter === 'boolean' ? (
                          row.starter ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          )
                        ) : (
                          row.starter
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700 bg-blue-50">
                        {typeof row.professional === 'boolean' ? (
                          row.professional ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          )
                        ) : (
                          row.professional
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">
                        {typeof row.enterprise === 'boolean' ? (
                          row.enterprise ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          )
                        ) : (
                          row.enterprise
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of entrepreneurs who trust ComeBookUs to manage their appointments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600">
                Contact Sales
              </Button>
            </Link>
          </div>
          <p className="text-blue-200 text-sm mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
