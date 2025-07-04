export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface Booking {
  id: string;
  status: BookingStatus;
  
  // Booking details
  startTime: Date;
  endTime: Date;
  notes?: string;
  
  // Client info
  clientEmail: string;
  clientName?: string;
  clientPhone?: string;
  
  // Payment info
  totalAmount?: number;
  stripePaymentId?: string;
  paymentStatus: PaymentStatus;
  
  // Notification tracking
  reminderSent: boolean;
  confirmationSent: boolean;
  
  // Relations
  userId: string;
  serviceId: string;
  clientId?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingData {
  serviceId: string;
  startTime: Date;
  clientEmail: string;
  clientName?: string;
  clientPhone?: string;
  notes?: string;
  requiresPayment?: boolean;
}

export interface UpdateBookingData {
  status?: BookingStatus;
  startTime?: Date;
  endTime?: Date;
  notes?: string;
  clientName?: string;
  clientPhone?: string;
  paymentStatus?: PaymentStatus;
}

export interface BookingWithRelations extends Booking {
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
    color: string;
  };
  client?: {
    id: string;
    name?: string;
    email: string;
    phone?: string;
  };
}
