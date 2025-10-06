import type { ApiResponse, AdminStatDTO, TokenExchangeResponse, LoginRequest, AccountDTO } from '../types';

const API_BASE_URL = 'http://localhost:8081';

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
}

export const apiService = new ApiService();
export default apiService;