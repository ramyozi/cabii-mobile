import { AuthTokenDto, UserResponseDto } from '@ramyozi/cabii-shared';

export interface AuthState {
  user: UserResponseDto['data'] | null;
  tokens: AuthTokenDto | null;
  loading: boolean;
  tempAccessToken?: string | null;
}

export type AuthAction =
  | { type: 'SIGN_IN'; payload: { user: UserResponseDto['data']; tokens: AuthTokenDto } }
  | { type: 'SIGN_OUT' }
  | { type: 'RESTORE_TOKENS'; payload: AuthTokenDto | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | {
      type: 'SWITCH_ROLE';
      payload: { activeRole: UserResponseDto['data']['activeRole']; tokens: AuthTokenDto };
    }
  | { type: 'SET_TEMP_TOKEN'; payload: string | null }
  | { type: 'SET_USER'; payload: UserResponseDto['data'] | null }
  | { type: 'UPDATE_USER'; payload: Partial<UserResponseDto['data']> };

export const initialAuthState: AuthState = {
  user: null,
  tokens: null,
  loading: true,
  tempAccessToken: null,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        tempAccessToken: null,
        loading: false,
      };

    case 'SIGN_OUT':
      return { ...state, user: null, tokens: null, tempAccessToken: null, loading: false };
    case 'RESTORE_TOKENS':
      return { ...state, tokens: action.payload, loading: false };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SWITCH_ROLE':
      return {
        ...state,
        user: state.user ? { ...state.user, activeRole: action.payload.activeRole } : null,
        tokens: action.payload.tokens,
        tempAccessToken: null,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : state.user,
      };

    default:
      return state;
  }
}
