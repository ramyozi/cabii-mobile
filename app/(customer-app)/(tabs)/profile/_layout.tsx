import { Stack, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useAppTheme } from '@/plugin/theme-provider';
import { colors } from '@/theme';
import NavigationHeaderTitle from '@/components/layouts/NavigationHeaderTitle';
import NavigationHeaderLeft from '@/components/layouts/NavigationHeaderLeft';

export default function CustomerProfileStackLayout() {
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
          headerTitle: () => <NavigationHeaderTitle />,
          headerLeft: () => <NavigationHeaderLeft onPress={toggleDrawer} />,
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{ headerTitle: () => <NavigationHeaderTitle /> }}
      />
      <Stack.Screen
        name="settings"
        options={{ headerTitle: () => <NavigationHeaderTitle /> }}
      />
      <Stack.Screen
        name="support"
        options={{ headerTitle: () => <NavigationHeaderTitle /> }}
      />
    </Stack>
  );
}
