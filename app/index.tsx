import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import { ActiveRoleEnum } from '@ramyozi/cabii-shared';

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

  // Route based on active role
  const activeRole = user.activeRole;

  if (activeRole === ActiveRoleEnum.Onboarding) {
    return <Redirect href="/(onboarding)" />;
  }

  if (activeRole === ActiveRoleEnum.Customer) {
    return <Redirect href="/(customer-app)/(tabs)/home" />;
  }

  if (activeRole === ActiveRoleEnum.Driver) {
    return <Redirect href="/(driver-app)/(tabs)/dashboard" />;
  }

  if (activeRole === ActiveRoleEnum.Admin) {
    // TODO: Create dedicated admin interface
    return <Redirect href="/(customer-app)/(tabs)/home" />;
  }

  // No valid role - redirect to choose role
  return <Redirect href="/(session)/choose-role" />;
}
