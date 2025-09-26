import React, { useState } from 'react';
import { Card, Table, Input, Button, Tag, Space } from 'antd';
import { SearchOutlined, FileExcelOutlined, UserAddOutlined } from '@ant-design/icons';
import { mockUsers } from '../../data/mockData';
import type { User } from '../../types';

const { Search } = Input;

const Users: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = mockUsers.filter(user =>
      user.name.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase()) ||
      user.id.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: 'Gói',
      dataIndex: 'package',
      key: 'package',
      width: 100,
      render: (packageType: string) => (
        <Tag color={packageType === 'Premium' ? 'gold' : 'blue'}>
          {packageType}
        </Tag>
      ),
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      width: 120,
    },
    {
      title: 'Lần Cuối Đăng Nhập',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      width: 180,
    },
    {
      title: 'Thao Tác',
      key: 'action',
      width: 100,
      render: () => (
        <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
          Xem
        </button>
      ),
    },
  ];

  return (
    <div>
      <Card 
        title="Quản Lý Người Dùng"
        extra={<span className="text-gray-500">Quản lý và theo dõi tất cả người dùng trong hệ thống</span>}
      >
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <Search
                placeholder="Tìm kiếm theo tên, email, ID..."
                allowClear
                enterButton={<SearchOutlined />}
                size="middle"
                className="w-80"
                onSearch={handleSearch}
                onChange={(e) => {
                  if (!e.target.value) {
                    setFilteredUsers(mockUsers);
                    setSearchText('');
                  }
                }}
              />
              <Button>Tất cả trạng thái</Button>
              <Button>Tất cả gói</Button>
              <Button>Mới nhất</Button>
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
                icon={<UserAddOutlined />} 
                className="bg-blue-500 hover:bg-blue-600"
              >
                Thêm Người Dùng
              </Button>
            </Space>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="m-0 text-lg font-semibold">Danh Sách Người Dùng</h3>
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers.map(user => ({ ...user, key: user.id }))}
          pagination={{
            current: 1,
            total: filteredUsers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
          }}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default Users;