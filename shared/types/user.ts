export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  phone?: string;
  timezone: string;
  
  // Business info
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessWebsite?: string;
  businessType: BusinessType;
  
  // Location info for proximity search
  latitude?: number;
  longitude?: number;
  city?: string;
  postalCode?: string;
  country?: string;
  
  // Stripe info
  stripeCustomerId?: string;
  stripeAccountId?: string;
  stripeAccountEnabled: boolean;
  
  // Notification preferences
  emailNotifications: boolean;
  smsNotifications: boolean;
  
  // Public booking page settings
  bookingPageSlug?: string;
  bookingPageEnabled: boolean;
  bookingPageTitle?: string;
  bookingPageBio?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export enum BusinessType {
  SALON = 'SALON',
  SPA = 'SPA',
  MASSAGE = 'MASSAGE',
  BARBERSHOP = 'BARBERSHOP',
  BEAUTY_CENTER = 'BEAUTY_CENTER',
  NAIL_SALON = 'NAIL_SALON',
  WELLNESS_CENTER = 'WELLNESS_CENTER'
}

export interface CreateUserData {
  email: string;
  name?: string;
  phone?: string;
  timezone?: string;
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessWebsite?: string;
  businessType?: BusinessType;
  latitude?: number;
  longitude?: number;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface UpdateUserData {
  name?: string;
  avatar?: string;
  phone?: string;
  timezone?: string;
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessWebsite?: string;
  businessType?: BusinessType;
  latitude?: number;
  longitude?: number;
  city?: string;
  postalCode?: string;
  country?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  bookingPageSlug?: string;
  bookingPageEnabled?: boolean;
  bookingPageTitle?: string;
  bookingPageBio?: string;
}

export interface UserWithDistance extends User {
  distance?: number; // Distance in kilometers
}
