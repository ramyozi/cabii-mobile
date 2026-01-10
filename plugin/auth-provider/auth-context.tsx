import React from 'react';
import { AuthState, initialAuthState } from './auth-state';
import {
  ActiveRoleEnum,
  AuthTokenDto,
  UserResponseDto,
  PendingRoleSelectionDto,
} from '@ramyozi/cabii-shared';

export interface AuthContextProps extends AuthState {
  signIn: (email: string, password: string) => Promise<AuthTokenDto | PendingRoleSelectionDto>;
  signOut: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  switchRole: (activeRole: ActiveRoleEnum) => Promise<void>;
  updateUser: (updates: Partial<UserResponseDto['data']>) => void;
}

export const AuthContext = React.createContext<AuthContextProps>({
  ...initialAuthState,
  signIn: async () => ({ pendingRoleSelection: true, tempToken: '' }),
  signOut: async () => {},
  refreshTokens: async () => {},
  switchRole: async () => {},
  updateUser: () => {},
});
