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

export const schemaAggregate = schemaCommon;

export type SignupFormData = z.infer<typeof schemaAggregate>;
