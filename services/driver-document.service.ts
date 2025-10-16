import { apiClient } from '@/plugin/api-client';
import {
  BackendApiRoutes,
  DriverDocumentCreateRequestDto,
  DriverDocumentResponseDto,
  DriverDocumentListResponseDto,
} from '@ramyozi/cabii-shared';

export const driverDocumentService = {
  async upload(payload: DriverDocumentCreateRequestDto): Promise<DriverDocumentResponseDto> {
    // Map DTO -> FormData (nécessaire pour upload fichier côté mobile)
    const form = new FormData();
    form.append('driverId', payload.driverId);
    form.append('documentType', payload.documentType);
    if (payload.expiryDate) form.append('expiryDate', payload.expiryDate);
    // @ts-expect-error: RN/Expo file type
    form.append('file', payload.file);

    const response = await apiClient.instance.post<DriverDocumentResponseDto>(
      BackendApiRoutes.driverDocument.root.path,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    if (response.status !== 201 && response.status !== 200)
      throw new Error(response.data?.message ?? 'Upload failed');
    return response.data;
  },

  async approve(documentId: string): Promise<DriverDocumentResponseDto> {
    const response = await apiClient.instance.patch<DriverDocumentResponseDto>(
      BackendApiRoutes.driverDocument.approve.path.replace('{documentId}', documentId),
    );
    if (response.status !== 200) throw new Error(response.data?.message ?? 'Approve failed');
    return response.data;
  },

  async deny(documentId: string): Promise<DriverDocumentResponseDto> {
    const response = await apiClient.instance.patch<DriverDocumentResponseDto>(
      BackendApiRoutes.driverDocument.deny.path.replace('{documentId}', documentId),
    );
    if (response.status !== 200) throw new Error(response.data?.message ?? 'Deny failed');
    return response.data;
  },

  async getByDriver(driverId: string): Promise<DriverDocumentListResponseDto> {
    const response = await apiClient.instance.get<DriverDocumentListResponseDto>(
      BackendApiRoutes.driverDocument.driverProfile.path.replace('{driverId}', driverId),
    );
    if (response.status !== 200)
      throw new Error(response.data?.message ?? 'Failed to fetch driver documents');
    return response.data;
  },

  async getById(documentId: string): Promise<DriverDocumentResponseDto> {
    const response = await apiClient.instance.get<DriverDocumentResponseDto>(
      BackendApiRoutes.driverDocument.byDocumentId.path.replace('{documentId}', documentId),
    );
    if (response.status !== 200)
      throw new Error(response.data?.message ?? 'Failed to fetch driver document');
    return response.data;
  },
};
