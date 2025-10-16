import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import { ActiveRoleEnum } from '@cabii/shared';

export default function AuthLayout() {
  const { tokens, user, loading } = useAuth();

  if (loading) return null;

  if (tokens && user) {
    if (user.activeRole === ActiveRoleEnum.Onboarding) {
      return <Redirect href="/onboarding" />;
    }
    return <Redirect href="/(main)/(tabs)/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login/index" />
      <Stack.Screen name="sign-up/index" />
      <Stack.Screen name="reset-password/index" />
    </Stack>
  );
}
