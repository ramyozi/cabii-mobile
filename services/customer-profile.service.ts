import { apiClient } from '@/plugin/api-client';
import {
  BackendApiRoutes,
  CustomerProfileCreateRequestDto,
  CustomerProfileResponseDto,
  CustomerProfileListResponseDto,
} from '@ramyozi/cabii-shared';

export const customerProfileService = {
  async create(payload: CustomerProfileCreateRequestDto): Promise<CustomerProfileResponseDto> {
    const response = await apiClient.instance.post<CustomerProfileResponseDto>(
      BackendApiRoutes.customerProfile.root.path,
      payload,
    );
    if (response.status !== 201)
      throw new Error(response.data?.message ?? 'Customer profile creation failed');
    return response.data;
  },

  async getById(customerProfileId: string): Promise<CustomerProfileResponseDto> {
    const response = await apiClient.instance.get<CustomerProfileResponseDto>(
      BackendApiRoutes.customerProfile.byCustomerId.path.replace(
        '{customerProfileId}',
        customerProfileId,
      ),
    );
    if (response.status !== 200)
      throw new Error(response.data?.message ?? 'Failed to fetch customer profile');
    return response.data;
  },

  async getAll(): Promise<CustomerProfileListResponseDto> {
    const response = await apiClient.instance.get<CustomerProfileListResponseDto>(
      BackendApiRoutes.customerProfile.root.path,
    );
    if (response.status !== 200)
      throw new Error(response.data?.message ?? 'Failed to fetch customer profiles');
    return response.data;
  },
};
