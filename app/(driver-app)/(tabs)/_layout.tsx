import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@/plugin/theme-provider';
import { colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';

export default function DriverTabsLayout() {
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
        name="dashboard"
        options={{
          title: t('driver.dashboard.title'),
          tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="current"
        options={{
          title: t('driver.current.title'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="navigate" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: t('driver.earnings.title'),
          tabBarIcon: ({ color, size }) => <Ionicons name="cash" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('driver.profile.title'),
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
