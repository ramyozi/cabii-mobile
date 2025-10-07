import { apiClient } from '@/plugin/api-client';
import { User } from '@/types';

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  activeRole: string;
}

export interface RegisterPayload {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
}

export const userService = {
  async login(payload: LoginPayload): Promise<SignInResponse> {
    const res = await apiClient.instance.post('/auth/sign-in', payload);
    return res.data.data as SignInResponse;
  },

  async refreshToken(refreshToken: string): Promise<SignInResponse> {
    const res = await apiClient.instance.post('/auth/refresh', { refreshToken });
    return res.data.data as SignInResponse;
  },

  async register(payload: RegisterPayload): Promise<User> {
    const res = await apiClient.instance.post('/user', payload);
    return res.data.data as User;
  },

  async getMe(): Promise<User> {
    const res = await apiClient.instance.get('/user/me');
    return res.data.data as User;
  },

  async checkEmail(email: string): Promise<{ isAvailable: boolean }> {
    const res = await apiClient.instance.get('/user/check-email', { data: { email } });
    return res.data.data;
  },

  async checkPhone(phone: string): Promise<{ isAvailable: boolean }> {
    const res = await apiClient.instance.get('/user/check-phone', { data: { phone } });
    return res.data.data;
  },
};
