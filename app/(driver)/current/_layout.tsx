import { Stack } from 'expo-router';
import { useAppTheme } from '@/plugin/theme-provider';
import { colors } from '@/theme';

export default function DriverCurrentStackLayout() {
  const { isDark } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.white,
        headerStyle: { backgroundColor: isDark ? colors.blackGray : colors.darkPurple },
        headerTitleStyle: { fontSize: 18 },
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen name="index" options={{ title: 'Current Trip' }} />
      <Stack.Screen name="navigation" options={{ title: 'Navigation' }} />
      <Stack.Screen name="trip-summary" options={{ title: 'Trip Summary' }} />
    </Stack>
  );
}
