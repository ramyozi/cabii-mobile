import React from 'react';
import { AuthState, initialAuthState } from './auth-state';

export interface AuthContextProps extends AuthState {
  signIn: (email: string, password: string, activeRole: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  switchRole: (activeRole: string) => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextProps>({
  ...initialAuthState,
  signIn: async () => {},
  signOut: async () => {},
  refreshTokens: async () => {},
  switchRole: async () => {},
});
