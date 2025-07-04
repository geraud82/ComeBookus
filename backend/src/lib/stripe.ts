import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}

// Helper function to create a payment intent
export async function createPaymentIntent(amount: number, metadata?: Record<string, string>) {
  return await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata,
  })
}

// Helper function to create a Stripe customer
export async function createStripeCustomer(email: string, name?: string) {
  return await stripe.customers.create({
    email,
    name,
  })
}

// Helper function to retrieve a payment intent
export async function retrievePaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.retrieve(paymentIntentId)
}
