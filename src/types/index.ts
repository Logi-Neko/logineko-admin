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

export interface CourseRequest {
  name: string;
  description: string;
  isPremium?: boolean;
  isActive?: boolean;
  price?: number;
}

export interface LessonRequest {
  courseId: number;
  name: string;
  description: string;
  order: number;
  minAge: number;
  maxAge: number;
  difficultyLevel: number;
  duration: number;
  isPremium?: boolean;
  isActive?: boolean;
}

export interface VideoRequest {
  lessonId: number;
  title: string;
  order: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string; // A, B, C, or D
  isActive?: boolean;
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

export interface SubscriptionPrice {
  id: number;
  price: number;
  duration: number;
}

export interface SubscriptionPriceRequest {
  price: number;
  duration: number;
}

// Subscription Status Breakdown Types
export interface SubscriptionStatusDTO {
  totalSubscriptions: number;
  activeSubscriptions: number;
  inactiveSubscriptions: number;
  expiredSubscriptions: number;
  activePercentage: number;
  inactivePercentage: number;
  expiredPercentage: number;
}

// Churn Rate Types
export interface ChurnRateDTO {
  year: number;
  month: number;
  subscriptionsAtStart: number;
  newSubscriptions: number;
  canceledSubscriptions: number;
  expiredSubscriptions: number;
  subscriptionsAtEnd: number;
  churnRate: number;
  retentionRate: number;
  growthRate: number;
}

// Course Performance Types
export interface CoursePerformanceDTO {
  courseId: number;
  courseName: string;
  description: string;
  thumbnailUrl: string;
  isPremium: boolean;
  totalLessons: number;
  totalVideos: number;
  totalQuestions: number;
  uniqueStudents: number;
  totalAttempts: number;
  averageScore: number;
  completionRate: number;
  price: number;
}

export interface PopularCoursesDTO {
  popularCourses: CoursePerformanceDTO[];
  totalCourses: number;
  totalPremiumCourses: number;
  totalFreeCourses: number;
  activeCourses: number;
  averageStudentsPerCourse: number;
}

// Revenue By Type Types
export interface RevenueByTypeItemDTO {
  subscriptionType: string;
  count: number;
  revenue: number;
  percentage: number;
  averagePrice: number;
}

export interface RevenueByTypeDTO {
  year: number;
  totalRevenue: number;
  revenueByType: RevenueByTypeItemDTO[];
  mostProfitableType: string;
  mostPopularType: string;
}

// Active Users Metrics Types
export interface DailyActivityDTO {
  date: string;
  activeUsers: number;
  totalAttempts: number;
  totalQuestions: number;
}

export interface ActiveUsersMetricsDTO {
  from: string;
  to: string;
  totalActiveUsers: number;
  totalPremiumActiveUsers: number;
  totalFreeActiveUsers: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageAttemptsPerUser: number;
  dailyActivities: DailyActivityDTO[];
}