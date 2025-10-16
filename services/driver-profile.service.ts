import { apiClient } from '@/plugin/api-client';
import {
  BackendApiRoutes,
  DriverProfileCreateRequestDto,
  DriverProfileResponseDto,
  DriverProfileListResponseDto,
  SetActiveVehicleRequestDto,
} from '@cabii/shared';

export const driverProfileService = {
  async create(payload: DriverProfileCreateRequestDto): Promise<DriverProfileResponseDto> {
    const response = await apiClient.instance.post<DriverProfileResponseDto>(
      BackendApiRoutes.driverProfile.root.path,
      payload,
    );
    if (response.status !== 201)
      throw new Error(response.data?.message ?? 'Driver profile creation failed');
    return response.data;
  },

  async getById(driverProfileId: string): Promise<DriverProfileResponseDto> {
    const response = await apiClient.instance.get<DriverProfileResponseDto>(
      BackendApiRoutes.driverProfile.byDriverId.path.replace('{driverProfileId}', driverProfileId),
    );
    if (response.status !== 200)
      throw new Error(response.data?.message ?? 'Failed to fetch driver profile');
    return response.data;
  },

  async getAll(): Promise<DriverProfileListResponseDto> {
    const response = await apiClient.instance.get<DriverProfileListResponseDto>(
      BackendApiRoutes.driverProfile.root.path,
    );
    if (response.status !== 200)
      throw new Error(response.data?.message ?? 'Failed to fetch driver profiles');
    return response.data;
  },

  async setActiveVehicle(
    driverId: string,
    payload: SetActiveVehicleRequestDto,
  ): Promise<DriverProfileResponseDto> {
    const response = await apiClient.instance.patch<DriverProfileResponseDto>(
      BackendApiRoutes.driverProfile.activeVehicle.path.replace('{driverId}', driverId),
      payload,
    );
    if (response.status !== 200)
      throw new Error(response.data?.message ?? 'Failed to set active vehicle');
    return response.data;
  },
};
