import React, { useState } from 'react';
import { Card, Row, Col, Button, Input, Tag, Progress, Space } from 'antd';
import { SearchOutlined, FileExcelOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { mockPremiumPackages } from '../../data/mockData';
import type { PremiumPackage } from '../../types';

const { Search } = Input;

const Premium: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredPackages, setFilteredPackages] = useState<PremiumPackage[]>(mockPremiumPackages);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = mockPremiumPackages.filter(pkg =>
      pkg.name.toLowerCase().includes(value.toLowerCase()) ||
      pkg.duration.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPackages(filtered);
  };

  const PackageCard: React.FC<{ package: PremiumPackage }> = ({ package: pkg }) => {
    const getCardColor = () => {
      switch (pkg.id) {
        case '1': return '#ff85c0'; // Pink
        case '2': return '#40a9ff'; // Blue
        case '3': return '#9254de'; // Purple
        case '4': return '#597ef7'; // Dark Blue
        default: return '#1890ff';
      }
    };

    const getProgressColor = () => {
      if (pkg.growthRate >= 90) return '#52c41a';
      if (pkg.growthRate >= 80) return '#1890ff';
      return '#faad14';
    };

    return (
      <Card
        style={{
          background: `linear-gradient(135deg, ${getCardColor()}, ${getCardColor()}dd)`,
          color: 'white',
          border: 'none',
          position: 'relative',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        {pkg.isPopular && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            PHỔ BIẾN
          </div>
        )}
        
        <div className="text-center mb-6">
          <h3 className="text-white m-0 mb-2 text-lg">{pkg.name}</h3>
          <div className="text-3xl font-bold my-2">
            {pkg.price.toLocaleString()} đ
          </div>
          <div className="opacity-90 text-sm">/{pkg.duration}</div>
        </div>

        <div className="mb-6">
          {pkg.features.map((feature, index) => (
            <div key={index} className="flex items-center mb-2 text-sm">
              <span className="mr-2 text-green-400">✓</span>
              {feature}
            </div>
          ))}
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-2xl font-bold">{pkg.userCount.toLocaleString()}</span>
            <span className="text-2xl font-bold">{pkg.growthRate}%</span>
          </div>
          <div className="flex justify-between text-xs opacity-90">
            <span>Người dùng</span>
            <span>Tỷ lệ gia hạn</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-xs">Đang hoạt động</span>
          </div>
          <Progress 
            percent={pkg.growthRate} 
            showInfo={false} 
            strokeColor={getProgressColor()}
            trailColor="rgba(255,255,255,0.3)"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-white bg-opacity-20 border border-white border-opacity-30 text-white hover:bg-opacity-30"
          >
            Sửa
          </Button>
          <Button 
            className="bg-white bg-opacity-90 border-none"
            style={{ color: getCardColor() }}
          >
            Kích hoạt
          </Button>
          <Button 
            className="bg-red-500 border-none text-white hover:bg-red-600"
          >
            Xóa
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className='h-screen'>
      <Card 
        title="Quản Lý Gói Premium"
        extra={<span className="text-gray-500">Quản lý và cấu hình các gói premium cho app học tập trẻ em</span>}
      >
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
              <Search
                placeholder="Tìm kiếm theo tên gói..."
                allowClear
                enterButton={<SearchOutlined />}
                size="middle"
                className="w-80"
                onSearch={handleSearch}
                onChange={(e) => {
                  if (!e.target.value) {
                    setFilteredPackages(mockPremiumPackages);
                    setSearchText('');
                  }
                }}
              />
              <Button>Tất cả trạng thái</Button>
              <Button>Tất cả thời hạn</Button>
              <Button icon={<SearchOutlined />}>Tìm kiếm</Button>
            </div>
            <Space>
              <Button 
                icon={<FileExcelOutlined />} 
                className="bg-green-500 text-white border-none hover:bg-green-600"
              >
                Xuất Excel
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                className="bg-blue-500 hover:bg-blue-600"
              >
                Thêm Gói Mới
              </Button>
            </Space>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="m-0 text-lg font-semibold">Danh Sách Gói Premium</h3>
        </div>

        <Row gutter={[24, 24]}>
          {filteredPackages.map((pkg) => (
            <Col key={pkg.id} xs={24} sm={12} lg={6}>
              <PackageCard package={pkg} />
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default Premium;