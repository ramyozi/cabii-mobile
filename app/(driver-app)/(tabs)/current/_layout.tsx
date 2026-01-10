import { Stack, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useAppTheme } from '@/plugin/theme-provider';
import { colors } from '@/theme';
import NavigationHeaderLeft from '@/components/layouts/NavigationHeaderLeft';

export default function DriverCurrentStackLayout() {
  const { isDark } = useAppTheme();
  const navigation = useNavigation();
  const toggleDrawer = () => navigation.dispatch(DrawerActions.toggleDrawer());

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.white,
        headerStyle: { backgroundColor: isDark ? colors.blackGray : colors.darkPurple },
        headerTitleStyle: { fontSize: 18 },
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Current Trip',
          headerLeft: () => <NavigationHeaderLeft onPress={toggleDrawer} />,
        }}
      />
      <Stack.Screen name="navigation" options={{ title: 'Navigation' }} />
      <Stack.Screen name="trip-summary" options={{ title: 'Trip Summary' }} />
    </Stack>
  );
}
