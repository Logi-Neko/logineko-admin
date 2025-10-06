import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import type { LoginRequest } from '../../types';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      const response = await apiService.login(values);
      
      if (response.status === 200 && response.data) {
        // Sử dụng context để login
        login(response.data.access_token, response.data.refresh_token);
        
        message.success('Đăng nhập thành công!');
        
        // Chuyển hướng đến trang được yêu cầu hoặc dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        message.error(response.message || 'Đăng nhập thất bại!');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card 
        className="w-full max-w-md shadow-2xl border-0"
        style={{ borderRadius: '16px' }}
      >
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">L</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">LOGINEKO</h1>
          <p className="text-gray-600">Đăng nhập vào Admin Panel</p>
        </div>

        <Spin spinning={loading}>
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[
                { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' }
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Nhập tên đăng nhập"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Nhập mật khẩu"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 border-0"
                loading={loading}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </Form.Item>
          </Form>
        </Spin>

        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            © 2025 Logineko Admin Panel. All rights reserved.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;