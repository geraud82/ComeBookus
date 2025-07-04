// User types
export * from './user';

// Booking types
export * from './booking';

// Service types
export * from './service';

// Client types
export interface Client {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  notes?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientData {
  email: string;
  name?: string;
  phone?: string;
  notes?: string;
}

export interface UpdateClientData {
  name?: string;
  phone?: string;
  notes?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Dashboard types
export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  upcomingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  monthlyGrowth: number;
  revenueGrowth: number;
}
