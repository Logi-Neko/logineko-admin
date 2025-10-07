import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Tag, Spin, message } from 'antd';
import { Column } from '@ant-design/charts';
import { 
  UserOutlined, 
  CrownOutlined, 
  DollarOutlined,
  QuestionCircleOutlined, 
  // TrendingUpOutlined 
} from '@ant-design/icons';
import type { AdminStatDTO } from '../../types';
import { apiService } from '../../services/api';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState<AdminStatDTO | null>(null);
  const [selectedYear, setSelectedYear] = useState(2025);

  useEffect(() => {
    fetchAdminStats();
  }, [selectedYear]);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminStatistics(selectedYear);
      if (response.status === 200 || response.data) {
        setAdminStats(response.data);
      } else {
        message.error('Không thể tải dữ liệu thống kê');
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      message.error('Lỗi khi tải dữ liệu thống kê');
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
      fill: '#1890ff',
    },
    label: {
      position: 'top' as const,
      formatter: (datum: any) => datum.revenue > 0 ? `${datum.revenue.toFixed(1)}M` : '',
    },
    meta: {
      revenue: {
        alias: 'Doanh thu (VNĐ)',
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
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="m-0 text-gray-500 text-sm">{title}</p>
          <h2 className="my-2 text-3xl font-bold">{value}</h2>
          {subtitle && <p className="m-0 text-gray-500 text-xs">{subtitle}</p>}
        </div>
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng Người Dùng"
            value={adminStats.totalUsers.toLocaleString()}
            icon={<UserOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Người Dùng Premium"
            value={adminStats.totalPremiumUsers.toLocaleString()}
            icon={<CrownOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng Doanh Thu"
            value={`${(adminStats.totalRevenueInYear / 1000000).toFixed(1)}M VNĐ`}
            icon={<DollarOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng Cầu Hỏi"
            value={adminStats.totalQuestions.toLocaleString()}
            icon={<QuestionCircleOutlined />}
            color="#722ed1"
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="mt-6">
        <Col span={24}>
          <Card 
            title="Doanh Thu Theo Tháng" 
            extra={<span className="text-gray-500">{adminStats.year}</span>}
          >
            <div className="mb-6">
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <div className="text-center">
                    <p className="m-0 text-gray-500 text-sm">TỔNG DOANH THU {adminStats.year}</p>
                    <h3 className="my-1 text-blue-500 text-lg font-semibold">
                      {(adminStats.totalRevenueInYear / 1000000).toFixed(1)}M VNĐ
                    </h3>
                    <p className="m-0 text-xs text-gray-500">Tổng doanh thu năm</p>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="text-center">
                    <p className="m-0 text-gray-500 text-sm">TRUNG BÌNH/THÁNG</p>
                    <h3 className="my-1 text-green-500 text-lg font-semibold">
                      {(adminStats.averageRevenueInMonth / 1000000).toFixed(1)}M VNĐ
                    </h3>
                    <p className="m-0 text-xs text-gray-500">Trung bình mỗi tháng</p>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="text-center">
                    <p className="m-0 text-gray-500 text-sm">THÁNG CAO NHẤT</p>
                    <h3 className="my-1 text-yellow-500 text-lg font-semibold">
                      Tháng {adminStats.monthWithHighestRevenue}
                    </h3>
                    <p className="m-0 text-xs text-gray-500">Tháng có doanh thu cao nhất</p>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="text-center">
                    <p className="m-0 text-gray-500 text-sm">TĂNG TRƯỞNG</p>
                    <h3 className="my-1 text-purple-600 text-lg font-semibold">
                      {adminStats.yearOverYearGrowth > 0 ? '+' : ''}{adminStats.yearOverYearGrowth}%
                    </h3>
                    <p className="m-0 text-xs text-gray-500">So với năm trước</p>
                  </div>
                </Col>
              </Row>
            </div>
            <Column {...chartConfig} height={300} />
            <div className="mt-6">
              <Table
                columns={monthlyTableColumns}
                dataSource={adminStats.monthData.map((item, index) => ({ ...item, key: index }))}
                pagination={false}
                size="middle"
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;