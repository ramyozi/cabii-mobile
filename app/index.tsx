import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import { ActiveRoleEnum } from '@ramyozi/cabii-shared';

// Normalize role string for case-insensitive comparison
function normalizeRole(role: string | undefined): string {
  if (!role) return '';
  return role.toUpperCase();
}

export default function Index() {
  const { tokens, user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!tokens || !user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Debug logging
  console.log('[ROUTING DEBUG] User activeRole:', user.activeRole);
  console.log('[ROUTING DEBUG] ActiveRoleEnum values:', ActiveRoleEnum);
  console.log('[ROUTING DEBUG] Normalized activeRole:', normalizeRole(user.activeRole as string));

  // Normalize for comparison
  const normalizedActiveRole = normalizeRole(user.activeRole as string);

  if (user.activeRole === ActiveRoleEnum.Onboarding || normalizedActiveRole === 'ONBOARDING') {
    return <Redirect href="/(onboarding)" />;
  }

  // Route based on active role (case-insensitive)
  if (user.activeRole === ActiveRoleEnum.Customer || normalizedActiveRole === 'CUSTOMER') {
    console.log('[ROUTING DEBUG] Redirecting to customer home');
    return <Redirect href="/(customer-app)/(tabs)/home" />;
  }

  if (user.activeRole === ActiveRoleEnum.Driver || normalizedActiveRole === 'DRIVER') {
    console.log('[ROUTING DEBUG] Redirecting to driver dashboard');
    return <Redirect href="/(driver-app)/(tabs)/dashboard" />;
  }

  if (user.activeRole === ActiveRoleEnum.Admin || normalizedActiveRole === 'ADMIN') {
    console.log('[ROUTING DEBUG] Redirecting to admin home');
    return <Redirect href="/(main)/(tabs)/home" />;
  }

  console.log('[ROUTING DEBUG] No valid role, redirecting to choose-role');
  return <Redirect href="/(session)/choose-role" />;
}
