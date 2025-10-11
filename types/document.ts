import { DriverProfile } from './profile';

export enum DriverDocumentStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
}

export enum DriverDocumentTypeEnum {
  DRIVER_LICENSE = 'DRIVER_LICENSE',
  VEHICLE_REGISTRATION = 'VEHICLE_REGISTRATION',
  INSURANCE = 'INSURANCE',
  ID_CARD = 'ID_CARD',
  MEDICAL_CLEARANCE = 'MEDICAL_CLEARANCE',
}

export interface DriverDocument {
  id: string;
  type: DriverDocumentTypeEnum;
  fileUrl: string;
  status: DriverDocumentStatusEnum;
  expiryDate?: string;
  driver: DriverProfile;
  createdAt?: string;
  updatedAt?: string;
}
