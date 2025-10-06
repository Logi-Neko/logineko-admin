import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Tag, Space, Spin, message } from 'antd';
import { SearchOutlined, FileExcelOutlined, UserAddOutlined } from '@ant-design/icons';
import { apiService } from '../../services/api';
import type { AccountDTO } from '../../types';

const { Search } = Input;

const Users: React.FC = () => {
  const [searchText, setSearchText] = useState('');
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
      <Card className='!h-full'>
        <div className="flex justify-center items-center min-h-[400px]">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <Card className='!h-full'
      title="Quản Lý Người Dùng"
      extra={<span className="text-gray-500">Quản lý và theo dõi tất cả người dùng trong hệ thống</span>}
    >
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Search
              placeholder="Tìm kiếm theo tên, email, username, ID..."
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              className="w-80"
              onSearch={handleSearch}
              onChange={(e) => {
                if (!e.target.value) {
                  setFilteredUsers(users);
                  setSearchText('');
                  setCurrentPage(1); // Reset về trang đầu khi clear search
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="mb-4 mt-4">
        <h3 className="m-0 text-lg font-semibold">
          Danh Sách Người Dùng
        </h3>
      </div>

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
              setCurrentPage(1); // Reset về trang đầu khi thay đổi page size
            }
          },
        }}
        scroll={{ x: 1200 }}
        size="middle"
      />
    </Card>
  );
};

export default Users;