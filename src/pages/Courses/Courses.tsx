import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Tag, Space, Spin, message, Collapse, Typography, Avatar, Rate, Badge } from 'antd';
import { SearchOutlined, BookOutlined, PlayCircleOutlined, StarOutlined, ClockCircleOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import { apiService } from '../../services/api';
import type { CourseDTO, LessonDTO, VideoDTO } from '../../types';

const { Search } = Input;
const { Panel } = Collapse;
const { Title, Text, Paragraph } = Typography;

const Courses: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [expandedCourses, setExpandedCourses] = useState<Record<number, { lessons: LessonDTO[], loading: boolean }>>({});
  const [expandedLessons, setExpandedLessons] = useState<Record<number, { videos: VideoDTO[], loading: boolean }>>({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCourseList();
      if (response.status === 200 && response.data) {
        setCourses(response.data);
        setFilteredCourses(response.data);
      } else {
        message.error('Không thể tải danh sách khóa học');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      message.error('Lỗi khi tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonsForCourse = async (courseId: number) => {
    try {
      setExpandedCourses(prev => ({
        ...prev,
        [courseId]: { ...prev[courseId], loading: true }
      }));

      const response = await apiService.getLessonsByCourseId(courseId);
      if (response.status === 200 && response.data) {
        setExpandedCourses(prev => ({
          ...prev,
          [courseId]: { lessons: response.data, loading: false }
        }));
      } else {
        message.error('Không thể tải danh sách bài học');
        setExpandedCourses(prev => ({
          ...prev,
          [courseId]: { lessons: [], loading: false }
        }));
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
      message.error('Lỗi khi tải danh sách bài học');
      setExpandedCourses(prev => ({
        ...prev,
        [courseId]: { lessons: [], loading: false }
      }));
    }
  };

  const fetchVideosForLesson = async (lessonId: number) => {
    try {
      setExpandedLessons(prev => ({
        ...prev,
        [lessonId]: { ...prev[lessonId], loading: true }
      }));

      const response = await apiService.getVideosByLessonId(lessonId);
      if (response.status === 200 && response.data) {
        setExpandedLessons(prev => ({
          ...prev,
          [lessonId]: { videos: response.data, loading: false }
        }));
      } else {
        message.error('Không thể tải danh sách video');
        setExpandedLessons(prev => ({
          ...prev,
          [lessonId]: { videos: [], loading: false }
        }));
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      message.error('Lỗi khi tải danh sách video');
      setExpandedLessons(prev => ({
        ...prev,
        [lessonId]: { videos: [], loading: false }
      }));
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
    const filtered = courses.filter(course =>
      course.name.toLowerCase().includes(value.toLowerCase()) ||
      course.description.toLowerCase().includes(value.toLowerCase()) ||
      course.id.toString().includes(value)
    );
    setFilteredCourses(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getDifficultyText = (level: number) => {
    switch (level) {
      case 1: return 'Dễ';
      case 2: return 'Trung bình';
      case 3: return 'Khó';
      default: return 'Không xác định';
    }
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'green';
      case 2: return 'orange';
      case 3: return 'red';
      default: return 'default';
    }
  };

  const renderVideoQuestion = (video: VideoDTO) => {
    if (!video.videoQuestion) return null;
    
    const { question, optionA, optionB, optionC, optionD, answer } = video.videoQuestion;
    
    return (
      <Card size="small" style={{ marginTop: 8, backgroundColor: '#f8f9fa' }}>
        <Title level={5}>Câu hỏi:</Title>
        <Paragraph>{question}</Paragraph>
        <Space direction="vertical" size="small">
          <Text>A. {optionA}</Text>
          <Text>B. {optionB}</Text>
          <Text>C. {optionC}</Text>
          <Text>D. {optionD}</Text>
          <Text strong style={{ color: '#52c41a' }}>Đáp án: {answer}</Text>
        </Space>
      </Card>
    );
  };

  const renderVideos = (lessonId: number) => {
    const lessonData = expandedLessons[lessonId];
    
    if (!lessonData) return null;
    
    if (lessonData.loading) {
      return <Spin size="small" />;
    }

    return (
      <div style={{ marginLeft: 24, marginTop: 8 }}>
        {lessonData.videos.map((video, index) => (
          <Card 
            key={video.id} 
            size="small" 
            style={{ marginBottom: 8 }}
            title={
              <Space>
                <PlayCircleOutlined style={{ color: '#1890ff' }} />
                <Text strong>{video.title}</Text>
                <Tag color={video.isActive ? 'green' : 'red'}>
                  {video.isActive ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
              </Space>
            }
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Space>
                <ClockCircleOutlined />
                <Text>Thời lượng: {formatDuration(video.duration)}</Text>
                <Text>Thứ tự: {video.order}</Text>
              </Space>
              
              {video.videoUrl ? (
                <div style={{ marginBottom: 8 }}>
                  <video 
                    width="300" 
                    height="200" 
                    controls 
                    poster={video.thumbnailUrl}
                    style={{ borderRadius: 8, border: '1px solid #d9d9d9' }}
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ video HTML5.
                  </video>
                </div>
              ) : video.thumbnailUrl && (
                <Avatar 
                  shape="square" 
                  size={64} 
                  src={video.thumbnailUrl} 
                  icon={<PlayCircleOutlined />}
                />
              )}
              
              <Space>
                <Text type="secondary">Tạo: {formatDate(video.createdAt)}</Text>
                <Text type="secondary">Cập nhật: {formatDate(video.updatedAt)}</Text>
              </Space>
              
              {renderVideoQuestion(video)}
            </Space>
          </Card>
        ))}
      </div>
    );
  };

  const renderLessons = (courseId: number) => {
    const courseData = expandedCourses[courseId];
    
    if (!courseData) return null;
    
    if (courseData.loading) {
      return <Spin size="small" />;
    }

    return (
      <Collapse 
        size="small"
        onChange={(keys) => {
          keys.forEach(key => {
            const lessonId = parseInt(key as string);
            if (!expandedLessons[lessonId]) {
              fetchVideosForLesson(lessonId);
            }
          });
        }}
      >
        {courseData.lessons.map((lesson) => (
          <Panel 
            key={lesson.id} 
            header={
              <Space>
                <BookOutlined style={{ color: '#722ed1' }} />
                <Text strong>{lesson.name}</Text>
                <Tag color={getDifficultyColor(lesson.difficultyLevel)}>
                  {getDifficultyText(lesson.difficultyLevel)}
                </Tag>
                <Tag color={lesson.isPremium ? 'gold' : 'blue'}>
                  {lesson.isPremium ? 'Premium' : 'Miễn phí'}
                </Tag>
                <Tag color={lesson.isActive ? 'green' : 'red'}>
                  {lesson.isActive ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
              </Space>
            }
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Paragraph>{lesson.description}</Paragraph>
              
              <Space wrap>
                <Space>
                  <UserOutlined />
                  <Text>Độ tuổi: {lesson.minAge}-{lesson.maxAge}</Text>
                </Space>
                <Space>
                  <ClockCircleOutlined />
                  <Text>Thời lượng: {formatDuration(lesson.duration)}</Text>
                </Space>
                <Space>
                  <PlayCircleOutlined />
                  <Text>Số video: {lesson.totalVideo}</Text>
                </Space>
                <Space>
                  <StarOutlined />
                  <Rate disabled defaultValue={lesson.star} />
                  <Text>({lesson.star})</Text>
                </Space>
              </Space>
              
              <Space>
                <Text type="secondary">Thứ tự: {lesson.order}</Text>
                <Text type="secondary">Tạo: {formatDate(lesson.createdAt)}</Text>
                <Text type="secondary">Cập nhật: {formatDate(lesson.updatedAt)}</Text>
              </Space>
              
              {renderVideos(lesson.id)}
            </Space>
          </Panel>
        ))}
      </Collapse>
    );
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a: CourseDTO, b: CourseDTO) => a.id - b.id,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'thumbnailUrl',
      key: 'thumbnailUrl',
      width: 100,
      render: (thumbnailUrl: string, record: CourseDTO) => (
        <Avatar 
          shape="square" 
          size={64} 
          src={thumbnailUrl} 
          icon={<BookOutlined />}
        />
      ),
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: CourseDTO) => (
        <Space direction="vertical" size="small">
          <Text strong>{name}</Text>
          <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0, maxWidth: 300 }}>
            {record.description}
          </Paragraph>
        </Space>
      ),
    },
    {
      title: 'Thông tin',
      key: 'info',
      render: (record: CourseDTO) => (
        <Space direction="vertical" size="small">
          <Space>
            <BookOutlined />
            <Text>{record.totalLesson} bài học</Text>
          </Space>
          <Space>
            <StarOutlined />
            <Rate disabled defaultValue={record.star} />
            <Text>({record.star})</Text>
          </Space>
          <Text strong style={{ color: '#1890ff' }}>
            {formatPrice(record.price)}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (record: CourseDTO) => (
        <Space direction="vertical" size="small">
          <Tag color={record.isPremium ? 'gold' : 'blue'}>
            {record.isPremium ? 'Premium' : 'Miễn phí'}
          </Tag>
          <Tag color={record.isActive ? 'green' : 'red'}>
            {record.isActive ? 'Hoạt động' : 'Không hoạt động'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
      sorter: (a: CourseDTO, b: CourseDTO) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>
            <BookOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            Quản lý khóa học
          </Title>
          <Space>
            <Button type="primary" icon={<BookOutlined />}>
              Thêm khóa học
            </Button>
          </Space>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Search
            placeholder="Tìm kiếm theo tên khóa học, mô tả hoặc ID..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            onChange={(e) => {
              if (!e.target.value) {
                setFilteredCourses(courses);
                setSearchText('');
                setCurrentPage(1);
              }
            }}
            style={{ maxWidth: '400px' }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredCourses.map(course => ({ ...course, key: course.id }))}
          pagination={{
            current: currentPage,
            total: filteredCourses.length,
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khóa học`,
            onChange: (page, size) => {
              setCurrentPage(page);
              if (size !== pageSize) {
                setPageSize(size);
                setCurrentPage(1);
              }
            },
          }}
          scroll={{ x: 1400 }}
          size="middle"
          expandable={{
            expandedRowRender: (record) => renderLessons(record.id),
            onExpand: (expanded, record) => {
              if (expanded && !expandedCourses[record.id]) {
                fetchLessonsForCourse(record.id);
              }
            },
            expandIcon: ({ expanded, onExpand, record }) => (
              <Button
                type="text"
                size="small"
                icon={expanded ? <EyeOutlined /> : <EyeOutlined />}
                onClick={e => onExpand(record, e)}
              >
                {expanded ? 'Thu gọn' : 'Xem bài học'}
              </Button>
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default Courses;