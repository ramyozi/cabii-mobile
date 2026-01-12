import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import { ActiveRoleEnum } from '@ramyozi/cabii-shared';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_CONTEXT_KEY = 'onboarding:context';

export default function OnboardingLayout() {
  const { user, loading, tokens } = useAuth();
  const [checkingContext, setCheckingContext] = useState(true);
  const [isRoleSwitchFlow, setIsRoleSwitchFlow] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const context = await AsyncStorage.getItem(ONBOARDING_CONTEXT_KEY);
        setIsRoleSwitchFlow(context === 'role-switch');
      } catch (error) {
        console.error('Error checking onboarding context:', error);
      } finally {
        setCheckingContext(false);
      }
    })();
  }, []);

  if (loading || checkingContext) return null;

  if (!tokens || !user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Allow access to onboarding if:
  // 1. User has activeRole === Onboarding (fresh signup)
  // 2. User is coming from role-switch flow
  const canAccessOnboarding =
    user.activeRole === ActiveRoleEnum.Onboarding || isRoleSwitchFlow;

  if (!canAccessOnboarding) {
    // Not in onboarding mode and not from role-switch - redirect to main app
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
