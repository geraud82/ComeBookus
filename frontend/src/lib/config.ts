// API Configuration
export const API_CONFIG = {
  // Backend API base URL
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004',
  
  // API endpoints
  endpoints: {
    bookings: '/api/bookings',
    services: '/api/services',
    clients: '/api/clients',
    auth: {
      login: '/api/auth/login',
      signup: '/api/auth/signup',
    },
  },
}

// Helper function to build full API URLs
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.baseURL}${endpoint}`
}

// Helper function for making API requests with proper error handling
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = getApiUrl(endpoint)
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  })

  // Don't throw errors for HTTP status codes - let the calling code handle them
  return response
}
