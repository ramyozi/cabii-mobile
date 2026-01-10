import { Stack, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useAppTheme } from '@/plugin/theme-provider';
import { colors } from '@/theme';
import NavigationHeaderLeft from '@/components/layouts/NavigationHeaderLeft';

export default function CustomerWalletStackLayout() {
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
          title: 'Wallet',
          headerLeft: () => <NavigationHeaderLeft onPress={toggleDrawer} />,
        }}
      />
      <Stack.Screen name="payment-methods" options={{ title: 'Payment Methods' }} />
      <Stack.Screen name="transaction-history" options={{ title: 'Transaction History' }} />
      <Stack.Screen name="add-payment-method" options={{ title: 'Add Payment Method' }} />
    </Stack>
  );
}
