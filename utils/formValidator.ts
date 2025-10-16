import { z, ZodTypeAny } from 'zod';
import i18next from 'i18next';

export type StringValidationParams = {
  min?: number;
  max?: number;
  regex?: RegExp;
  optional?: boolean;
  trim?: boolean;
  nullable?: boolean;
  emptyAsNull?: boolean;
};

export type NumberValidationParams = {
  min?: number;
  max?: number;
  int?: boolean;
  positive?: boolean;
  optional?: boolean;
  nullable?: boolean;
  emptyAsNull?: boolean;
};

export type ArrayValidationParams<T extends ZodTypeAny> = {
  of: T;
  min?: number;
  max?: number;
  optional?: boolean;
  nullable?: boolean;
  emptyAsNull?: boolean;
};

let currentLang = i18next.language;
i18next.on('languageChanged', lng => (currentLang = lng));

export function createFormValidator() {
  const t = (key: string, options?: any) =>
    i18next.t(key, { lng: currentLang, ...options }) as string;

  const stringValidation = (params: StringValidationParams = {}) => {
    const { min, max, regex, optional, trim, nullable, emptyAsNull } = params;
    let schema = z
      .string()
      .refine(v => !(v == null || v === ''), { message: t('common.form.error.required') });
    if (trim) schema = schema.transform(v => v.trim());
    if (min !== undefined)
      schema = schema.min(min, { message: t('common.form.error.min', { min }) });
    if (max !== undefined)
      schema = schema.max(max, { message: t('common.form.error.max', { max }) });
    if (regex) schema = schema.regex(regex, { message: t('common.form.error.invalid_format') });
    if (emptyAsNull) schema = schema.transform(v => (v.trim() === '' ? null : v));
    if (nullable) schema = schema.nullable();
    if (optional) schema = schema.optional();
    return schema;
  };

  const numberValidation = (params: NumberValidationParams = {}) => {
    const { min, max, int, positive, optional, nullable, emptyAsNull } = params;
    let schema = z
      .union([z.string(), z.number()])
      .transform(val => (val === '' || val === null ? undefined : Number(val)))
      .pipe(z.number({ message: t('common.form.error.invalid_number') }));

    if (int)
      schema = schema.refine(n => Number.isInteger(n), t('common.form.error.must_be_integer'));
    if (positive) schema = schema.refine(n => n > 0, t('common.form.error.must_be_positive'));
    if (min !== undefined)
      schema = schema.min(min, { message: t('common.form.error.min', { min }) });
    if (max !== undefined)
      schema = schema.max(max, { message: t('common.form.error.max', { max }) });
    if (emptyAsNull) schema = schema.transform(v => (v === undefined ? null : v));
    if (nullable) schema = schema.nullable();
    if (optional) schema = schema.optional();
    return schema;
  };

  const emailValidation = (optional = false) => {
    let schema = z.string().email({ message: t('common.form.error.invalid_email') });
    if (optional) schema = schema.optional();
    return schema;
  };

  const passwordValidation = (min = 6, max = 128) =>
    z
      .string()
      .min(min, { message: t('common.form.error.password_min', { min }) })
      .max(max, { message: t('common.form.error.password_max', { max }) });

  const arrayValidation = <T extends ZodTypeAny>(params: ArrayValidationParams<T>) => {
    const { of, min, max, optional, nullable, emptyAsNull } = params;
    let schema = z.array(of);
    if (min !== undefined)
      schema = schema.min(min, { message: t('common.form.error.min_items', { min }) });
    if (max !== undefined)
      schema = schema.max(max, { message: t('common.form.error.max_items', { max }) });
    if (emptyAsNull) schema = schema.transform(v => (v.length === 0 ? null : v));
    if (nullable) schema = schema.nullable();
    if (optional) schema = schema.optional();
    return schema;
  };

  const uuidValidation = (optional = false) => {
    let schema = z.string().uuid({ message: t('common.form.error.invalid_uuid') });
    if (optional) schema = schema.optional();
    return schema;
  };

  return {
    stringValidation,
    numberValidation,
    arrayValidation,
    emailValidation,
    passwordValidation,
    uuidValidation,
  };
}
