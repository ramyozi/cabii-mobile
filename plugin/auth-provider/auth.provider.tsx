import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './auth-context';
import { ActiveRoleEnum, authReducer, initialAuthState } from './auth-state';
import { Storage, StorageKeys } from '@/utils/storage';
import { apiClient } from '@/plugin/api-client'; // 👈 use your centralized ApiClient

axios.defaults.withCredentials = true;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    (async () => {
      try {
        const savedTokens = await AsyncStorage.getItem('authTokens');
        if (savedTokens) {
          dispatch({ type: 'RESTORE_TOKENS', payload: JSON.parse(savedTokens) });
        } else {
          dispatch({ type: 'RESTORE_TOKENS', payload: null });
        }
      } catch (err) {
        console.error('Error restoring tokens:', err);
        dispatch({ type: 'RESTORE_TOKENS', payload: null });
      }
    })();
  }, []);

  const signIn = async (email: string, password: string, activeRole: string) => {
    const response = await apiClient.instance.post('/auth/sign-in', {
      email,
      password,
      activeRole,
    });

    const tokens = response.data.data;
    const user = { email, activeRole: activeRole as ActiveRoleEnum };

    await AsyncStorage.setItem('authTokens', JSON.stringify(tokens));
    await Storage.setItem(StorageKeys.accessToken, tokens.accessToken);
    await Storage.setItem(StorageKeys.refreshToken, tokens.refreshToken);

    dispatch({ type: 'SIGN_IN', payload: { user, tokens } });
  };

  const signOut = async () => {
    try {
      await apiClient.instance.post('/auth/sign-out');
    } catch (err) {
      console.warn('Error signing out:', err);
    } finally {
      await AsyncStorage.removeItem('authTokens');
      await Storage.removeItem(StorageKeys.accessToken);
      await Storage.removeItem(StorageKeys.refreshToken);
      dispatch({ type: 'SIGN_OUT' });
    }
  };

  const refreshTokens = async () => {
    const savedTokens = await AsyncStorage.getItem('authTokens');
    if (!savedTokens) return;

    const { refreshToken } = JSON.parse(savedTokens);
    const response = await apiClient.instance.post('/auth/refresh', { refreshToken });

    const newTokens = response.data.data;
    await AsyncStorage.setItem('authTokens', JSON.stringify(newTokens));
    await Storage.setItem(StorageKeys.accessToken, newTokens.accessToken);
    await Storage.setItem(StorageKeys.refreshToken, newTokens.refreshToken);

    dispatch({ type: 'RESTORE_TOKENS', payload: newTokens });
  };

  const switchRole = async (activeRole: string) => {
    const response = await apiClient.instance.post('/auth/switch-role', { activeRole });
    const newTokens = response.data.data;

    await AsyncStorage.setItem('authTokens', JSON.stringify(newTokens));
    await Storage.setItem(StorageKeys.accessToken, newTokens.accessToken);
    await Storage.setItem(StorageKeys.refreshToken, newTokens.refreshToken);

    dispatch({
      type: 'SWITCH_ROLE',
      payload: { activeRole: activeRole as ActiveRoleEnum, tokens: newTokens },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        refreshTokens,
        switchRole,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
