import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import { ActiveRoleEnum } from '@ramyozi/cabii-shared';
import { useAppTheme } from '@/plugin/theme-provider';

export default function TabsIndex() {
  const { user, tokens, loading } = useAuth();
  const { theme } = useAppTheme();
  const router = useRouter()

  if (loading) {
    return (
      <View style={[styles.loader, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!tokens || !user) return <Redirect href="/(auth)/login" />;

  if (user.activeRole != ActiveRoleEnum.Onboarding) {
    router.replace('/(main)/(tabs)/home')
  } else {
    router.replace('/(onboarding)')
  }
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
