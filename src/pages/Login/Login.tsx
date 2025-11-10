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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-subtle"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>
      </div>

      <Card
        className="w-full max-w-md shadow-2xl border-0 relative z-10 animate-fade-in"
        style={{
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg hover-scale"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <span className="text-white text-3xl font-bold">L</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">
            LOGINEKO
          </h1>
          <p className="text-gray-600 font-medium">Đăng nhập vào Admin Panel</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-subtle"></div>
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse-subtle" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse-subtle" style={{ animationDelay: '0.6s' }}></div>
          </div>
        </div>

        <Spin spinning={loading} tip="Đang xác thực...">
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              label={<span className="font-semibold text-gray-700">Tên đăng nhập</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' }
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Nhập tên đăng nhập"
                className="rounded-xl h-12"
                style={{
                  border: '2px solid #e5e7eb',
                  transition: 'all 0.3s'
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="font-semibold text-gray-700">Mật khẩu</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Nhập mật khẩu"
                className="rounded-xl h-12"
                style={{
                  border: '2px solid #e5e7eb',
                  transition: 'all 0.3s'
                }}
              />
            </Form.Item>

            <Form.Item className="mb-0 mt-6">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-14 text-lg font-bold rounded-xl border-0 hover-scale shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                }}
                loading={loading}
              >
                {loading ? 'Đang đăng nhập...' : '🚀 Đăng nhập'}
              </Button>
            </Form.Item>
          </Form>
        </Spin>

        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            🔒 Kết nối an toàn và bảo mật
          </p>
          <p className="text-xs text-gray-400">
            © 2025 Logineko Admin Panel. All rights reserved.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;