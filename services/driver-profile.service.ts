import { apiClient } from '@/plugin/api-client';
import { DriverProfile } from '@/types/profile';

export interface CreateDriverProfilePayload {
  userId: string;
  driverLicenseSerial: string;
}

export const driverProfileService = {
  async create(payload: CreateDriverProfilePayload): Promise<DriverProfile> {
    const res = await apiClient.instance.post('/driver-profile', payload);
    return res.data.data as DriverProfile;
  },

  async getById(id: string): Promise<DriverProfile> {
    const res = await apiClient.instance.get(`/driver-profile/${id}`);
    return res.data.data as DriverProfile;
  },

  async getAll(): Promise<DriverProfile[]> {
    const res = await apiClient.instance.get('/driver-profile');
    return res.data.data as DriverProfile[];
  },

  async setActiveVehicle(driverId: string, vehicleId: string): Promise<DriverProfile> {
    const res = await apiClient.instance.patch(`/driver-profile/${driverId}/active-vehicle`, {
      vehicleId,
    });
    return res.data.data as DriverProfile;
  },
};
