import { apiClient } from '@/plugin/api-client';
import { DriverDocument } from '@/types/document';

export interface CreateDriverDocumentPayload {
  driverId: string;
  documentType: string;
  expiryDate?: string;
  file: any; // TODO: rien pour l'instant
}

export const driverDocumentService = {
  async upload(payload: CreateDriverDocumentPayload): Promise<DriverDocument> {
    const formData = new FormData();
    formData.append('driverId', payload.driverId);
    formData.append('documentType', payload.documentType);
    if (payload.expiryDate) formData.append('expiryDate', payload.expiryDate);
    formData.append('file', payload.file);

    const res = await apiClient.instance.post('/driver-document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data as DriverDocument;
  },

  async approve(documentId: string): Promise<DriverDocument> {
    const res = await apiClient.instance.patch(`/driver-document/approve/${documentId}`);
    return res.data.data as DriverDocument;
  },

  async deny(documentId: string): Promise<DriverDocument> {
    const res = await apiClient.instance.patch(`/driver-document/deny/${documentId}`);
    return res.data.data as DriverDocument;
  },

  async getByDriver(driverId: string): Promise<DriverDocument[]> {
    const res = await apiClient.instance.get(`/driver-document/driver-profile/${driverId}`);
    return res.data.data as DriverDocument[];
  },

  async getById(documentId: string): Promise<DriverDocument> {
    const res = await apiClient.instance.get(`/driver-document/${documentId}`);
    return res.data.data as DriverDocument;
  },
};
