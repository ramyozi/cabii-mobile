import { Stack, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useAppTheme } from '@/plugin/theme-provider';
import { colors } from '@/theme';
import NavigationHeaderTitle from '@/components/layouts/NavigationHeaderTitle';
import NavigationHeaderLeft from '@/components/layouts/NavigationHeaderLeft';

export default function DriverDashboardStackLayout() {
  const { isDark } = useAppTheme();
  const navigation = useNavigation();
  const toggleDrawer = () => navigation.dispatch(DrawerActions.toggleDrawer());

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
          headerLeft: () => <NavigationHeaderLeft onPress={toggleDrawer} />,
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
