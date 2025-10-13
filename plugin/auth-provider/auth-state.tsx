export enum ActiveRoleEnum {
  Admin = 'ADMIN',
  Driver = 'DRIVER',
  Customer = 'CUSTOMER',
  Onboarding = 'ONBOARDING',
}

export enum RoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  activeRole: ActiveRoleEnum;
  roles?: RoleEnum[];
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
  | { type: 'SWITCH_ROLE'; payload: { activeRole: ActiveRoleEnum; tokens: AuthTokens } }
  | { type: 'UPDATE_USER'; payload: Partial<AuthUser> };

export const initialAuthState: AuthState = {
  user: null,
  tokens: null,
  loading: true,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SIGN_IN': {
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        loading: false,
      };
    }

    case 'SIGN_OUT': {
      return { ...state, user: null, tokens: null, loading: false };
    }

    case 'RESTORE_TOKENS': {
      return { ...state, tokens: action.payload, loading: false };
    }

    case 'SET_LOADING': {
      return { ...state, loading: action.payload };
    }

    case 'SWITCH_ROLE': {
      const { activeRole, tokens } = action.payload;
      return {
        ...state,
        user: state.user ? { ...state.user, activeRole } : null,
        tokens,
      };
    }

    case 'UPDATE_USER': {
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : state.user,
      };
    }

    default:
      return state;
  }
}
