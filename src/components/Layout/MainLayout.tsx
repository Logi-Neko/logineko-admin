import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, message, Badge, Breadcrumb } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  CrownOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      message.success('Đăng xuất thành công!');
      navigate('/login');
    } else if (key === 'profile') {
      // Handle profile navigation
      message.info('Chức năng đang phát triển');
    }
  };

  // Generate breadcrumbs based on current path
  const getBreadcrumbs = () => {
    const pathMap: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/users': 'Người Dùng',
      '/premium': 'Gói Premium',
      '/courses': 'Môn Học',
      '/cau-hoi': 'Câu Hỏi',
      '/thong-bao': 'Thông Báo',
      '/cai-dat': 'Cài Đặt',
    };

    return [
      { title: <HomeOutlined />, path: '/dashboard' },
      ...(pathMap[location.pathname] ? [{ title: pathMap[location.pathname] }] : [])
    ];
  };

  const menuItems = [
    {
      key: 'tong-quan',
      type: 'group',
      label: 'TỔNG QUAN',
      children: [
        {
          key: '/dashboard',
          icon: <DashboardOutlined />,
          label: 'Dashboard',
        },
      ],
    },
    {
      key: 'quan-ly',
      type: 'group',
      label: 'QUẢN LÝ',
      children: [
        {
          key: '/users',
          icon: <UserOutlined />,
          label: 'Người Dùng',
        },
        {
          key: '/premium',
          icon: <CrownOutlined />,
          label: 'Gói Premium',
        },
        {
          key: '/courses',
          icon: <BookOutlined />,
          label: 'Môn Học',
        },
        {
          key: '/cau-hoi',
          icon: <QuestionCircleOutlined />,
          label: 'Câu Hỏi',
        },
      ],
    },
    {
      key: 'he-thong',
      type: 'group',
      label: 'HỆ THỐNG',
      children: [
        {
          key: '/thong-bao',
          icon: <BellOutlined />,
          label: 'Thông Báo',
        },
        {
          key: '/cai-dat',
          icon: <SettingOutlined />,
          label: 'Cài Đặt',
        },
      ],
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      icon: <UserSwitchOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  return (
    <Layout className="!min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={80}
        theme="light"
        width={240}
        className="!shadow-xl !fixed !left-0 !top-0 !bottom-0 !z-10"
        style={{
          background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
          overflow: 'auto'
        }}
      >
        {/* Logo Section with Animation */}
        <div className="h-16 flex items-center justify-center px-4 border-b border-blue-700 border-opacity-30 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg hover-scale">
              <span className="text-blue-600 font-bold text-lg">L</span>
            </div>
            {!collapsed && (
              <div className="animate-slide-in-left">
                <div className="text-white font-bold text-lg tracking-wide">LOGINEKO</div>
                <div className="text-blue-300 text-xs font-medium">ADMIN PANEL</div>
              </div>
            )}
          </div>
        </div>

        {/* Menu Section with Custom Styling */}
        <div className="px-3 py-4">
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems as any}
            onClick={({ key }) => navigate(key)}
            className="!bg-transparent !border-0"
            style={{
              color: '#fff',
            }}
          />
        </div>

        {/* Footer Section */}
        {!collapsed && (
          <div className="absolute bottom-4 left-0 right-0 px-4 animate-fade-in">
            <div className="bg-blue-800 bg-opacity-40 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-blue-200 text-xs text-center m-0">
                Version 1.0.0
              </p>
              <p className="text-blue-300 text-xs text-center m-0 mt-1">
                © 2025 Logineko
              </p>
            </div>
          </div>
        )}
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? '80px' : '240px',
          transition: 'margin-left 0.3s ease'
        }}
      >
        <Header className="!px-6 !bg-white !flex !items-center !justify-between !shadow-md !h-16 !sticky !top-0 !z-[9] animate-fade-in">
          <div className="flex items-center gap-6">
            <div>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'text-xl cursor-pointer text-gray-700 hover:text-blue-600 hover-scale',
                onClick: () => setCollapsed(!collapsed)
              })}
            </div>
            <div className="hidden md:block">
              <Breadcrumb
                items={getBreadcrumbs()}
                className="text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Badge count={5} className="cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-50 transition-all hover-scale">
                <BellOutlined className="text-gray-600 text-lg" />
              </div>
            </Badge>

            {/* User Menu */}
            <Dropdown
              menu={{ items: userMenuItems as any, onClick: handleMenuClick }}
              placement="bottomRight"
              arrow
            >
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md">
                <Avatar className="bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg" size={36}>
                  A
                </Avatar>
                <div className="hidden lg:block">
                  <div className="text-sm font-semibold text-gray-800">Admin User</div>
                  <div className="text-xs text-gray-500">Quản trị viên</div>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="m-6 animate-fade-in">
          <div className="min-h-[calc(100vh-120px)]">
            <Outlet />
          </div>
        </Content>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 py-4 px-6 text-center">
          <p className="text-gray-500 text-sm m-0">
            Made with ❤️ by Logineko Team • © 2025 All Rights Reserved
          </p>
        </div>
      </Layout>
    </Layout>
  );
};

export default MainLayout;