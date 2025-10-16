import React from 'react';
import { AuthState, initialAuthState } from './auth-state';
import { ActiveRoleEnum, UserResponseDto } from '@ramyozi/cabii-shared';

export interface AuthContextProps extends AuthState {
  signIn: (email: string, password: string, activeRole: ActiveRoleEnum) => Promise<void>;
  signOut: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  switchRole: (activeRole: ActiveRoleEnum) => Promise<void>;
  updateUser: (updates: Partial<UserResponseDto['data']>) => void;
}

export const AuthContext = React.createContext<AuthContextProps>({
  ...initialAuthState,
  signIn: async () => {},
  signOut: async () => {},
  refreshTokens: async () => {},
  switchRole: async () => {},
  updateUser: () => {},
});
