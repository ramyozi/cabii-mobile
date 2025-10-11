import { apiClient } from '@/plugin/api-client';
import { CustomerProfile } from '@/types/profile';

export const customerProfileService = {
  async create(payload: { userId: string }): Promise<CustomerProfile> {
    const res = await apiClient.instance.post('/customer-profile', payload);
    return res.data.data as CustomerProfile;
  },

  async getById(id: string): Promise<CustomerProfile> {
    const res = await apiClient.instance.get(`/customer-profile/${id}`);
    return res.data.data as CustomerProfile;
  },

  async getAll(): Promise<CustomerProfile[]> {
    const res = await apiClient.instance.get('/customer-profile');
    return res.data.data as CustomerProfile[];
  },
};
