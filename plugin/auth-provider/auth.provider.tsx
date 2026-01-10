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
  PendingRoleSelectionDto,
} from '@ramyozi/cabii-shared';
import { Storage, StorageKeys } from '@/utils/storage';
import { apiClient } from '@/plugin/api-client';

const TEMP_TOKEN_STORAGE_KEY = 'tempAccessToken';

async function reloadUser(dispatch: any) {
  try {
    const meResponse = await apiClient.instance.get<UserResponseDto>(BackendApiRoutes.user.me.path);
    dispatch({ type: 'SET_USER', payload: meResponse.data.data });
  } catch {
    dispatch({ type: 'SET_USER', payload: null });
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('authTokens');
        const temp = await AsyncStorage.getItem(TEMP_TOKEN_STORAGE_KEY);
        if (saved) {
          dispatch({ type: 'RESTORE_TOKENS', payload: JSON.parse(saved) });
          const tokens = JSON.parse(saved) as AuthTokenDto;
          apiClient.instance.defaults.headers.common['Authorization'] =
            `Bearer ${tokens.accessToken}`;
        } else if (temp) {
          // No real tokens, but we have a temp token to reach /choose-role + /switch-role
          dispatch({ type: 'SET_TEMP_TOKEN', payload: temp });
          apiClient.instance.defaults.headers.common['Authorization'] = `Bearer ${temp}`;
          // Try to fetch user to populate context
          try {
            const meResponse = await apiClient.instance.get<UserResponseDto>(
              BackendApiRoutes.user.me.path,
            );
            dispatch({ type: 'SET_USER', payload: meResponse.data.data });
          } catch {
            dispatch({ type: 'SET_USER', payload: null });
          }
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        } else {
          dispatch({ type: 'RESTORE_TOKENS', payload: null });
        }
      } catch (err) {
        console.error('Erreur de restauration des tokens:', err);
        dispatch({ type: 'RESTORE_TOKENS', payload: null });
      }
    })();
  }, []);

  const signIn = async (
    email: string,
    password: string,
  ): Promise<AuthTokenDto | PendingRoleSelectionDto> => {
    const payload: SignInRequestDto = { email, password, activeRole: undefined };

    const response = await apiClient.instance.post(BackendApiRoutes.auth.signIn.path, payload);

    if (response.status !== 200) throw new Error(response.data?.message ?? 'Login failed');

    const result = response.data.data;

    // Handle pending role selection
    if (result?.pendingRoleSelection && result?.tempToken) {
      const tempToken = result.tempToken as string;

      // Set axios auth header
      apiClient.instance.defaults.headers.common['Authorization'] = `Bearer ${tempToken}`;
      // Save to storage so user can leave/come back and still choose
      await AsyncStorage.setItem(TEMP_TOKEN_STORAGE_KEY, tempToken);
      dispatch({ type: 'SET_TEMP_TOKEN', payload: tempToken });

      await reloadUser(dispatch);

      return { pendingRoleSelection: true, tempToken };
    }

    const tokens = result as AuthTokenDto;
    const meResponse = await apiClient.instance.get<UserResponseDto>(BackendApiRoutes.user.me.path);
    const user = meResponse.data.data;

    await AsyncStorage.setItem('authTokens', JSON.stringify(tokens));
    await Storage.setItem(StorageKeys.accessToken, tokens.accessToken);
    await Storage.setItem(StorageKeys.refreshToken, tokens.refreshToken);

    apiClient.instance.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;

    // Clear any temp token if present
    await AsyncStorage.removeItem(TEMP_TOKEN_STORAGE_KEY);
    dispatch({ type: 'SET_TEMP_TOKEN', payload: null });

    dispatch({ type: 'SIGN_IN', payload: { user, tokens } });
    return tokens;
  };

  const signOut = async () => {
    try {
      await apiClient.instance.post(BackendApiRoutes.auth.signOut.path);
    } catch (err) {
      console.warn('Erreur lors de la déconnexion:', err);
    } finally {
      await AsyncStorage.removeItem('authTokens');
      await AsyncStorage.removeItem(TEMP_TOKEN_STORAGE_KEY);
      await Storage.removeItem(StorageKeys.accessToken);
      await Storage.removeItem(StorageKeys.refreshToken);
      dispatch({ type: 'SIGN_OUT' });
    }
  };

  const refreshTokens = async () => {
    console.log('Refreshing tokens...');
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

    await reloadUser(dispatch);

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

    await AsyncStorage.removeItem(TEMP_TOKEN_STORAGE_KEY);
    dispatch({ type: 'SET_TEMP_TOKEN', payload: null });

    try {
      const meResponse = await apiClient.instance.get<UserResponseDto>(
        BackendApiRoutes.user.me.path,
      );
      dispatch({ type: 'SET_USER', payload: meResponse.data.data });
    } catch {
      dispatch({ type: 'SET_USER', payload: null });
    }

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
