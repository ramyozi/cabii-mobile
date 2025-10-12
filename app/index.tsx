import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import { ActiveRoleEnum } from '@/plugin/auth-provider/auth-state';

export default function Index() {
  const { tokens, user, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (tokens && user && user.activeRole !== ActiveRoleEnum.Onboarding) {
    return <Redirect href="/home" />;
  }

  if (tokens && user && user.activeRole === ActiveRoleEnum.Onboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/auth/login" />;
}
