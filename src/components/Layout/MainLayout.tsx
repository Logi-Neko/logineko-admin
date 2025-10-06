import React, { useState } from 'react';
import { Layout, Menu, Avatar, Badge, Dropdown, message } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  CrownOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
  BarChartOutlined,
  BookOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
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
        theme="light"
        width={180}
        className="!bg-blue-600"
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center mr-3">
              <span className="text-blue-600 font-bold text-sm">L</span>
            </div>
            {!collapsed && (
              <div>
                <div className="text-white font-bold text-lg">LOGINEKO</div>
                <div className="text-blue-200 text-xs">ADMIN PANEL</div>
              </div>
            )}
          </div>
        </div>

        {/* Menu Section */}
        <div className="px-4 py-2">
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems as any}
            onClick={({ key }) => navigate(key)}
            className="!bg-transparent !border-0"
            style={{
              backgroundColor: 'transparent',
              color: 'white',
            }}
          />
        </div>
      </Sider>

      <Layout>
        <Header className="!px-6 !bg-white !flex !items-center !justify-between !border-b !border-gray-200 !h-16">
          <div className="flex items-center gap-6">
            <div>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'text-lg cursor-pointer text-gray-600 hover:text-blue-600',
                onClick: () => setCollapsed(!collapsed)
              })}
            </div>
            <div>
              <h1 className="m-0 text-xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="m-0 text-gray-500 text-sm">Chào mừng quay trở lại Admin</p>
            </div>
          </div>
          <Dropdown menu={{ items: userMenuItems as any, onClick: handleMenuClick }} placement="bottomRight">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg">
              <Avatar className="bg-blue-500" size={32}>A</Avatar>
              <div>
                <div className="text-sm font-medium text-gray-800">Admin User</div>
                <div className="text-xs text-gray-500">Quản trị viên</div>
              </div>
            </div>
          </Dropdown>
        </Header>
        <Content className="m-0 p-6 bg-gray-50">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;