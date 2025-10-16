import { apiClient } from '@/plugin/api-client';
import {
  BackendApiRoutes,
  VehicleCreateRequestDto,
  VehicleResponseDto,
  VehicleListResponseDto,
  AccessibilityFeatureListResponseDto,
} from '@cabii/shared';

export const vehicleService = {
  async create(payload: VehicleCreateRequestDto): Promise<VehicleResponseDto> {
    const response = await apiClient.instance.post<VehicleResponseDto>(
      BackendApiRoutes.vehicle.root.path,
      payload,
    );
    if (response.status !== 201)
      throw new Error(response.data?.message ?? 'Vehicle creation failed');
    return response.data;
  },

  async getById(id: string): Promise<VehicleResponseDto> {
    const response = await apiClient.instance.get<VehicleResponseDto>(
      BackendApiRoutes.vehicle.byVehicleId.path.replace('{id}', id),
    );
    if (response.status !== 200)
      throw new Error(response.data?.message ?? 'Failed to fetch vehicle');
    return response.data;
  },

  async getAll(): Promise<VehicleListResponseDto> {
    const response = await apiClient.instance.get<VehicleListResponseDto>(
      BackendApiRoutes.vehicle.root.path,
    );
    if (response.status !== 200)
      throw new Error(response.data?.message ?? 'Failed to fetch vehicles');
    return response.data;
  },

  async getAccessibilityFeatures(vehicleId: string): Promise<AccessibilityFeatureListResponseDto> {
    const response = await apiClient.instance.get<AccessibilityFeatureListResponseDto>(
      BackendApiRoutes.vehicle.accessibilityFeatures.path.replace('{vehicleId}', vehicleId),
    );
    if (response.status !== 200)
      throw new Error(response.data?.message ?? 'Failed to fetch features');
    return response.data;
  },
};
