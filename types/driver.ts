import type { Vehicle } from './vehicle';
import { DriverDocument } from '@/types/document';

export interface DriverProfile {
  id: string;
  userId: string;
  isAvailable: boolean;
  driverLicenseSerial: string;
  ratingAvg: number;
  totalRatings: number;
  currentLat?: number | null;
  currentLng?: number | null;
  lastSeenAt?: string | null;
  activeVehicleId?: string | null;
  documents?: DriverDocument[];
  vehicles?: Vehicle[];
  createdAt?: string;
  updatedAt?: string;
}
