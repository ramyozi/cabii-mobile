import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { useAppTheme } from '@/plugin/theme-provider';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import { ActiveRoleEnum } from '@ramyozi/cabii-shared';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  userInfo: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.gray,
  },
  currentRole: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.lightPurple,
  },
  currentRoleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  menuSection: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: 8,
  },
});

export default function DrawerContents() {
  const { t } = useTranslation();
  const { isDark } = useAppTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSwitchRole = () => {
    router.push('/(session)/choose-role');
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  const getRoleLabel = (role: string | undefined) => {
    if (!role) return t('common.unknown');
    const normalized = role.toUpperCase();
    if (normalized === 'CUSTOMER') return t('auth.signForm.roles.customer');
    if (normalized === 'DRIVER') return t('auth.signForm.roles.driver');
    if (normalized === 'ADMIN') return 'Admin';
    return role;
  };

  return (
    <SafeAreaView style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
      <ScrollView>
        {/* User Header */}
        <View
          style={[styles.header, isDark && { borderBottomColor: colors.darkGray }]}>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, isDark && { color: colors.white }]}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={[styles.userEmail, isDark && { color: colors.gray }]}>
              {user?.email}
            </Text>
          </View>
          <View
            style={[
              styles.currentRole,
              isDark && { backgroundColor: colors.darkPurple },
            ]}>
            <Text style={styles.currentRoleText}>
              {t('drawer.currentRole')}: {getRoleLabel(user?.activeRole as string)}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {/* Switch Role */}
          <Pressable
            style={styles.menuItem}
            onPress={handleSwitchRole}>
            <Ionicons
              name="swap-horizontal"
              size={24}
              color={isDark ? colors.white : colors.darkPurple}
            />
            <Text style={[styles.menuItemText, isDark && { color: colors.white }]}>
              {t('drawer.switchRole')}
            </Text>
          </Pressable>

          <View style={[styles.divider, isDark && { backgroundColor: colors.darkGray }]} />

          {/* Profile */}
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              const isCustomer =
                user?.activeRole === ActiveRoleEnum.Customer ||
                (user?.activeRole as string)?.toUpperCase() === 'CUSTOMER';
              const isDriver =
                user?.activeRole === ActiveRoleEnum.Driver ||
                (user?.activeRole as string)?.toUpperCase() === 'DRIVER';

              if (isCustomer) {
                router.push('/(customer-app)/(tabs)/profile');
              } else if (isDriver) {
                router.push('/(driver-app)/(tabs)/profile');
              }
            }}>
            <Ionicons
              name="person"
              size={24}
              color={isDark ? colors.white : colors.darkPurple}
            />
            <Text style={[styles.menuItemText, isDark && { color: colors.white }]}>
              {t('drawer.profile')}
            </Text>
          </Pressable>

          {/* Settings */}
          <Pressable style={styles.menuItem}>
            <Ionicons
              name="settings"
              size={24}
              color={isDark ? colors.white : colors.darkPurple}
            />
            <Text style={[styles.menuItemText, isDark && { color: colors.white }]}>
              {t('drawer.settings')}
            </Text>
          </Pressable>

          <View style={[styles.divider, isDark && { backgroundColor: colors.darkGray }]} />

          {/* Logout */}
          <Pressable
            style={styles.menuItem}
            onPress={handleLogout}>
            <Ionicons
              name="log-out"
              size={24}
              color={colors.red}
            />
            <Text style={[styles.menuItemText, { color: colors.red }]}>
              {t('drawer.logout')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
