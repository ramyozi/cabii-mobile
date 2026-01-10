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

  if (user.activeRole === ActiveRoleEnum.Onboarding) {
    return <Redirect href="/(onboarding)" />;
  }

  // Route based on active role
  switch (user.activeRole) {
    case ActiveRoleEnum.Customer:
      return <Redirect href="/(passenger)/home" />;
    case ActiveRoleEnum.Driver:
      return <Redirect href="/(driver)/dashboard" />;
    case ActiveRoleEnum.Admin:
      return <Redirect href="/(main)/(tabs)/home" />;
    default:
      return <Redirect href="/(session)/choose-role" />;
  }
}
