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

  const validRoles = [
    ActiveRoleEnum.Admin,
    ActiveRoleEnum.Driver,
    ActiveRoleEnum.Customer,
    ActiveRoleEnum.Onboarding,
  ];

  if (!user.activeRole || !validRoles.includes(user.activeRole)) {
    return <Redirect href="/(session)/choose-role" />;
  }

  return <Redirect href="/(main)/(tabs)/home" />;
}
