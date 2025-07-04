export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // Duration in minutes
  price: number; // Price in cents
  color: string; // Hex color for calendar display
  isActive: boolean;
  category: ServiceCategory;
  
  // Booking settings
  bufferTime: number; // Buffer time in minutes
  maxAdvanceBook: number; // Max days in advance to book
  
  userId: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export enum ServiceCategory {
  HAIR = 'HAIR',
  NAILS = 'NAILS',
  MASSAGE = 'MASSAGE',
  FACIAL = 'FACIAL',
  BODY_TREATMENT = 'BODY_TREATMENT',
  WAXING = 'WAXING',
  MAKEUP = 'MAKEUP',
  EYEBROWS = 'EYEBROWS',
  EYELASHES = 'EYELASHES',
  WELLNESS = 'WELLNESS',
  OTHER = 'OTHER'
}

export interface CreateServiceData {
  name: string;
  description?: string;
  duration: number;
  price: number;
  color?: string;
  category?: ServiceCategory;
  bufferTime?: number;
  maxAdvanceBook?: number;
}

export interface UpdateServiceData {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  color?: string;
  category?: ServiceCategory;
  isActive?: boolean;
  bufferTime?: number;
  maxAdvanceBook?: number;
}

export interface ServiceWithBookings extends Service {
  bookings: {
    id: string;
    startTime: Date;
    endTime: Date;
    status: string;
  }[];
}
