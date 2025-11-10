import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Input, Spin, Table, Tag, message, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import type { AccountDTO } from '../../types';

const { Search } = Input;

const Users: React.FC = () => {
  const [_, setSearchText] = useState('');
  const [users, setUsers] = useState<AccountDTO[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AccountDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserList();
      if (response.status === 200 && response.data) {
        setUsers(response.data);
        setFilteredUsers(response.data);
      } else {
        message.error('Không thể tải danh sách người dùng');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1); // Reset về trang đầu khi search
    const filtered = users.filter(user =>
      user.fullName.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase()) ||
      user.username.toLowerCase().includes(value.toLowerCase()) ||
      user.id.toString().includes(value)
    );
    setFilteredUsers(filtered);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Gói',
      dataIndex: 'premium',
      key: 'premium',
      width: 100,
      render: (premium: boolean) => (
        <Tag color={premium ? 'gold' : 'blue'}>
          {premium ? 'Premium' : 'Miễn phí'}
        </Tag>
      ),
    },
    {
      title: 'Tổng sao',
      dataIndex: 'totalStar',
      key: 'totalStar',
      width: 100,
      render: (totalStar: number) => (
        <span className="font-medium text-yellow-600">⭐ {totalStar}</span>
      ),
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      width: 120,
      render: (dateOfBirth: string | null) => formatDate(dateOfBirth),
    },
  ];

  if (loading) {
    return (
      <Card className='shadow-soft border-0' style={{ borderRadius: '16px' }}>
        <div className="flex justify-center items-center min-h-[400px]">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </Card>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản Lý Người Dùng</h1>
        <p className="text-gray-500">Quản lý và theo dõi tất cả người dùng trong hệ thống</p>
      </div>

      <Card
        className="shadow-soft border-0"
        style={{ borderRadius: '16px' }}
      >
        {/* Stats Summary */}
        <div className="mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card
                bordered={false}
                className="card-hover"
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%)',
                  boxShadow: '0 2px 12px rgba(59, 130, 246, 0.15)'
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="m-0 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                      Tổng Người Dùng
                    </p>
                    <h3 className="m-0 text-blue-900 text-3xl font-bold">
                      {users.length.toLocaleString()}
                    </h3>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-500 bg-opacity-20 flex items-center justify-center">
                    <UserOutlined className="text-3xl text-blue-700" />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card
                bordered={false}
                className="card-hover"
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  boxShadow: '0 2px 12px rgba(251, 191, 36, 0.15)'
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="m-0 text-yellow-800 text-xs font-bold uppercase tracking-wider mb-2">
                      Premium
                    </p>
                    <h3 className="m-0 text-yellow-900 text-3xl font-bold">
                      {users.filter(u => u.premium).length.toLocaleString()}
                    </h3>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-yellow-500 bg-opacity-20 flex items-center justify-center">
                    <span className="text-4xl">👑</span>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card
                bordered={false}
                className="card-hover"
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                  boxShadow: '0 2px 12px rgba(34, 197, 94, 0.15)'
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="m-0 text-green-700 text-xs font-bold uppercase tracking-wider mb-2">
                      Miễn Phí
                    </p>
                    <h3 className="m-0 text-green-900 text-3xl font-bold">
                      {users.filter(u => !u.premium).length.toLocaleString()}
                    </h3>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-green-500 bg-opacity-20 flex items-center justify-center">
                    <span className="text-4xl">🆓</span>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Search
            placeholder="🔍 Tìm kiếm theo tên, email, username, ID..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            className="max-w-xl"
            onSearch={handleSearch}
            onChange={(e) => {
              if (!e.target.value) {
                setFilteredUsers(users);
                setSearchText('');
                setCurrentPage(1);
              }
            }}
          />
        </div>

        {/* Table Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="m-0 text-base font-semibold text-gray-700">
            📋 Danh Sách Người Dùng ({filteredUsers.length})
          </h3>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredUsers.map(user => ({ ...user, key: user.id }))}
          pagination={{
            current: currentPage,
            total: filteredUsers.length,
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
            onChange: (page, size) => {
              setCurrentPage(page);
              if (size !== pageSize) {
                setPageSize(size);
                setCurrentPage(1);
              }
            },
          }}
          scroll={{ x: 1200 }}
          size="middle"
          className="shadow-sm rounded-lg"
        />
      </Card>
    </div>
  );
};

export default Users;