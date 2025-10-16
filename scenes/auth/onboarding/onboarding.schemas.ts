import { z } from 'zod';
import { createFormValidator } from '@/utils/formValidator';
import { ActiveRoleEnum, DriverDocumentTypeEnum } from '@cabii/shared';

const v = createFormValidator();

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

export const schemaAggregate = schemaRole.merge(schemaDriver);

export type OnboardingFormData = z.infer<typeof schemaAggregate>;
