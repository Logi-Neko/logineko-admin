// Types for the application
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  package: 'Premium' | 'Miễn phí';
  status: 'hoạt động' | 'không hoạt động';
  registrationDate: string;
  lastLogin: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  users: number;
  premiumUsers: number;
  growth: number;
}

export interface PremiumPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  userCount: number;
  growthRate: number;
  isPopular?: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  premiumUsers: number;
  totalRevenue: number;
  growth: number;
}