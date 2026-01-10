import { Stack } from 'expo-router';
import { useAppTheme } from '@/plugin/theme-provider';
import { colors } from '@/theme';

export default function CustomerTripsStackLayout() {
  const { isDark } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.white,
        headerStyle: { backgroundColor: isDark ? colors.blackGray : colors.darkPurple },
        headerTitleStyle: { fontSize: 18 },
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen name="index" options={{ title: 'My Trips' }} />
      <Stack.Screen name="trip-details" options={{ title: 'Trip Details' }} />
      <Stack.Screen name="tracking" options={{ title: 'Live Tracking' }} />
    </Stack>
  );
}
