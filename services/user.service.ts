import { apiClient } from '@/plugin/api-client';
import {
  BackendApiRoutes,
  UserCreateRequestDto,
  UserResponseDto,
  UserListResponseDto,
  AccessibilityFeatureListResponseDto,
  PhoneAvailabilityCheckResponseDto,
  EmailAvailabilityCheckResponseDto,
} from '@ramyozi/cabii-shared';

export const userService = {
  async getMe(): Promise<UserResponseDto> {
    const response = await apiClient.instance.get<UserResponseDto>(BackendApiRoutes.user.me.path);

    if (response.status !== 200) {
      throw new Error(response.data?.message ?? 'Failed to fetch current user');
    }

    return response.data;
  },

  async getAll(): Promise<UserListResponseDto> {
    const response = await apiClient.instance.get<UserListResponseDto>(
      BackendApiRoutes.user.root.path,
    );

    if (response.status !== 200) {
      throw new Error(response.data?.message ?? 'Failed to fetch users');
    }

    return response.data;
  },

  async getById(userId: string): Promise<UserResponseDto> {
    const response = await apiClient.instance.get<UserResponseDto>(
      BackendApiRoutes.user.byUserId.path.replace('{userId}', userId),
    );

    if (response.status !== 200) {
      throw new Error(response.data?.message ?? 'Failed to fetch user');
    }

    return response.data;
  },

  async create(dto: UserCreateRequestDto): Promise<UserResponseDto> {
    const response = await apiClient.instance.post<UserResponseDto>(
      BackendApiRoutes.user.root.path,
      dto,
    );

    if (response.status !== 201) {
      throw new Error(response.data?.message ?? 'User creation failed');
    }

    return response.data;
  },

  async checkEmailAvailability(email: string): Promise<EmailAvailabilityCheckResponseDto> {
    const response = await apiClient.instance.get<EmailAvailabilityCheckResponseDto>(
      BackendApiRoutes.user.checkEmail.path,
      {
        params: { email },
      },
    );

    if (response.status !== 200) {
      throw new Error(response.data?.message ?? 'Email check failed');
    }

    return response.data;
  },

  async checkPhoneAvailability(phone: string): Promise<PhoneAvailabilityCheckResponseDto> {
    const response = await apiClient.instance.get<PhoneAvailabilityCheckResponseDto>(
      BackendApiRoutes.user.checkPhone.path,
      {
        params: { phone },
      },
    );

    if (response.status !== 200) {
      throw new Error(response.data?.message ?? 'Phone check failed');
    }

    return response.data;
  },

  async getAccessibilityFeatures(userId: string): Promise<AccessibilityFeatureListResponseDto> {
    const response = await apiClient.instance.get<AccessibilityFeatureListResponseDto>(
      BackendApiRoutes.user.accessibilityFeatures.path.replace('{userId}', userId),
    );

    if (response.status !== 200) {
      throw new Error(response.data?.message ?? 'Failed to fetch accessibility features');
    }

    return response.data;
  },
};
