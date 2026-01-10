import { Stack } from 'expo-router';
import { useAppTheme } from '@/plugin/theme-provider';
import { colors } from '@/theme';
import NavigationHeaderTitle from '@/components/layouts/NavigationHeaderTitle';

export default function DriverDashboardStackLayout() {
  const { isDark } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.white,
        headerStyle: { backgroundColor: isDark ? colors.blackGray : colors.darkPurple },
        headerTitleStyle: { fontSize: 18 },
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerTitle: () => <NavigationHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="available-rides"
        options={{
          title: 'Available Rides',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="ride-details"
        options={{
          title: 'Ride Details',
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}
