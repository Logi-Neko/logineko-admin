import type { User, MonthlyRevenue, PremiumPackage, DashboardStats } from '../types';

export const mockUsers: User[] = [
  {
    id: '#15847',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0123456789',
    package: 'Premium',
    status: 'hoạt động',
    registrationDate: '15/1/2025',
    lastLogin: '14:30:00 17/7/2025'
  },
  {
    id: '#15846',
    name: 'Trần Thị B',
    email: 'tranthib@email.com',
    phone: '0987654321',
    package: 'Miễn phí',
    status: 'hoạt động',
    registrationDate: '14/1/2025',
    lastLogin: '10:15:00 17/7/2025'
  },
  {
    id: '#15845',
    name: 'Lê Văn C',
    email: 'levanc@email.com',
    phone: '0369852147',
    package: 'Premium',
    status: 'không hoạt động',
    registrationDate: '13/1/2025',
    lastLogin: '16:45:00 10/7/2025'
  },
  {
    id: '#15844',
    name: 'Phạm Thị D',
    email: 'phamthid@email.com',
    phone: '0147258369',
    package: 'Miễn phí',
    status: 'hoạt động',
    registrationDate: '12/1/2025',
    lastLogin: '09:20:00 17/7/2025'
  },
  {
    id: '#15843',
    name: 'Hoàng Văn E',
    email: 'hoangvane@email.com',
    phone: '0258147369',
    package: 'Premium',
    status: 'hoạt động',
    registrationDate: '11/1/2025',
    lastLogin: '18:30:00 16/7/2025'
  },
  {
    id: '#15842',
    name: 'Vũ Thị F',
    email: 'vuthif@email.com',
    phone: '0789456123',
    package: 'Miễn phí',
    status: 'hoạt động',
    registrationDate: '10/1/2025',
    lastLogin: '08:45:00 17/7/2025'
  },
  {
    id: '#15841',
    name: 'Đinh Văn G',
    email: 'dinhvang@email.com',
    phone: '0456789123',
    package: 'Premium',
    status: 'hoạt động',
    registrationDate: '9/1/2025',
    lastLogin: '20:15:00 16/7/2025'
  }
];

export const mockMonthlyRevenue: MonthlyRevenue[] = [
  { month: 'Tháng 1', revenue: 950000, users: 1300, premiumUsers: 160, growth: 12.5 },
  { month: 'Tháng 2', revenue: 1180000, users: 1350, premiumUsers: 200, growth: 15.8 },
  { month: 'Tháng 3', revenue: 1380000, users: 1480, premiumUsers: 260, growth: 13.2 },
  { month: 'Tháng 4', revenue: 1280000, users: 1320, premiumUsers: 250, growth: 10.7 },
  { month: 'Tháng 5', revenue: 1480000, users: 1550, premiumUsers: 320, growth: 19.4 },
  { month: 'Tháng 6', revenue: 1480000, users: 1600, premiumUsers: 380, growth: 22.1 },
  { month: 'Tháng 7', revenue: 1480000, users: 1650, premiumUsers: 390, growth: 19.8 },
  { month: 'Tháng 8', revenue: 850000, users: 0, premiumUsers: 0, growth: 0 },
  { month: 'Tháng 9', revenue: 0, users: 0, premiumUsers: 0, growth: 0 },
  { month: 'Tháng 10', revenue: 0, users: 0, premiumUsers: 0, growth: 0 },
  { month: 'Tháng 11', revenue: 0, users: 0, premiumUsers: 0, growth: 0 },
  { month: 'Tháng 12', revenue: 0, users: 0, premiumUsers: 0, growth: 0 }
];

export const mockPremiumPackages: PremiumPackage[] = [
  {
    id: '1',
    name: 'Gói 1 Tháng',
    price: 199000,
    duration: '1 tháng',
    features: [
      'Truy cập tất cả bài học',
      'Hỗ trợ học offline',
      'Báo cáo tiến độ chi tiết',
      'Hỗ trợ 24/7'
    ],
    userCount: 1234,
    growthRate: 85,
    isPopular: false
  },
  {
    id: '2',
    name: 'Gói 1 Năm',
    price: 1790000,
    duration: '1 năm',
    features: [
      'Tất cả tính năng gói tháng',
      'Học liệu độc quyền',
      'Tài khoản ưu tiên',
      'Giảm giá 25%'
    ],
    userCount: 856,
    growthRate: 92,
    isPopular: true
  },
  {
    id: '3',
    name: 'Gói 3 Tháng',
    price: 549000,
    duration: '3 tháng',
    features: [
      'Tất cả tính năng gói tháng',
      'Tiết kiệm 8% so với gói tháng',
      'Báo cáo tiến độ nâng cao',
      'Hỗ trợ đa thiết bị'
    ],
    userCount: 567,
    growthRate: 78,
    isPopular: false
  },
  {
    id: '4',
    name: 'Gói 6 Tháng',
    price: 999000,
    duration: '6 tháng',
    features: [
      'Tất cả tính năng gói tháng',
      'Tiết kiệm 17% so với gói tháng',
      'Tự văn học tập cá nhân',
      'Ưu tiên tính năng mới'
    ],
    userCount: 342,
    growthRate: 88,
    isPopular: false
  }
];

export const calculateDashboardStats = (): DashboardStats => {
  const activeData = mockMonthlyRevenue.filter(item => item.revenue > 0);
  const totalRevenue = activeData.reduce((sum, item) => sum + item.revenue, 0);
  const totalUsers = Math.max(...activeData.map(item => item.users));
  const totalPremiumUsers = Math.max(...activeData.map(item => item.premiumUsers));
  const avgGrowth = activeData.reduce((sum, item) => sum + item.growth, 0) / activeData.length;

  return {
    totalUsers: 12847,
    premiumUsers: 3234,
    totalRevenue: Math.round(totalRevenue / 1000000 * 100) / 100, // Convert to millions
    growth: Math.round(avgGrowth * 10) / 10
  };
};