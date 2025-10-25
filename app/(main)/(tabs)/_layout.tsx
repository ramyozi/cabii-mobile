import React from 'react';
import { Stack } from 'expo-router';
import { useAppTheme } from '@/plugin/theme-provider';

export default function TabsRootLayout() {
  const { theme } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
