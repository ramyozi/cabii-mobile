import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import { ActiveRoleEnum } from '@ramyozi/cabii-shared';

export default function OnboardingLayout() {
  const { user, loading, tokens } = useAuth();

  if (loading) return null;

  if (!tokens || !user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (user.activeRole !== ActiveRoleEnum.Onboarding) {
    return <Redirect href="/(main)/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
