import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Tag, Space, Spin, message, Collapse, Typography, Avatar, Rate, Badge, Modal, Form, InputNumber, Switch, Upload } from 'antd';
import { SearchOutlined, BookOutlined, PlayCircleOutlined, StarOutlined, ClockCircleOutlined, UserOutlined, EyeOutlined, PlusOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { apiService } from '../../services/api';
import type { CourseDTO, LessonDTO, VideoDTO, CourseRequest, LessonRequest, VideoRequest } from '../../types';

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

  // Modal and form states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseDTO | null>(null);
  const [form] = Form.useForm();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Lesson modal and form states
  const [isLessonModalVisible, setIsLessonModalVisible] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonDTO | null>(null);
  const [currentCourseId, setCurrentCourseId] = useState<number | null>(null);
  const [lessonForm] = Form.useForm();
  const [lessonThumbnailFile, setLessonThumbnailFile] = useState<File | null>(null);
  const [lessonSubmitting, setLessonSubmitting] = useState(false);

  // Video modal and form states
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoDTO | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null);
  const [videoForm] = Form.useForm();
  const [videoThumbnailFile, setVideoThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSubmitting, setVideoSubmitting] = useState(false);

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

  // Modal and form handlers
  const showModal = (course?: CourseDTO) => {
    setEditingCourse(course || null);
    setIsModalVisible(true);
    setThumbnailFile(null);

    if (course) {
      form.setFieldsValue({
        name: course.name,
        description: course.description,
        isPremium: course.isPremium,
        isActive: course.isActive,
        price: course.price,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        isPremium: false,
        isActive: true,
      });
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
    const lesson = courses.flatMap(course => expandedCourses[course.id]?.lessons || []).find(l => l.id === lessonId);

    if (!lessonData) return null;

    if (lessonData.loading) {
      return <Spin size="small" />;
    }

    return (
      <div style={{ marginLeft: 24, marginTop: 8 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>Videos ({lessonData.videos.length})</Title>
          {lesson && (
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => showVideoModal(lesson)}
            >
              Thêm Video
            </Button>
          )}
        </div>
        
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
            extra={
              lesson && (
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => showVideoModal(lesson, video)}
                >
                  Sửa
                </Button>
              )
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
      <div>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong>Danh sách bài học</Text>
          <Button 
            type="primary" 
            size="small" 
            icon={<PlusOutlined />}
            onClick={() => showLessonModal(courseId)}
          >
            Thêm bài học
          </Button>
        </div>
        
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
              extra={
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    showLessonModal(courseId, lesson);
                  }}
                >
                  Sửa
                </Button>
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
      </div>
    );
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCourse(null);
    setThumbnailFile(null);
    form.resetFields();
  };

  const handleSubmit = async (values: CourseRequest) => {
    if (!thumbnailFile && !editingCourse) {
      message.error('Vui lòng chọn ảnh thumbnail');
      return;
    }

    try {
      setSubmitting(true);

      if (editingCourse) {
        // Update existing course
        await apiService.updateCourse(editingCourse.id, values, thumbnailFile || undefined);
        message.success('Cập nhật khóa học thành công');
      } else {
        // Create new course
        await apiService.createCourse(values, thumbnailFile!);
        message.success('Tạo khóa học thành công');
      }

      setIsModalVisible(false);
      setEditingCourse(null);
      setThumbnailFile(null);
      form.resetFields();
      fetchCourses(); // Refresh the list
    } catch (error) {
      console.error('Error saving course:', error);
      message.error(editingCourse ? 'Lỗi khi cập nhật khóa học' : 'Lỗi khi tạo khóa học');
    } finally {
      setSubmitting(false);
    }
  };

  const handleThumbnailChange = (info: any) => {
    if (info.file.status === 'removed') {
      setThumbnailFile(null);
      return;
    }

    const file = info.file.originFileObj || info.file;
    if (file) {
      setThumbnailFile(file);
    }
  };

  // Lesson modal handlers
  const showLessonModal = (courseId: number, lesson?: LessonDTO) => {
    setCurrentCourseId(courseId);
    setEditingLesson(lesson || null);
    setIsLessonModalVisible(true);
    
    if (lesson) {
      lessonForm.setFieldsValue({
        name: lesson.name,
        description: lesson.description,
        order: lesson.order,
        minAge: lesson.minAge,
        maxAge: lesson.maxAge,
        difficultyLevel: lesson.difficultyLevel,
        duration: lesson.duration,
        isPremium: lesson.isPremium,
        isActive: lesson.isActive,
      });
    } else {
      lessonForm.resetFields();
    }
  };

  const handleLessonCancel = () => {
    setIsLessonModalVisible(false);
    setEditingLesson(null);
    setCurrentCourseId(null);
    setLessonThumbnailFile(null);
    lessonForm.resetFields();
  };

  const handleLessonSubmit = async (values: any) => {
    if (!currentCourseId) return;

    setLessonSubmitting(true);
    try {
      const lessonData: LessonRequest = {
        courseId: currentCourseId,
        name: values.name,
        description: values.description,
        order: values.order,
        minAge: values.minAge,
        maxAge: values.maxAge,
        difficultyLevel: values.difficultyLevel,
        duration: values.duration,
        isPremium: values.isPremium || false,
        isActive: values.isActive !== false,
      };

      if (editingLesson) {
        await apiService.updateLesson(editingLesson.id, lessonData, lessonThumbnailFile);
        message.success('Cập nhật bài học thành công!');
      } else {
        await apiService.createLesson(lessonData, lessonThumbnailFile as any);
        message.success('Tạo bài học thành công!');
      }

      handleLessonCancel();
      
      // Refresh both courses list and lessons for the current course
      await fetchCourses();
      await fetchLessonsForCourse(currentCourseId);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setLessonSubmitting(false);
    }
  };

  const handleLessonThumbnailChange = (info: any) => {
    if (info.file.status === 'removed') {
      setLessonThumbnailFile(null);
      return;
    }

    const file = info.file.originFileObj || info.file;
    if (file) {
      setLessonThumbnailFile(file);
    }
  };

  // Video handlers
  const showVideoModal = (lesson: LessonDTO, video?: VideoDTO) => {
    setCurrentLessonId(lesson.id);
    setEditingVideo(video || null);
    setIsVideoModalVisible(true);
    
    if (video) {
      videoForm.setFieldsValue({
        title: video.title,
        order: video.order,
        question: video.videoQuestion.question,
        optionA: video.videoQuestion.optionA,
        optionB: video.videoQuestion.optionB,
        optionC: video.videoQuestion.optionC,
        optionD: video.videoQuestion.optionD,
        answer: video.videoQuestion.answer,
        isActive: video.isActive
      });
    } else {
      videoForm.resetFields();
      videoForm.setFieldsValue({
        lessonId: lesson.id,
        isActive: true
      });
    }
    
    setVideoThumbnailFile(null);
    setVideoFile(null);
  };

  const handleVideoCancel = () => {
    setIsVideoModalVisible(false);
    setEditingVideo(null);
    setCurrentLessonId(null);
    videoForm.resetFields();
    setVideoThumbnailFile(null);
    setVideoFile(null);
  };

  const handleVideoSubmit = async () => {
    try {
      const values = await videoForm.validateFields();
      setVideoSubmitting(true);

      const videoRequest: VideoRequest = {
        lessonId: currentLessonId!,
        title: values.title,
        order: values.order,
        question: values.question,
        optionA: values.optionA,
        optionB: values.optionB,
        optionC: values.optionC,
        optionD: values.optionD,
        answer: values.answer,
        isActive: values.isActive
      };

      if (editingVideo) {
        await apiService.updateVideo(editingVideo.id, videoRequest, videoThumbnailFile, videoFile);
        message.success('Cập nhật video thành công!');
      } else {
        await apiService.createVideo(videoRequest, videoThumbnailFile!, videoFile!);
        message.success('Tạo video thành công!');
      }

      handleVideoCancel();
      
      // Refresh both courses and lessons for the specific course
      await fetchCourses();
      if (currentLessonId) {
        // Refresh videos for the current lesson
        await fetchVideosForLesson(currentLessonId);
        
        // Find the course that contains this lesson to refresh its lessons
        for (const course of courses) {
          if (expandedCourses[course.id]?.lessons.some((lesson: LessonDTO) => lesson.id === currentLessonId)) {
            await fetchLessonsForCourse(course.id);
            break;
          }
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setVideoSubmitting(false);
    }
  };

  const handleVideoThumbnailChange = (info: any) => {
    if (info.file.status === 'removed') {
      setVideoThumbnailFile(null);
      return;
    }

    const file = info.file.originFileObj || info.file;
    if (file) {
      setVideoThumbnailFile(file);
    }
  };

  const handleVideoFileChange = (info: any) => {
    if (info.file.status === 'removed') {
      setVideoFile(null);
      return;
    }

    const file = info.file.originFileObj || info.file;
    if (file) {
      setVideoFile(file);
    }
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
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (record: CourseDTO) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            size="small"
          >
            Sửa
          </Button>
        </Space>
      ),
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
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
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

        <Modal
          title={editingCourse ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
          open={isModalVisible}
          onCancel={handleCancel}
          centered
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Tên khóa học"
              rules={[{ required: true, message: 'Vui lòng nhập tên khóa học' }]}
            >
              <Input placeholder="Nhập tên khóa học" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
            >
              <Input.TextArea rows={4} placeholder="Nhập mô tả khóa học" />
            </Form.Item>

            <Form.Item
              name="price"
              label="Giá (VND)"
              rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                formatter={(value?: string | number) =>
                  value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                }
                parser={(value?: string) => value ? value.replace(/\$\s?|(,*)/g, '') : ''}
                placeholder="Nhập giá khóa học"
              />
            </Form.Item>

            <Form.Item label="Ảnh thumbnail">
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
                onChange={handleThumbnailChange}
                accept="image/*"
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                </div>
              </Upload>
            </Form.Item>

            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Form.Item name="isPremium" valuePropName="checked">
                <Switch checkedChildren="Premium" unCheckedChildren="Miễn phí" />
              </Form.Item>

              <Form.Item name="isActive" valuePropName="checked">
                <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
              </Form.Item>
            </Space>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={handleCancel}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  {editingCourse ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Lesson Modal */}
        <Modal
          title={editingLesson ? 'Sửa bài học' : 'Thêm bài học mới'}
          centered
          open={isLessonModalVisible}
          onCancel={handleLessonCancel}
          footer={null}
          width={800}
        >
          <Form
            form={lessonForm}
            layout="vertical"
            onFinish={handleLessonSubmit}
          >
            <Form.Item
              name="name"
              label="Tên bài học"
              rules={[{ required: true, message: 'Vui lòng nhập tên bài học!' }]}
            >
              <Input placeholder="Nhập tên bài học" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
            >
              <Input.TextArea rows={4} placeholder="Nhập mô tả bài học" />
            </Form.Item>

            <Space style={{ width: '100%' }} size="large">
              <Form.Item
                name="order"
                label="Thứ tự"
                rules={[{ required: true, message: 'Vui lòng nhập thứ tự!' }]}
              >
                <InputNumber min={1} placeholder="Thứ tự bài học" />
              </Form.Item>

              <Form.Item
                name="minAge"
                label="Độ tuổi tối thiểu"
                rules={[{ required: true, message: 'Vui lòng nhập độ tuổi tối thiểu!' }]}
              >
                <InputNumber min={0} placeholder="Độ tuổi tối thiểu" />
              </Form.Item>

              <Form.Item
                name="maxAge"
                label="Độ tuổi tối đa"
                rules={[{ required: true, message: 'Vui lòng nhập độ tuổi tối đa!' }]}
              >
                <InputNumber min={0} placeholder="Độ tuổi tối đa" />
              </Form.Item>
            </Space>

            <Space style={{ width: '100%' }} size="large">
              <Form.Item
                name="difficultyLevel"
                label="Độ khó"
                rules={[{ required: true, message: 'Vui lòng nhập độ khó!' }]}
              >
                <InputNumber min={1} max={5} placeholder="Độ khó (1-5)" />
              </Form.Item>

              <Form.Item
                name="duration"
                label="Thời lượng (phút)"
                rules={[{ required: true, message: 'Vui lòng nhập thời lượng!' }]}
              >
                <InputNumber min={1} placeholder="Thời lượng" />
              </Form.Item>
            </Space>

            <Space style={{ width: '100%' }} size="large">
              <Form.Item
                name="isPremium"
                label="Premium"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="isActive"
                label="Kích hoạt"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </Space>

            <Form.Item label="Thumbnail">
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
                onChange={handleLessonThumbnailChange}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={handleLessonCancel}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={lessonSubmitting}>
                  {editingLesson ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Video Modal */}
        <Modal
          title={editingVideo ? 'Sửa video câu hỏi' : 'Thêm video câu hỏi mới'}
          centered
          open={isVideoModalVisible}
          onCancel={handleVideoCancel}
          footer={null}
          width={900}
        >
          <Form
            form={videoForm}
            layout="vertical"
            onFinish={handleVideoSubmit}
          >
            <Form.Item
              name="title"
              label="Tiêu đề video"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề video!' }]}
            >
              <Input placeholder="Nhập tiêu đề video" />
            </Form.Item>

            <Form.Item
              name="order"
              label="Thứ tự"
              rules={[{ required: true, message: 'Vui lòng nhập thứ tự!' }]}
            >
              <InputNumber min={1} placeholder="Thứ tự video" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="question"
              label="Câu hỏi"
              rules={[{ required: true, message: 'Vui lòng nhập câu hỏi!' }]}
            >
              <Input.TextArea rows={3} placeholder="Nhập câu hỏi" />
            </Form.Item>

            <Space style={{ width: '100%' }} size="large">
              <Form.Item
                name="optionA"
                label="Đáp án A"
                rules={[{ required: true, message: 'Vui lòng nhập đáp án A!' }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="Nhập đáp án A" />
              </Form.Item>

              <Form.Item
                name="optionB"
                label="Đáp án B"
                rules={[{ required: true, message: 'Vui lòng nhập đáp án B!' }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="Nhập đáp án B" />
              </Form.Item>
            </Space>

            <Space style={{ width: '100%' }} size="large">
              <Form.Item
                name="optionC"
                label="Đáp án C"
                rules={[{ required: true, message: 'Vui lòng nhập đáp án C!' }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="Nhập đáp án C" />
              </Form.Item>

              <Form.Item
                name="optionD"
                label="Đáp án D"
                rules={[{ required: true, message: 'Vui lòng nhập đáp án D!' }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="Nhập đáp án D" />
              </Form.Item>
            </Space>

            <Space style={{ width: '100%' }} size="large">
              <Form.Item
                name="answer"
                label="Đáp án đúng"
                rules={[
                  { required: true, message: 'Vui lòng chọn đáp án đúng!' },
                  { pattern: /^[ABCD]$/, message: 'Đáp án chỉ được phép là A, B, C hoặc D!' }
                ]}
              >
                <Input placeholder="A, B, C hoặc D" maxLength={1} style={{ width: 120 }} />
              </Form.Item>

              <Form.Item
                name="isActive"
                label="Kích hoạt"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </Space>

            <Form.Item label="Thumbnail video" required={!editingVideo}>
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
                onChange={handleVideoThumbnailChange}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload Thumbnail</div>
                </div>
              </Upload>
              {!editingVideo && <div style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>Bắt buộc khi tạo video mới</div>}
            </Form.Item>

            <Form.Item label="File video" required={!editingVideo}>
              <Upload
                listType="text"
                maxCount={1}
                beforeUpload={() => false}
                onChange={handleVideoFileChange}
                accept="video/*"
              >
                <Button icon={<UploadOutlined />}>Upload Video</Button>
              </Upload>
              {!editingVideo && <div style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>Bắt buộc khi tạo video mới</div>}
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={handleVideoCancel}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={videoSubmitting}>
                  {editingVideo ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default Courses;