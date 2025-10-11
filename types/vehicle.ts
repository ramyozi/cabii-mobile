import { DriverProfile } from './profile';

export enum VehicleStatusEnum {
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  plate: string;
  color: string;
  chassisNumber: string;
  year?: number;
  status: VehicleStatusEnum;
  insuranceExpiryDate?: string;
  insuranceFileUrl?: string;
  categoryId: string;
  driver: DriverProfile;
  createdAt?: string;
  updatedAt?: string;
}
