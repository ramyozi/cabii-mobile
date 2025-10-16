import {
  BackendApiRoutes,
  RefreshAuthRequestDto,
  SignInRequestDto,
  SwitchRoleDto,
  AuthTokenResponseDto,
  BaseResponseDto,
} from '@ramyozi/cabii-shared';
import { apiClient } from '@/plugin/api-client';

export const signInRequest = async (payload: SignInRequestDto): Promise<AuthTokenResponseDto> => {
  const { path } = BackendApiRoutes.auth.signIn;
  const response = await apiClient.instance.post<AuthTokenResponseDto>(path, payload);

  if (response.status !== 200) {
    throw new Error(response.data?.message ?? 'Sign-in failed');
  }

  return response.data;
};

export const refreshTokenRequest = async (
  payload: RefreshAuthRequestDto,
): Promise<AuthTokenResponseDto> => {
  const { path } = BackendApiRoutes.auth.refresh;
  const response = await apiClient.instance.post<AuthTokenResponseDto>(path, payload);

  if (response.status !== 200) {
    throw new Error(response.data?.message ?? 'Refresh failed');
  }

  return response.data;
};

export const switchRoleRequest = async (payload: SwitchRoleDto): Promise<AuthTokenResponseDto> => {
  const { path } = BackendApiRoutes.auth.switchRole;
  const response = await apiClient.instance.post<AuthTokenResponseDto>(path, payload);

  if (response.status !== 200) {
    throw new Error(response.data?.message ?? 'Switch role failed');
  }

  return response.data;
};

export const signOutRequest = async (): Promise<void> => {
  const { path } = BackendApiRoutes.auth.signOut;
  const response = await apiClient.instance.post<BaseResponseDto>(path);

  if (response.status !== 200) {
    throw new Error(response.data?.message ?? 'Sign-out failed');
  }
};
