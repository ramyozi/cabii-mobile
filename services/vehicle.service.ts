import { apiClient } from '@/plugin/api-client';
import { Vehicle } from '@/types/vehicle';

export interface CreateVehiclePayload {
  brand: string;
  model: string;
  plate: string;
  color: string;
  chassisNumber: string;
  year?: number;
  categoryId: string;
  driverId: string;
}

export const vehicleService = {
  async create(payload: CreateVehiclePayload): Promise<Vehicle> {
    const res = await apiClient.instance.post('/vehicle', payload);
    return res.data.data as Vehicle;
  },

  async getById(id: string): Promise<Vehicle> {
    const res = await apiClient.instance.get(`/vehicle/${id}`);
    return res.data.data as Vehicle;
  },

  async getAll(): Promise<Vehicle[]> {
    const res = await apiClient.instance.get('/vehicle');
    return res.data.data as Vehicle[];
  },

  async getAccessibilityFeatures(vehicleId: string): Promise<any[]> {
    const res = await apiClient.instance.get(`/vehicle/${vehicleId}/accessibility-features`);
    return res.data.data;
  },
};
