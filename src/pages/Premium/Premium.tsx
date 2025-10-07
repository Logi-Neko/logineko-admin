import React, { useState, useEffect } from 'react';
import { Card, Button, Progress, Row, Col, message, Modal, Form, InputNumber, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { apiService } from '../../services/api';
import type { SubscriptionPrice, SubscriptionPriceRequest } from '../../types';

interface PremiumPackageDisplay extends SubscriptionPrice {
  name: string;
  features: string[];
  userCount: number;
  growthRate: number;
  isPopular: boolean;
}

const Premium: React.FC = () => {
  const [subscriptionPrices, setSubscriptionPrices] = useState<SubscriptionPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPrice, setEditingPrice] = useState<SubscriptionPrice | null>(null);
  const [form] = Form.useForm();

  const generateDisplayPackages = (prices: SubscriptionPrice[]): PremiumPackageDisplay[] => {
    const packageNames = ['Gói Cơ Bản', 'Gói Tiêu Chuẩn', 'Gói Cao Cấp', 'Gói Vip'];
    const packageFeatures = [
      ['Truy cập khóa học cơ bản', 'Hỗ trợ email', '30 ngày thử nghiệm'],
      ['Tất cả tính năng cơ bản', 'Khóa học nâng cao', 'Hỗ trợ chat trực tiếp', 'Không giới hạn thiết bị'],
      ['Tất cả tính năng tiêu chuẩn', 'Khóa học VIP', 'Gia sư 1-1', 'Báo cáo tiến độ chi tiết'],
      ['Tất cả tính năng cao cấp', 'Khóa học độc quyền', 'Ưu tiên hỗ trợ', 'Tính năng AI cá nhân hóa']
    ];
    const colors = ['#ff85c0', '#40a9ff', '#9254de', '#597ef7'];
    
    return prices.map((price, index) => ({
      ...price,
      name: packageNames[index % packageNames.length],
      features: packageFeatures[index % packageFeatures.length],
      userCount: Math.floor(Math.random() * 5000) + 1000, // Fake user count
      growthRate: Math.floor(Math.random() * 30) + 70, // Fake growth rate 70-100%
      isPopular: index === 1 // Gói thứ 2 là phổ biến nhất
    }));
  };

  const [displayPackages, setDisplayPackages] = useState<PremiumPackageDisplay[]>([]);

  useEffect(() => {
    fetchSubscriptionPrices();
  }, []);

  const fetchSubscriptionPrices = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSubscriptionPrices();
      if (response.status === 200 && response.data) {
        setSubscriptionPrices(response.data);
        setDisplayPackages(generateDisplayPackages(response.data));
      } else {
        message.error('Không thể tải danh sách gói premium');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (price?: SubscriptionPrice) => {
    setEditingPrice(price || null);
    setIsModalVisible(true);
    if (price) {
      form.setFieldsValue({
        price: price.price,
        duration: price.duration
      });
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingPrice(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const request: SubscriptionPriceRequest = {
        price: values.price,
        duration: values.duration
      };

      if (editingPrice) {
        await apiService.updateSubscriptionPrice(editingPrice.id, request);
        message.success('Cập nhật gói premium thành công!');
      } else {
        await apiService.createSubscriptionPrice(request);
        message.success('Tạo gói premium thành công!');
      }

      handleCancel();
      fetchSubscriptionPrices();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiService.deleteSubscriptionPrice(id);
      message.success('Xóa gói premium thành công!');
      fetchSubscriptionPrices();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa!');
    }
  };

  const PackageCard: React.FC<{ package: PremiumPackageDisplay }> = ({ package: pkg }) => {
    const getCardColor = () => {
      const colors = ['#ff85c0', '#40a9ff', '#9254de', '#597ef7'];
      return colors[pkg.id % colors.length] || '#1890ff';
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
          <div className="opacity-90 text-sm">/{pkg.duration} tháng</div>
        </div>

        <div className="mb-6">
          {pkg.features.map((feature, index) => (
            <div key={index} className="flex items-center mb-2 text-sm">
              <span className="mr-2 text-green-400">✓</span>
              {feature}
            </div>
          ))}
        </div>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm">Đang hoạt động</span>
          </div>
          <Progress 
            percent={pkg.growthRate} 
            showInfo={false} 
            strokeColor={getProgressColor()}
            trailColor="rgba(255,255,255,0.3)"
            strokeWidth={8}
          />
        </div>

        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-white bg-opacity-20 border border-white border-opacity-30 text-white hover:bg-opacity-30"
            onClick={() => showModal(pkg)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa gói premium này?"
            onConfirm={() => handleDelete(pkg.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button 
              className="bg-red-500 border-none text-white hover:bg-red-600"
            >
              Xóa
            </Button>
          </Popconfirm>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center !mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý gói Premium</h1>
            <p className="text-gray-600">Quản lý và cấu hình các gói premium cho ứng dụng học tập</p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
            className="shadow-lg"
          >
            Thêm gói mới
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {displayPackages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>
      </div>

      <Modal
        title={editingPrice ? 'Sửa gói premium' : 'Thêm gói premium mới'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={editingPrice ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label="Giá (VND)"
            name="price"
            rules={[
              { required: true, message: 'Vui lòng nhập giá!' },
              { type: 'number', min: 1000, message: 'Giá phải lớn hơn 1,000 VND!' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              placeholder="Nhập giá gói premium"
            />
          </Form.Item>

          <Form.Item
            label="Thời hạn (tháng)"
            name="duration"
            rules={[
              { required: true, message: 'Vui lòng nhập thời hạn!' },
              { type: 'number', min: 1, message: 'Thời hạn phải lớn hơn 0!' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Nhập thời hạn (tháng)"
              min={1}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Premium;