import { RoleEnum } from '@/plugin/auth-provider/auth-state';

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password?: string;
  role?: RoleEnum;
  isActive?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
