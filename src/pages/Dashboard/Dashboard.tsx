import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Tag, Spin, message, Progress, Statistic } from 'antd';
import { Column, Pie, Line, Area } from '@ant-design/charts';
import {
  UserOutlined,
  CrownOutlined,
  DollarOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
  RiseOutlined,
  FallOutlined,
  ClockCircleOutlined,
  FireOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import type { AdminStatDTO, SubscriptionStatusDTO, ChurnRateDTO, PopularCoursesDTO, RevenueByTypeDTO, ActiveUsersMetricsDTO } from '../../types';
import { apiService } from '../../services/api';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState<AdminStatDTO | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatusDTO | null>(null);
  const [churnRate, setChurnRate] = useState<ChurnRateDTO | null>(null);
  const [popularCourses, setPopularCourses] = useState<PopularCoursesDTO | null>(null);
  const [revenueByType, setRevenueByType] = useState<RevenueByTypeDTO | null>(null);
  const [activeUsersMetrics, setActiveUsersMetrics] = useState<ActiveUsersMetricsDTO | null>(null);
  const [selectedYear, _] = useState(2025);
  const currentMonth = new Date().getMonth() + 1;

  // Calculate date range for active users (last 30 days)
  const getDateRange = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    return {
      from: formatDate(thirtyDaysAgo),
      to: formatDate(today)
    };
  };

  useEffect(() => {
    fetchAllData();
  }, [selectedYear]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const dateRange = getDateRange();

      // Fetch all data in parallel
      const [adminStatsRes, subStatusRes, churnRes, coursesRes, revenueTypeRes, activeUsersRes] = await Promise.all([
        apiService.getAdminStatistics(selectedYear),
        apiService.getSubscriptionStatus(),
        apiService.getChurnRate(selectedYear, currentMonth),
        apiService.getPopularCourses(5),
        apiService.getRevenueByType(selectedYear),
        apiService.getActiveUsersMetrics(dateRange.from, dateRange.to),
      ]);

      if (adminStatsRes.status === 200 || adminStatsRes.data) {
        setAdminStats(adminStatsRes.data);
      }

      if (subStatusRes.status === 200 || subStatusRes.data) {
        setSubscriptionStatus(subStatusRes.data);
      }

      if (churnRes.status === 200 || churnRes.data) {
        setChurnRate(churnRes.data);
      }

      if (coursesRes.status === 200 || coursesRes.data) {
        setPopularCourses(coursesRes.data);
      }

      if (revenueTypeRes.status === 200 || revenueTypeRes.data) {
        setRevenueByType(revenueTypeRes.data);
      }

      if (activeUsersRes.status === 200 || activeUsersRes.data) {
        setActiveUsersMetrics(activeUsersRes.data);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Lỗi khi tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!adminStats) {
    return (
      <div className="text-center py-8">
        <p>Không có dữ liệu thống kê</p>
      </div>
    );
  }

  const chartData = adminStats.monthData.map(item => ({
    month: `Tháng ${item.month}`,
    revenue: item.revenue / 1000000, // Convert to millions
  }));

  const chartConfig = {
    data: chartData,
    xField: 'month',
    yField: 'revenue',
    columnStyle: {
      fill: 'l(270) 0:#667eea 1:#764ba2',
      radius: [8, 8, 0, 0],
    },
    label: {
      position: 'top' as const,
      style: {
        fill: '#667eea',
        fontWeight: 600,
        fontSize: 12,
      },
      formatter: (datum: any) => datum.revenue > 0 ? `${datum.revenue.toFixed(1)}M` : '',
    },
    meta: {
      revenue: {
        alias: 'Doanh thu (triệu VNĐ)',
      },
    },
    xAxis: {
      label: {
        style: {
          fill: '#64748b',
          fontSize: 12,
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: '#64748b',
          fontSize: 12,
        },
        formatter: (v: string) => `${v}M`,
      },
      grid: {
        line: {
          style: {
            stroke: '#e2e8f0',
            lineWidth: 1,
            lineDash: [4, 4],
          },
        },
      },
    },
    tooltip: {
      customContent: (title: string, items: any[]) => {
        if (!items || items.length === 0) return '';
        const item = items[0];
        return `
          <div style="padding: 12px; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <div style="color: #475569; font-size: 12px; margin-bottom: 4px;">${title}</div>
            <div style="color: #667eea; font-size: 18px; font-weight: 600;">${item?.value?.toFixed(1)}M VNĐ</div>
          </div>
        `;
      },
    },
  };

  const monthlyTableColumns = [
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
      render: (value: number) => `Tháng ${value}`,
    },
    {
      title: 'Doanh Thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value: number) => value > 0 ? `${(value / 1000000).toFixed(2)}B VNĐ` : '- VNĐ',
    },
    {
      title: 'Người Dùng Mới',
      dataIndex: 'newUsers',
      key: 'newUsers',
      render: (value: number) => value > 0 ? value.toLocaleString() : '0',
    },
    {
      title: 'Premium Mới',
      dataIndex: 'newPremiumUsers',
      key: 'newPremiumUsers',
      render: (value: number) => value > 0 ? value.toLocaleString() : '0',
    },
    {
      title: 'Tăng Trưởng',
      dataIndex: 'monthOverMonthGrowth',
      key: 'monthOverMonthGrowth',
      render: (value: number) => {
        if (value === 0) return <Tag color="default">0%</Tag>;
        const color = value > 15 ? 'green' : value > 10 ? 'blue' : 'orange';
        const sign = value > 0 ? '+' : '';
        return <Tag color={color}>{sign}{value.toFixed(1)}%</Tag>;
      },
    },
  ];

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    gradient: string;
    subtitle?: string;
    trend?: { value: number; isPositive: boolean };
  }> = ({ title, value, icon, gradient, subtitle, trend }) => (
    <Card
      className="card-hover border-0 overflow-hidden"
      style={{
        borderRadius: '20px',
        background: 'white',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
              style={{ background: gradient }}
            >
              <span className="text-xl">{icon}</span>
            </div>
          </div>
          <p className="m-0 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h2 className="m-0 text-3xl font-bold text-gray-900">{value}</h2>
            {subtitle && <span className="text-sm text-gray-400 font-medium">{subtitle}</span>}
          </div>
          {trend && (
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${trend.isPositive
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
                  }`}
              >
                <span className="text-sm">{trend.isPositive ? '↑' : '↓'}</span>
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-400">vs tháng trước</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="pb-6">
      {/* Page Header */}
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-500">Tổng quan về hệ thống và hoạt động</p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng Người Dùng"
            value={adminStats.totalUsers.toLocaleString()}
            icon={<UserOutlined />}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            trend={{ value: 12.5, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Người Dùng Premium"
            value={adminStats.totalPremiumUsers.toLocaleString()}
            icon={<CrownOutlined />}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            trend={{ value: 8.3, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng Doanh Thu"
            value={`${(adminStats.totalRevenueInYear / 1000000).toFixed(1)}M`}
            icon={<DollarOutlined />}
            gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
            subtitle="VNĐ"
            trend={{ value: 15.7, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng Câu Hỏi"
            value={adminStats.totalQuestions.toLocaleString()}
            icon={<QuestionCircleOutlined />}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            trend={{ value: 5.2, isPositive: true }}
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="mt-8">
        <Col span={24}>
          <Card
            className="shadow-soft border-0 animate-fade-in"
            style={{ borderRadius: '16px' }}
            title={
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-800">
                  📊 Doanh Thu Theo Tháng
                </span>
                <span className="px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold">
                  {adminStats.year}
                </span>
              </div>
            }
          >
            {/* Stats Summary Cards */}
            <div className="mb-8">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    bordered={false}
                    className="text-center"
                    style={{
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%)',
                      boxShadow: '0 2px 12px rgba(59, 130, 246, 0.15)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <p className="m-0 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                      Tổng Doanh Thu {adminStats.year}
                    </p>
                    <h3 className="my-0 text-blue-900 text-2xl font-bold">
                      {(adminStats.totalRevenueInYear / 1000000).toFixed(1)}M
                    </h3>
                    <p className="m-0 text-xs text-blue-600 mt-1 font-medium">VNĐ</p>
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    bordered={false}
                    className="text-center"
                    style={{
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                      boxShadow: '0 2px 12px rgba(34, 197, 94, 0.15)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <p className="m-0 text-green-700 text-xs font-bold uppercase tracking-wider mb-2">
                      Trung Bình/Tháng
                    </p>
                    <h3 className="my-0 text-green-900 text-2xl font-bold">
                      {(adminStats.averageRevenueInMonth / 1000000).toFixed(1)}M
                    </h3>
                    <p className="m-0 text-xs text-green-600 mt-1 font-medium">VNĐ</p>
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    bordered={false}
                    className="text-center"
                    style={{
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
                      boxShadow: '0 2px 12px rgba(251, 146, 60, 0.15)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <p className="m-0 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
                      Tháng Cao Nhất
                    </p>
                    <h3 className="my-0 text-orange-900 text-2xl font-bold">
                      Tháng {adminStats.monthWithHighestRevenue}
                    </h3>
                    <p className="m-0 text-xs text-orange-700 mt-1 font-medium">Doanh thu tốt nhất</p>
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    bordered={false}
                    className="text-center"
                    style={{
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)',
                      boxShadow: '0 2px 12px rgba(168, 85, 247, 0.15)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <p className="m-0 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
                      Tăng Trưởng
                    </p>
                    <h3 className="my-0 text-purple-900 text-2xl font-bold">
                      {adminStats.yearOverYearGrowth > 0 ? '+' : ''}{adminStats.yearOverYearGrowth}%
                    </h3>
                    <p className="m-0 text-xs text-purple-600 mt-1 font-medium">So với năm trước</p>
                  </Card>
                </Col>
              </Row>
            </div>

            {/* Chart */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <Column {...chartConfig} height={300} />
            </div>

            {/* Data Table */}
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-4">
                📈 Chi Tiết Theo Tháng
              </h4>
              <Table
                columns={monthlyTableColumns}
                dataSource={adminStats.monthData.map((item, index) => ({ ...item, key: index }))}
                pagination={false}
                size="middle"
                className="shadow-sm rounded-lg overflow-hidden"
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Subscription Status & Churn Rate Row */}
      <Row gutter={[24, 24]} className="mt-8">
        {/* Subscription Status */}
        {subscriptionStatus && (
          <Col xs={24} lg={12}>
            <Card
              className="shadow-soft border-0 animate-fade-in"
              style={{ borderRadius: '16px' }}
              title={<span className="text-lg font-bold text-gray-800">📊 Trạng Thái Gói Đăng Ký</span>}
            >
              <div className="mb-6">
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{subscriptionStatus.activeSubscriptions}</div>
                      <div className="text-xs text-gray-500 mt-1">Đang hoạt động</div>
                      <Progress
                        percent={subscriptionStatus.activePercentage}
                        strokeColor="#22c55e"
                        showInfo={false}
                        size="small"
                      />
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{subscriptionStatus.inactiveSubscriptions}</div>
                      <div className="text-xs text-gray-500 mt-1">Không hoạt động</div>
                      <Progress
                        percent={subscriptionStatus.inactivePercentage}
                        strokeColor="#f97316"
                        showInfo={false}
                        size="small"
                      />
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">{subscriptionStatus.expiredSubscriptions}</div>
                      <div className="text-xs text-gray-500 mt-1">Hết hạn</div>
                      <Progress
                        percent={subscriptionStatus.expiredPercentage}
                        strokeColor="#ef4444"
                        showInfo={false}
                        size="small"
                      />
                    </div>
                  </Col>
                </Row>
              </div>
              <Pie
                data={[
                  { type: 'Hoạt động', value: subscriptionStatus.activeSubscriptions },
                  { type: 'Không hoạt động', value: subscriptionStatus.inactiveSubscriptions },
                  { type: 'Hết hạn', value: subscriptionStatus.expiredSubscriptions },
                ]}
                angleField="value"
                colorField="type"
                radius={0.8}
                innerRadius={0.6}
                label={{
                  type: 'inner',
                  offset: '-30%',
                  content: '{percentage}',
                  style: { fontSize: 14, fontWeight: 'bold' }
                }}
                legend={{ position: 'bottom' }}
                color={['#22c55e', '#f97316', '#ef4444']}
                height={250}
              />
            </Card>
          </Col>
        )}

        {/* Churn Rate */}
        {churnRate && (
          <Col xs={24} lg={12}>
            <Card
              className="shadow-soft border-0 animate-fade-in"
              style={{ borderRadius: '16px' }}
              title={<span className="text-lg font-bold text-gray-800">📉 Tỷ Lệ Churn - Tháng {churnRate.month}/{churnRate.year}</span>}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card bordered={false} className="bg-red-50">
                    <div className="text-center">
                      <FallOutlined className="text-3xl text-red-500 mb-2" />
                      <div className="text-2xl font-bold text-red-700">{churnRate.churnRate.toFixed(1)}%</div>
                      <div className="text-xs text-gray-600">Tỷ lệ Churn</div>
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card bordered={false} className="bg-green-50">
                    <div className="text-center">
                      <RiseOutlined className="text-3xl text-green-500 mb-2" />
                      <div className="text-2xl font-bold text-green-700">{churnRate.retentionRate.toFixed(1)}%</div>
                      <div className="text-xs text-gray-600">Tỷ lệ giữ chân</div>
                    </div>
                  </Card>
                </Col>
              </Row>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Đầu tháng</span>
                  <span className="font-bold text-gray-900">{churnRate.subscriptionsAtStart}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-green-700">Mới đăng ký</span>
                  <span className="font-bold text-green-700">+{churnRate.newSubscriptions}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm text-red-700">Hủy/Hết hạn</span>
                  <span className="font-bold text-red-700">-{churnRate.canceledSubscriptions + churnRate.expiredSubscriptions}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-700">Cuối tháng</span>
                  <span className="font-bold text-blue-700">{churnRate.subscriptionsAtEnd}</span>
                </div>
              </div>
            </Card>
          </Col>
        )}
      </Row>

      {/* Course Performance */}
      {popularCourses && (
        <Row gutter={[24, 24]} className="mt-8">
          <Col span={24}>
            <Card
              className="shadow-soft border-0 animate-fade-in"
              style={{ borderRadius: '16px' }}
              title={<span className="text-lg font-bold text-gray-800">🎓 Khóa Học Phổ Biến</span>}
            >
              <div className="mb-6">
                <Row gutter={[16, 16]}>
                  <Col xs={12} sm={6}>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">{popularCourses.totalCourses}</div>
                      <div className="text-xs text-gray-600">Tổng khóa học</div>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-700">{popularCourses.totalPremiumCourses}</div>
                      <div className="text-xs text-gray-600">Premium</div>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">{popularCourses.totalFreeCourses}</div>
                      <div className="text-xs text-gray-600">Miễn phí</div>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-700">{popularCourses.averageStudentsPerCourse.toFixed(0)}</div>
                      <div className="text-xs text-gray-600">TB học viên</div>
                    </div>
                  </Col>
                </Row>
              </div>
              <Table
                dataSource={popularCourses.popularCourses.map(course => ({ ...course, key: course.courseId }))}
                pagination={false}
                size="middle"
                className="shadow-sm rounded-lg"
                columns={[
                  {
                    title: 'Khóa học',
                    dataIndex: 'courseName',
                    key: 'courseName',
                    render: (text, record) => (
                      <div className="flex items-center gap-3">
                        <img src={record.thumbnailUrl} alt={text} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <div className="font-semibold text-gray-800">{text}</div>
                          <div className="text-xs text-gray-500">{record.totalLessons} bài học • {record.totalVideos} videos</div>
                        </div>
                      </div>
                    )
                  },
                  {
                    title: 'Loại',
                    dataIndex: 'isPremium',
                    key: 'isPremium',
                    width: 100,
                    render: (isPremium) => (
                      <Tag color={isPremium ? 'gold' : 'blue'}>{isPremium ? 'Premium' : 'Miễn phí'}</Tag>
                    )
                  },
                  {
                    title: 'Học viên',
                    dataIndex: 'uniqueStudents',
                    key: 'uniqueStudents',
                    width: 100,
                    sorter: (a, b) => a.uniqueStudents - b.uniqueStudents,
                    render: (value) => <span className="font-semibold"><TeamOutlined /> {value}</span>
                  },
                  {
                    title: 'Điểm TB',
                    dataIndex: 'averageScore',
                    key: 'averageScore',
                    width: 100,
                    render: (value) => (
                      <span className={`font-semibold ${value >= 80 ? 'text-green-600' : value >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {value.toFixed(1)}%
                      </span>
                    )
                  },
                  {
                    title: 'Hoàn thành',
                    dataIndex: 'completionRate',
                    key: 'completionRate',
                    width: 150,
                    render: (value) => (
                      <Progress
                        percent={value}
                        size="small"
                        strokeColor={value >= 80 ? '#22c55e' : value >= 50 ? '#f59e0b' : '#ef4444'}
                      />
                    )
                  }
                ]}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Revenue by Type */}
      {revenueByType && (
        <Row gutter={[24, 24]} className="mt-8">
          <Col span={24}>
            <Card
              className="shadow-soft border-0 animate-fade-in"
              style={{ borderRadius: '16px' }}
              title={<span className="text-lg font-bold text-gray-800">💰 Doanh Thu Theo Loại Gói</span>}
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Pie
                    data={revenueByType.revenueByType.map(item => ({
                      type: item.subscriptionType,
                      value: item.revenue
                    }))}
                    angleField="value"
                    colorField="type"
                    radius={0.8}
                    label={{
                      type: 'outer',
                      content: '{name} {percentage}',
                    }}
                    height={300}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <div className="space-y-4">
                    {revenueByType.revenueByType.map((item, index) => (
                      <Card key={index} bordered={false} className="bg-gradient-to-r from-blue-50 to-purple-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold text-lg text-gray-800">{item.subscriptionType}</div>
                            <div className="text-sm text-gray-500">{item.count} gói đăng ký</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-xl text-blue-600">
                              {(item.revenue / 1000000).toFixed(1)}M
                            </div>
                            <div className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Progress
                            percent={item.percentage}
                            strokeColor="linear-gradient(to right, #667eea, #764ba2)"
                            showInfo={false}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-2">Phổ biến nhất: <span className="font-bold text-blue-700">{revenueByType.mostPopularType}</span></div>
                    <div className="text-sm text-gray-600">Lợi nhuận cao nhất: <span className="font-bold text-green-700">{revenueByType.mostProfitableType}</span></div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      )}

      {/* Active Users Metrics */}
      {activeUsersMetrics && (
        <Row gutter={[24, 24]} className="mt-8">
          <Col span={24}>
            <Card
              className="shadow-soft border-0 animate-fade-in"
              style={{ borderRadius: '16px' }}
              title={<span className="text-lg font-bold text-gray-800">🔥 Hoạt Động Người Dùng (30 ngày qua)</span>}
            >
              {/* DAU/WAU/MAU Stats */}
              <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={8}>
                  <Card bordered={false} className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <Statistic
                      title={<span className="text-white text-opacity-90">Daily Active Users (DAU)</span>}
                      value={activeUsersMetrics.dailyActiveUsers}
                      prefix={<FireOutlined />}
                      valueStyle={{ color: 'white', fontSize: '32px' }}
                    />
                    <div className="mt-2 text-sm text-white text-opacity-80">
                      Hoạt động hôm qua
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card bordered={false} className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <Statistic
                      title={<span className="text-white text-opacity-90">Weekly Active Users (WAU)</span>}
                      value={activeUsersMetrics.weeklyActiveUsers}
                      prefix={<ClockCircleOutlined />}
                      valueStyle={{ color: 'white', fontSize: '32px' }}
                    />
                    <div className="mt-2 text-sm text-white text-opacity-80">
                      Hoạt động 7 ngày qua
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card bordered={false} className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <Statistic
                      title={<span className="text-white text-opacity-90">Monthly Active Users (MAU)</span>}
                      value={activeUsersMetrics.monthlyActiveUsers}
                      prefix={<TrophyOutlined />}
                      valueStyle={{ color: 'white', fontSize: '32px' }}
                    />
                    <div className="mt-2 text-sm text-white text-opacity-80">
                      Hoạt động 30 ngày qua
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* User Activity Summary */}
              <Row gutter={[16, 16]} className="mb-6">
                <Col xs={12} sm={6}>
                  <Card bordered={false} className="text-center bg-blue-50">
                    <div className="text-3xl font-bold text-blue-700">{activeUsersMetrics.totalActiveUsers}</div>
                    <div className="text-xs text-gray-600 mt-1">Tổng người dùng hoạt động</div>
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card bordered={false} className="text-center bg-yellow-50">
                    <div className="text-3xl font-bold text-yellow-700">{activeUsersMetrics.totalPremiumActiveUsers}</div>
                    <div className="text-xs text-gray-600 mt-1">Premium hoạt động</div>
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card bordered={false} className="text-center bg-green-50">
                    <div className="text-3xl font-bold text-green-700">{activeUsersMetrics.totalFreeActiveUsers}</div>
                    <div className="text-xs text-gray-600 mt-1">Miễn phí hoạt động</div>
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card bordered={false} className="text-center bg-purple-50">
                    <div className="text-3xl font-bold text-purple-700">{activeUsersMetrics.averageAttemptsPerUser.toFixed(1)}</div>
                    <div className="text-xs text-gray-600 mt-1">TB câu hỏi/người</div>
                  </Card>
                </Col>
              </Row>

              {/* Daily Activity Chart */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-gray-800 mb-4">📈 Xu Hướng Hoạt Động Hàng Ngày</h4>
                <Area
                  data={activeUsersMetrics.dailyActivities.map(item => ({
                    date: new Date(item.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
                    value: item.activeUsers,
                  }))}
                  xField="date"
                  yField="value"
                  height={300}
                />
              </div>

              {/* Multiple Metrics Line Chart */}
              <div>
                <h4 className="text-base font-semibold text-gray-800 mb-4">📊 So Sánh Các Chỉ Số</h4>
                <Line
                  data={[
                    ...activeUsersMetrics.dailyActivities.map(item => ({
                      date: new Date(item.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
                      value: item.activeUsers,
                      type: 'Người dùng hoạt động'
                    })),
                    ...activeUsersMetrics.dailyActivities.map(item => ({
                      date: new Date(item.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
                      value: item.totalAttempts / 10, // Scale down for better visualization
                      type: 'Câu hỏi (x10)'
                    }))
                  ]}
                  xField="date"
                  yField="value"
                  seriesField="type"
                  height={300}
                />
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard;