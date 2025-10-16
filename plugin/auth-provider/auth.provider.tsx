import React, { useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './auth-context';
import { authReducer, initialAuthState } from './auth-state';
import {
  ActiveRoleEnum,
  AuthTokenDto,
  AuthTokenResponseDto,
  SignInRequestDto,
  RefreshAuthRequestDto,
  SwitchRoleDto,
  UserResponseDto,
  BackendApiRoutes,
} from '@cabii/shared';
import { Storage, StorageKeys } from '@/utils/storage';
import { apiClient } from '@/plugin/api-client';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('authTokens');
        if (saved) {
          dispatch({ type: 'RESTORE_TOKENS', payload: JSON.parse(saved) });
        } else {
          dispatch({ type: 'RESTORE_TOKENS', payload: null });
        }
      } catch (err) {
        console.error('Erreur de restauration des tokens:', err);
        dispatch({ type: 'RESTORE_TOKENS', payload: null });
      }
    })();
  }, []);

  const signIn = async (email: string, password: string, activeRole: ActiveRoleEnum) => {
    const payload: SignInRequestDto = { email, password, activeRole };

    const response = await apiClient.instance.post<AuthTokenResponseDto>(
      BackendApiRoutes.auth.signIn.path,
      payload,
    );

    if (response.status !== 200) throw new Error(response.data?.message ?? 'Connexion échouée');

    const tokens = response.data.data;
    const meResponse = await apiClient.instance.get<UserResponseDto>(BackendApiRoutes.user.me.path);
    const user = meResponse.data.data;

    await AsyncStorage.setItem('authTokens', JSON.stringify(tokens));
    await Storage.setItem(StorageKeys.accessToken, tokens.accessToken);
    await Storage.setItem(StorageKeys.refreshToken, tokens.refreshToken);

    apiClient.instance.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;

    dispatch({ type: 'SIGN_IN', payload: { user, tokens } });
  };

  const signOut = async () => {
    try {
      await apiClient.instance.post(BackendApiRoutes.auth.signOut.path);
    } catch (err) {
      console.warn('Erreur lors de la déconnexion:', err);
    } finally {
      await AsyncStorage.removeItem('authTokens');
      await Storage.removeItem(StorageKeys.accessToken);
      await Storage.removeItem(StorageKeys.refreshToken);
      dispatch({ type: 'SIGN_OUT' });
    }
  };

  const refreshTokens = async () => {
    const saved = await AsyncStorage.getItem('authTokens');
    if (!saved) return;

    const { refreshToken } = JSON.parse(saved) as AuthTokenDto;
    const payload: RefreshAuthRequestDto = { refreshToken };

    const response = await apiClient.instance.post<AuthTokenResponseDto>(
      BackendApiRoutes.auth.refresh.path,
      payload,
    );

    if (response.status !== 200)
      throw new Error(response.data?.message ?? 'Rafraîchissement échoué');

    const newTokens = response.data.data;
    await AsyncStorage.setItem('authTokens', JSON.stringify(newTokens));
    await Storage.setItem(StorageKeys.accessToken, newTokens.accessToken);
    await Storage.setItem(StorageKeys.refreshToken, newTokens.refreshToken);

    apiClient.instance.defaults.headers.common['Authorization'] = `Bearer ${newTokens.accessToken}`;

    dispatch({ type: 'RESTORE_TOKENS', payload: newTokens });
  };

  const switchRole = async (activeRole: ActiveRoleEnum) => {
    const payload: SwitchRoleDto = { activeRole };

    const response = await apiClient.instance.post<AuthTokenResponseDto>(
      BackendApiRoutes.auth.switchRole.path,
      payload,
    );

    if (response.status !== 200)
      throw new Error(response.data?.message ?? 'Changement de rôle échoué');

    const newTokens = response.data.data;
    await AsyncStorage.setItem('authTokens', JSON.stringify(newTokens));
    await Storage.setItem(StorageKeys.accessToken, newTokens.accessToken);
    await Storage.setItem(StorageKeys.refreshToken, newTokens.refreshToken);

    apiClient.instance.defaults.headers.common['Authorization'] = `Bearer ${newTokens.accessToken}`;

    dispatch({
      type: 'SWITCH_ROLE',
      payload: { activeRole, tokens: newTokens },
    });
  };

  const updateUser = (updates: Partial<UserResponseDto['data']>) => {
    dispatch({ type: 'UPDATE_USER', payload: updates });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        refreshTokens,
        switchRole,
        updateUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
