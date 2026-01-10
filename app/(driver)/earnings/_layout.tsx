import { Stack } from 'expo-router';
import { useAppTheme } from '@/plugin/theme-provider';
import { colors } from '@/theme';

export default function DriverEarningsStackLayout() {
  const { isDark } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.white,
        headerStyle: { backgroundColor: isDark ? colors.blackGray : colors.darkPurple },
        headerTitleStyle: { fontSize: 18 },
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen name="index" options={{ title: 'Earnings' }} />
      <Stack.Screen name="daily" options={{ title: 'Daily Earnings' }} />
      <Stack.Screen name="weekly" options={{ title: 'Weekly Earnings' }} />
      <Stack.Screen name="history" options={{ title: 'Earnings History' }} />
    </Stack>
  );
}
