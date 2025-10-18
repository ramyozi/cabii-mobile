import { TFunction } from 'i18next';

/**
 * Maps backend exception messages to friendly translated strings.
 * Handles both direct messages and nested NestJS validation/response errors.
 */
export function mapServerError(error: any, t: TFunction): string {
  if (!error) return t('auth.login.errors.default');

  const msg =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    (typeof error === 'string' ? error : '');

  if (!msg) return t('auth.login.errors.default');

  const text = Array.isArray(msg) ? msg.join(' ').toLowerCase() : msg.toString().toLowerCase();

  const errorMap: Record<string, string> = {
    // from backend exceptions
    'invalid email or password': 'auth.login.errors.invalidCredentials',
    'wrong password': 'auth.login.errors.invalidCredentials',
    'user does not have a driver profile': 'auth.login.errors.missingDriverProfile',
    'user does not have a customer profile': 'auth.login.errors.missingCustomerProfile',
    'user does not have any profile': 'auth.login.errors.missingAnyProfile',
    'not an admin': 'auth.login.errors.notAdmin',

    // common http-level issues
    unauthorized: 'common.errors.invalidCredentials',
    forbidden: 'common.errors.forbidden',
    network: 'common.errors.network',
    timeout: 'common.errors.timeout',
  };

  for (const [pattern, key] of Object.entries(errorMap)) {
    if (text.includes(pattern)) {
      return t(key);
    }
  }

  return t('auth.login.errors.default');
}
