import { apiClient } from '@/plugin/api-client';

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
}

export async function signInRequest(email: string, password: string): Promise<SignInResponse> {
  const res = await apiClient.instance.post('/auth/sign-in', { email, password });
  return res.data.data as SignInResponse;
}

export async function refreshTokenRequest(refreshToken: string) {
  const res = await apiClient.instance.post('/auth/refresh', { refreshToken });
  return res.data.data as SignInResponse;
}
