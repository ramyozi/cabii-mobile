export enum ActiveRoleEnum {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  DRIVER = 'driver',
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  role?: string;
  activeRole?: ActiveRoleEnum;
  createdAt?: string;
  updatedAt?: string;
}
