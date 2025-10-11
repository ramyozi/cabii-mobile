import { User } from './user';

export interface CustomerProfile {
  id: string;
  user: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface DriverProfile {
  id: string;
  user: User;
  driverLicenseSerial: string;
  isAvailable: boolean;
  ratingAvg?: number;
  totalRatings?: number;
  activeVehicleId?: string;
  createdAt?: string;
  updatedAt?: string;
}
