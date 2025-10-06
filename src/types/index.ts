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

// API Response Types
export interface ApiResponse<T> {
  status: number;
  code: string;
  message: string;
  data: T;
  path: string;
  errors: string[];
  metadata: Record<string, any>;
}

// Authentication Types
export interface TokenExchangeResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  id_token: string;
  scope: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AccountDTO {
  id: number;
  username: string;
  email: string;
  fullName: string;
  premiumUntil: string | null; // LocalDate as ISO string
  premium: boolean;
  totalStar: number;
  dateOfBirth: string | null; // LocalDate as ISO string
  avatarUrl: string | null;
}

// Admin Statistics Types
export interface MonthData {
  month: number;
  revenue: number;
  newUsers: number;
  newPremiumUsers: number;
  monthOverMonthGrowth: number;
}

export interface AdminStatDTO {
  totalUsers: number;
  totalPremiumUsers: number;
  totalRevenue: number;
  totalQuestions: number;
  year: number;
  totalRevenueInYear: number;
  averageRevenueInMonth: number;
  monthWithHighestRevenue: number;
  yearOverYearGrowth: number;
  monthData: MonthData[];
}

// Course Management Types
export interface CourseDTO {
  id: number;
  name: string;
  description: string;
  thumbnailUrl: string;
  thumbnailPublicId: string;
  totalLesson: number;
  isPremium: boolean;
  isActive: boolean;
  price: number;
  star: number;
  createdAt: string; // LocalDateTime as ISO string
  updatedAt: string; // LocalDateTime as ISO string
}

export interface LessonDTO {
  id: number;
  name: string;
  description: string;
  order: number;
  minAge: number;
  maxAge: number;
  difficultyLevel: number;
  thumbnailUrl: string;
  duration: number;
  totalVideo: number;
  star: number;
  isPremium: boolean;
  isActive: boolean;
  createdAt: string; // LocalDateTime as ISO string
  updatedAt: string; // LocalDateTime as ISO string
}

export interface VideoQuestionDTO {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
}

export interface VideoDTO {
  id: number;
  title: string;
  videoUrl: string;
  videoPublicId: string;
  thumbnailUrl: string;
  thumbnailPublicId: string;
  duration: number;
  order: number;
  isActive: boolean;
  createdAt: string; // LocalDateTime as ISO string
  updatedAt: string; // LocalDateTime as ISO string
  videoQuestion: VideoQuestionDTO;
}