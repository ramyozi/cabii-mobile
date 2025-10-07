import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
  language: 'selected_language',
  theme: 'selected_theme',
};

export const Storage = {
  setItem: async (key: string, value: any, handleErrorCallback?: Function) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('AsyncStorage setItem error:', error);
      handleErrorCallback?.(error);
    }
  },
  getItem: async (key: string, handleErrorCallback?: Function) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        return JSON.parse(value);
      }
      return null;
    } catch (error) {
      console.error('AsyncStorage getItem error:', error);
      handleErrorCallback?.(error);
      return null;
    }
  },
  removeItem: async (key: string, handleErrorCallback?: Function) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('AsyncStorage removeItem error:', error);
      handleErrorCallback?.(error);
    }
  },
};
