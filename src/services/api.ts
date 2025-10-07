import type { ApiResponse, AdminStatDTO, TokenExchangeResponse, LoginRequest, AccountDTO, CourseDTO, LessonDTO, VideoDTO, CourseRequest, LessonRequest, VideoRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('access_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Public request method without authentication
  private async requestPublic<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          // Only add Content-Type if not FormData (for file uploads)
          ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Public API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<ApiResponse<TokenExchangeResponse>> {
    return this.request<TokenExchangeResponse>('/api/login/exchange', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Existing methods
  async getAdminStatistics(year: number = 2025): Promise<ApiResponse<AdminStatDTO>> {
    return this.request<AdminStatDTO>(`/statistics/admin?year=${year}`);
  }

  // User management methods
  async getUserList(): Promise<ApiResponse<AccountDTO[]>> {
    return this.request<AccountDTO[]>('/api/all');
  }

  // Course management methods (public - no authentication required)
  async getCourseList(): Promise<ApiResponse<CourseDTO[]>> {
    return this.requestPublic<CourseDTO[]>('/courses');
  }

  async getCourseById(courseId: number): Promise<ApiResponse<CourseDTO>> {
    return this.requestPublic<CourseDTO>(`/courses/${courseId}`);
  }

  async getLessonList(): Promise<ApiResponse<LessonDTO[]>> {
    return this.requestPublic<LessonDTO[]>('/lessons');
  }

  async getLessonById(lessonId: number): Promise<ApiResponse<LessonDTO>> {
    return this.requestPublic<LessonDTO>(`/lessons/${lessonId}`);
  }

  async getLessonsByCourseId(courseId: number): Promise<ApiResponse<LessonDTO[]>> {
    return this.requestPublic<LessonDTO[]>(`/lessons/courses/${courseId}`);
  }

  async getVideosByLessonId(lessonId: number): Promise<ApiResponse<VideoDTO[]>> {
    return this.requestPublic<VideoDTO[]>(`/videos?lessonId=${lessonId}`);
  }

  async createCourse(courseRequest: CourseRequest, thumbnail: File): Promise<ApiResponse<CourseDTO>> {
    const formData = new FormData();
    
    // Add course request as JSON blob
    formData.append('request', new Blob([JSON.stringify(courseRequest)], {
      type: 'application/json'
    }));
    
    // Add thumbnail file
    formData.append('thumbnail', thumbnail);

    return this.requestPublic<CourseDTO>('/courses', {
      method: 'POST',
      body: formData,
      headers: {} // Don't set Content-Type, let browser set it for FormData
    });
  }

  async updateCourse(courseId: number, courseRequest: CourseRequest, thumbnail?: File): Promise<ApiResponse<CourseDTO>> {
    const formData = new FormData();
    
    // Add course request as JSON blob
    formData.append('request', new Blob([JSON.stringify(courseRequest)], {
      type: 'application/json'
    }));
    
    // Add thumbnail file if provided
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    return this.requestPublic<CourseDTO>(`/courses/${courseId}`, {
      method: 'PATCH',
      body: formData,
      headers: {} // Don't set Content-Type, let browser set it for FormData
    });
  }

  async createLesson(lessonRequest: LessonRequest, thumbnail: File): Promise<ApiResponse<LessonDTO>> {
    const formData = new FormData();
    
    // Add lesson request as JSON blob
    formData.append('request', new Blob([JSON.stringify(lessonRequest)], {
      type: 'application/json'
    }));
    
    // Add thumbnail file
    formData.append('thumbnail', thumbnail);

    return this.requestPublic<LessonDTO>('/lessons', {
      method: 'POST',
      body: formData,
      headers: {} // Don't set Content-Type, let browser set it for FormData
    });
  }

  async updateLesson(lessonId: number, lessonRequest: LessonRequest, thumbnail?: File | null): Promise<ApiResponse<LessonDTO>> {
    const formData = new FormData();
    
    // Add lesson request as JSON blob
    formData.append('request', new Blob([JSON.stringify(lessonRequest)], {
      type: 'application/json'
    }));
    
    // Add thumbnail file if provided
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    return this.requestPublic<LessonDTO>(`/lessons/${lessonId}`, {
      method: 'PATCH',
      body: formData,
      headers: {} // Don't set Content-Type, let browser set it for FormData
    });
  }

  // Video API methods
  async createVideo(videoRequest: VideoRequest, thumbnail: File, video: File): Promise<ApiResponse<VideoDTO>> {
    const formData = new FormData();
    
    // Add video request data
    formData.append('request', new Blob([JSON.stringify(videoRequest)], {
      type: 'application/json'
    }));
    
    // Add thumbnail file
    formData.append('thumbnail', thumbnail);
    
    // Add video file
    formData.append('video', video);

    return this.requestPublic<VideoDTO>('/videos', {
      method: 'POST',
      body: formData,
      headers: {} // Don't set Content-Type, let browser set it for FormData
    });
  }

  async updateVideo(videoId: number, videoRequest: VideoRequest, thumbnail?: File | null, video?: File | null): Promise<ApiResponse<VideoDTO>> {
    const formData = new FormData();
    
    // Add video request data
    formData.append('request', new Blob([JSON.stringify(videoRequest)], {
      type: 'application/json'
    }));
    
    // Add thumbnail file if provided
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }
    
    // Add video file if provided
    if (video) {
      formData.append('video', video);
    }

    return this.requestPublic<VideoDTO>(`/videos/${videoId}`, {
      method: 'PATCH',
      body: formData,
      headers: {} // Don't set Content-Type, let browser set it for FormData
    });
  }
}

export const apiService = new ApiService();
export default apiService;