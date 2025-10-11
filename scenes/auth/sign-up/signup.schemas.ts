import { z } from 'zod';
import { createFormValidator } from '@/utils/formValidator';
import { ActiveRoleEnum } from '@/plugin/auth-provider/auth-state';
import { DriverDocumentTypeEnum } from '@/types/document';

const v = createFormValidator();

export const schemaCommon = z.object({
  firstname: v.stringValidation({ min: 1 }),
  lastname: v.stringValidation({ min: 1 }),
  email: v.emailValidation(),
  phone: v.stringValidation({ min: 6 }),
  password: v.passwordValidation(6, 128),
});

export const schemaRole = z.object({
  selectedRole: z.nativeEnum(ActiveRoleEnum),
});

const driverDocuments = v.arrayValidation({
  of: z.object({
    type: z.nativeEnum(DriverDocumentTypeEnum),
    fileUrl: v.stringValidation({ min: 1 }),
    expiryDate: v.stringValidation({ optional: true }),
  }),
  optional: true,
  emptyAsNull: true,
});

const driverVehicles = v.arrayValidation({
  of: z.object({
    brand: v.stringValidation({ min: 1 }),
    model: v.stringValidation({ min: 1 }),
    plate: v.stringValidation({ min: 1 }),
    color: v.stringValidation({ min: 1 }),
    chassisNumber: v.stringValidation({ min: 1 }),
    year: v.numberValidation({ optional: true, int: true, positive: true }),
    categoryId: v.uuidValidation(),
  }),
  optional: true,
  emptyAsNull: true,
});

export const schemaDriver = z.object({
  driver: z.object({
    driverLicenseSerial: v.stringValidation({ min: 5 }),
    documents: driverDocuments,
    vehicles: driverVehicles,
  }),
});

export const schemaAggregate = schemaCommon.merge(schemaRole).merge(schemaDriver);

export type SignupFormData = z.infer<typeof schemaAggregate>;
