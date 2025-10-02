import { apiClient } from '@/plugin/api-client';

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
}

export async function signIn(email: string, password: string) {
  const res = await apiClient.instance.post('/auth/sign-in', { email, password });
  return res.data.data as SignInResponse;
}

export async function refreshToken(refreshToken: string) {
  const res = await apiClient.instance.post('/auth/refresh', { refreshToken });
  return res.data.data as SignInResponse;
}
