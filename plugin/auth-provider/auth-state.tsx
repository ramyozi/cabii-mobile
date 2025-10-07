export enum ActiveRoleEnum {
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER',
  CUSTOMER = 'CUSTOMER',
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  email: string;
  activeRole: ActiveRoleEnum;
}

export interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  loading: boolean;
}

export type AuthAction =
  | { type: 'SIGN_IN'; payload: { user: AuthUser; tokens: AuthTokens } }
  | { type: 'SIGN_OUT' }
  | { type: 'RESTORE_TOKENS'; payload: AuthTokens | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SWITCH_ROLE'; payload: { activeRole: ActiveRoleEnum; tokens: AuthTokens } };

export const initialAuthState: AuthState = {
  user: null,
  tokens: null,
  loading: true,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SIGN_IN':
      return { ...state, user: action.payload.user, tokens: action.payload.tokens, loading: false };
    case 'SIGN_OUT':
      return { ...state, user: null, tokens: null, loading: false };
    case 'RESTORE_TOKENS':
      return { ...state, tokens: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SWITCH_ROLE':
      return {
        ...state,
        user: state.user ? { ...state.user, activeRole: action.payload.activeRole } : null,
        tokens: action.payload.tokens,
      };
    default:
      return state;
  }
}
