import { useContext } from 'react';
import { AuthContext } from '@/plugin/auth-provider/auth-context';

export const useAuth = () => useContext(AuthContext);
