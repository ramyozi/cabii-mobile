import axios, { AxiosInstance } from 'axios';
import { z } from 'zod';
import { Storage, StorageKeys } from '@/utils/storage';
import { Fetcher } from 'swr';

export class ApiClient {
  public instance: AxiosInstance;
  private readonly baseUrl: string;

  constructor(config: { baseUrl: string }) {
    this.baseUrl = config.baseUrl;
    this.instance = this.buildInstance();
    this.implementInterceptor();
  }

  public implementInterceptor() {
    this.instance.interceptors.request.use(async (config: any) => {
      const existingAuthToken = await Storage.getItem(StorageKeys.accessToken).catch(e => {
        console.error('error getting auth token', e);
        return null;
      });

      if (existingAuthToken) {
        config.headers['authorization'] = `Bearer ${existingAuthToken}`;
      }

      const existingRefreshToken = await Storage.getItem(StorageKeys.refreshToken).catch(e => {
        console.error('error getting refresh token', e);
        return null;
      });

      if (existingRefreshToken) {
        config.headers['refresh-token'] = existingRefreshToken;
      }

      return config;
    });

    this.instance.interceptors.response.use(
      async (response: any) => {
        if (response.data?.data?.accessToken) {
          //console.log('setting access token', response.data.data.accessToken)
          await Storage.setItem(StorageKeys.accessToken, response.data.data.accessToken);
        }
        if (response.data?.data?.refreshToken) {
          await Storage.setItem(StorageKeys.refreshToken, response.data.data.refreshToken);
        }

        return response;
      },
      (error: any) => {
        return Promise.reject(error);
      },
    );
  }

  public getFetcher(): Fetcher<any, string> {
    return async (url: string): Promise<any> => {
      const response = await this.instance.get(url);

      return response.data;
    };
  }

  private buildInstance(): AxiosInstance {
    this.instance = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.instance;
  }
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export const apiClient = new ApiClient({
  baseUrl: API_BASE_URL,
});
