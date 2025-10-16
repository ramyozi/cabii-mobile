import Constants from 'expo-constants';

export type Env = 'development' | 'staging' | 'production';

interface AppConfig {
  env: Env;
  apiUrl: string;
}

const extra = Constants.expoConfig?.extra as Partial<AppConfig>;

const config: AppConfig = {
  env:
    (extra?.env as Env) ||
    (process.env.EXPO_PUBLIC_ENV as Env) ||
    (process.env.NODE_ENV as Env) ||
    'development',
  apiUrl:
    extra?.apiUrl ||
    process.env.EXPO_PUBLIC_API_URL ||
    process.env.API_URL ||
    'http://localhost:3000',
};

export default config;
