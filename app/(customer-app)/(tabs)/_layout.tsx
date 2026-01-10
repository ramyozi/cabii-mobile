import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@/plugin/theme-provider';
import { colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';

export default function CustomerTabsLayout() {
  const { t } = useTranslation();
  const { isDark } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.darkPurple,
        tabBarInactiveTintColor: isDark ? colors.gray : colors.darkGray,
        tabBarStyle: {
          backgroundColor: isDark ? colors.blackGray : colors.white,
          borderTopColor: isDark ? colors.darkGray : colors.lightGray,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: t('customer.home.title'),
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: t('customer.trips.title'),
          tabBarIcon: ({ color, size }) => <Ionicons name="car" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: t('customer.wallet.title'),
          tabBarIcon: ({ color, size }) => <Ionicons name="wallet" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('customer.profile.title'),
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
