import React from 'react';
import { Card, Row, Col, Table, Tag } from 'antd';
import { Column } from '@ant-design/charts';
import { 
  UserOutlined, 
  CrownOutlined, 
  DollarOutlined, 
  // TrendingUpOutlined 
} from '@ant-design/icons';
import { mockMonthlyRevenue, calculateDashboardStats, mockUsers } from '../../data/mockData';

const Dashboard: React.FC = () => {
  const stats = calculateDashboardStats();

  const chartData = mockMonthlyRevenue.map(item => ({
    month: item.month,
    revenue: item.revenue / 1000, // Convert to thousands
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
      formatter: (datum: any) => datum.revenue > 0 ? `${datum.revenue}K` : '',
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
    },
    {
      title: 'Doanh Thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value: number) => value > 0 ? `${(value / 1000000).toFixed(2)}B VNĐ` : '- VNĐ',
    },
    {
      title: 'Người Dùng Mới',
      dataIndex: 'users',
      key: 'users',
      render: (value: number) => value > 0 ? value.toLocaleString() : '0',
    },
    {
      title: 'Premium Mới',
      dataIndex: 'premiumUsers',
      key: 'premiumUsers',
      render: (value: number) => value > 0 ? value.toLocaleString() : '0',
    },
    {
      title: 'Tăng Trưởng',
      dataIndex: 'growth',
      key: 'growth',
      render: (value: number) => {
        if (value === 0) return <Tag color="default">0%</Tag>;
        const color = value > 15 ? 'green' : value > 10 ? 'blue' : 'orange';
        return <Tag color={color}>+{value}%</Tag>;
      },
    },
    {
      title: 'Trạng Thái',
      key: 'status',
      render: (record: any) => {
        if (record.revenue === 0) return <Tag color="red">Tạm</Tag>;
        return <Tag color="blue">Tốt</Tag>;
      },
    },
  ];

  const userTableColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Gói',
      dataIndex: 'package',
      key: 'package',
      render: (packageType: string) => (
        <Tag color={packageType === 'Premium' ? 'gold' : 'blue'}>
          {packageType}
        </Tag>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'hoạt động' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
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
            value="12,847"
            subtitle="Tổng số người dùng"
            icon={<UserOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Người Dùng Premium"
            value="3,234"
            subtitle="Số người dùng trả phí"
            icon={<CrownOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Doanh Thu"
            value="1.2B"
            subtitle="Tổng doanh thu tháng"
            icon={<DollarOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng Cầu Hỏi"
            value="8,567"
            subtitle="Tăng trưởng"
            icon={<DollarOutlined />}
            color="#722ed1"
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="mt-6">
        <Col span={24}>
          <Card 
            title="Doanh Thu Theo Tháng" 
            extra={<span className="text-gray-500">2025</span>}
          >
            <div className="mb-6">
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <div className="text-center">
                    <p className="m-0 text-gray-500 text-sm">TỔNG DOANH THU 2025</p>
                    <h3 className="my-1 text-blue-500 text-lg font-semibold">8.5B VNĐ</h3>
                    <p className="m-0 text-xs text-gray-500">Tổng doanh thu năm</p>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="text-center">
                    <p className="m-0 text-gray-500 text-sm">TRUNG BÌNH/THÁNG</p>
                    <h3 className="my-1 text-green-500 text-lg font-semibold">1.2B VNĐ</h3>
                    <p className="m-0 text-xs text-gray-500">Trung bình mỗi tháng</p>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="text-center">
                    <p className="m-0 text-gray-500 text-sm">THÁNG CAO NHẤT</p>
                    <h3 className="my-1 text-yellow-500 text-lg font-semibold">Tháng 12</h3>
                    <p className="m-0 text-xs text-gray-500">Tháng có doanh thu cao nhất</p>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="text-center">
                    <p className="m-0 text-gray-500 text-sm">TĂNG TRƯỞNG</p>
                    <h3 className="my-1 text-purple-600 text-lg font-semibold">+18.5%</h3>
                    <p className="m-0 text-xs text-gray-500">So với năm trước</p>
                  </div>
                </Col>
              </Row>
            </div>
            <Column {...chartConfig} height={300} />
            <div className="mt-6">
              <Table
                columns={monthlyTableColumns}
                dataSource={mockMonthlyRevenue.map((item, index) => ({ ...item, key: index }))}
                pagination={false}
                size="middle"
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="mt-6">
        <Col span={24}>
          <Card 
            title="Người Dùng Mới Nhất" 
            extra={
              <div className="flex gap-4">
                <span className="text-blue-500 cursor-pointer hover:text-blue-600">Xuất Excel</span>
                <span className="text-green-500 cursor-pointer hover:text-green-600">Thêm Người Dùng</span>
              </div>
            }
          >
            <Table
              columns={userTableColumns}
              dataSource={mockUsers.slice(0, 4).map(user => ({ ...user, key: user.id }))}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;