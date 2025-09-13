import axios, { AxiosInstance, AxiosError } from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface AuthTokens {
  access: string;
  refresh: string;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

interface BillItem {
  id: string;
  name: string;
  price: number;
  assigned_to: string[];
}

interface Bill {
  id: string;
  title: string;
  description?: string;
  total_amount: number;
  image?: string;
  items: BillItem[];
  participants: User[];
  created_at: string;
  updated_at: string;
  status: 'processing' | 'split' | 'paid' | 'partial';
  created_by: string;
}

interface Payment {
  id: string;
  bill: string;
  user: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  due_date: string;
  paid_at?: string;
  payment_method?: string;
  transaction_id?: string;
}

class APIService {
  private api: AxiosInstance;
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load tokens from localStorage
    this.token = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');

    if (this.token) {
      this.setAuthHeader(this.token);
    }

    // Request interceptor to add auth header
    this.api.interceptors.request.use(
      (config) => {
        if (this.token && config.headers) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            this.logout();
            toast.error('Session expired. Please log in again.');
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private setAuthHeader(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshToken) return null;

    try {
      const response = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
        refresh: this.refreshToken,
      });

      const { access } = response.data;
      this.token = access;
      localStorage.setItem('access_token', access);
      this.setAuthHeader(access);

      return access;
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.token = null;
      this.refreshToken = null;
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const response = await this.api.post('/auth/login/', credentials);
      const { user, access, refresh } = response.data;

      this.token = access;
      this.refreshToken = refresh;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      this.setAuthHeader(access);

      return { user, tokens: { access, refresh } };
    } catch (error) {
      this.handleError(error, 'Login failed');
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const response = await this.api.post('/auth/register/', userData);
      const { user, access, refresh } = response.data;

      this.token = access;
      this.refreshToken = refresh;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      this.setAuthHeader(access);

      return { user, tokens: { access, refresh } };
    } catch (error) {
      this.handleError(error, 'Registration failed');
      throw error;
    }
  }

  logout() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete this.api.defaults.headers.common['Authorization'];
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.api.get('/auth/user/');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get user info');
      throw error;
    }
  }

  // Bills methods
  async getBills(): Promise<Bill[]> {
    try {
      const response = await this.api.get('/bills/');
      return response.data.results || response.data;
    } catch (error) {
      this.handleError(error, 'Failed to load bills');
      throw error;
    }
  }

  async getBill(id: string): Promise<Bill> {
    try {
      const response = await this.api.get(`/bills/${id}/`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to load bill');
      throw error;
    }
  }

  async createBill(billData: Partial<Bill>): Promise<Bill> {
    try {
      const response = await this.api.post('/bills/', billData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create bill');
      throw error;
    }
  }

  async updateBill(id: string, billData: Partial<Bill>): Promise<Bill> {
    try {
      const response = await this.api.patch(`/bills/${id}/`, billData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to update bill');
      throw error;
    }
  }

  async deleteBill(id: string): Promise<void> {
    try {
      await this.api.delete(`/bills/${id}/`);
    } catch (error) {
      this.handleError(error, 'Failed to delete bill');
      throw error;
    }
  }

  // Receipt processing
  async uploadReceipt(file: File): Promise<Bill> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await this.api.post('/bills/process-receipt/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to process receipt');
      throw error;
    }
  }

  // Payments methods
  async getPayments(): Promise<Payment[]> {
    try {
      const response = await this.api.get('/payments/');
      return response.data.results || response.data;
    } catch (error) {
      this.handleError(error, 'Failed to load payments');
      throw error;
    }
  }

  async getPayment(id: string): Promise<Payment> {
    try {
      const response = await this.api.get(`/payments/${id}/`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to load payment');
      throw error;
    }
  }

  async initiatePayment(paymentId: string): Promise<{ payment_url: string }> {
    try {
      const response = await this.api.post(`/payments/${paymentId}/initiate/`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to initiate payment');
      throw error;
    }
  }

  async confirmPayment(paymentId: string, transactionData: any): Promise<Payment> {
    try {
      const response = await this.api.post(`/payments/${paymentId}/confirm/`, transactionData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to confirm payment');
      throw error;
    }
  }

  // Notifications methods
  async getNotifications(): Promise<any[]> {
    try {
      const response = await this.api.get('/notifications/');
      return response.data.results || response.data;
    } catch (error) {
      this.handleError(error, 'Failed to load notifications');
      throw error;
    }
  }

  async markNotificationAsRead(id: string): Promise<void> {
    try {
      await this.api.patch(`/notifications/${id}/`, { is_read: true });
    } catch (error) {
      this.handleError(error, 'Failed to mark notification as read');
      throw error;
    }
  }

  // Utility methods
  private handleError(error: any, defaultMessage: string) {
    let message = defaultMessage;

    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.response?.data?.detail) {
      message = error.response.data.detail;
    } else if (error.response?.data?.non_field_errors) {
      message = error.response.data.non_field_errors[0];
    } else if (error.message) {
      message = error.message;
    }

    toast.error(message);
    console.error('API Error:', error);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiService = new APIService();
export default apiService;
