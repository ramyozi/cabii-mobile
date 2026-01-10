import { Stack } from 'expo-router';
import { useAppTheme } from '@/plugin/theme-provider';
import { colors } from '@/theme';
import NavigationHeaderTitle from '@/components/layouts/NavigationHeaderTitle';

export default function PassengerHomeStackLayout() {
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
          title: 'Home',
          headerTitle: () => <NavigationHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="book-ride"
        options={{
          title: 'Book a Ride',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="book-delivery"
        options={{
          title: 'Book a Delivery',
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}
