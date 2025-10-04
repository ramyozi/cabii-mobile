import { Redirect } from 'expo-router';
import { useAuth } from '@/plugin/auth-provider/use-auth';

export default function Index() {
  const { tokens, user, loading } = useAuth();

  if (loading) return null;

  if (tokens && user) {
    return <Redirect href="/(main)/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
