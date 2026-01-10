import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { useAppTheme } from '@/plugin/theme-provider';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import { ActiveRoleEnum } from '@ramyozi/cabii-shared';

const LANGUAGE_STORAGE_KEY = '@cabii:language';

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
  settingsGroup: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingsLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  languageButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: colors.darkPurple,
    borderColor: colors.darkPurple,
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  languageButtonTextActive: {
    color: colors.white,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  themeToggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default function DrawerContents() {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useAppTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const handleSwitchRole = () => {
    router.push('/(session)/choose-role');
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    setCurrentLanguage(lang);
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

          {/* Language Selector */}
          <View style={styles.settingsGroup}>
            <Text
              style={[
                styles.settingsLabel,
                isDark ? { color: colors.gray } : { color: colors.darkGray },
              ]}>
              {t('settings.language')}
            </Text>
            <View style={styles.languageButtons}>
              <Pressable
                style={[
                  styles.languageButton,
                  currentLanguage === 'fr' && styles.languageButtonActive,
                  isDark && { borderColor: colors.darkGray },
                ]}
                onPress={() => changeLanguage('fr')}>
                <Text
                  style={[
                    styles.languageButtonText,
                    currentLanguage === 'fr' && styles.languageButtonTextActive,
                    isDark && { color: colors.white },
                    currentLanguage === 'fr' && { color: colors.white },
                  ]}>
                  Français
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.languageButton,
                  currentLanguage === 'en' && styles.languageButtonActive,
                  isDark && { borderColor: colors.darkGray },
                ]}
                onPress={() => changeLanguage('en')}>
                <Text
                  style={[
                    styles.languageButtonText,
                    currentLanguage === 'en' && styles.languageButtonTextActive,
                    isDark && { color: colors.white },
                    currentLanguage === 'en' && { color: colors.white },
                  ]}>
                  English
                </Text>
              </Pressable>
            </View>

            {/* Theme Toggle */}
            <Text
              style={[
                styles.settingsLabel,
                isDark ? { color: colors.gray } : { color: colors.darkGray },
              ]}>
              {t('settings.theme')}
            </Text>
            <Pressable
              style={[styles.themeToggle, isDark && { borderColor: colors.darkGray }]}
              onPress={toggleTheme}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons
                  name={isDark ? 'moon' : 'sunny'}
                  size={20}
                  color={isDark ? colors.white : colors.darkPurple}
                />
                <Text style={[styles.themeToggleText, isDark && { color: colors.white }]}>
                  {isDark ? t('settings.darkMode') : t('settings.lightMode')}
                </Text>
              </View>
              <Ionicons
                name="swap-horizontal"
                size={20}
                color={isDark ? colors.gray : colors.darkGray}
              />
            </Pressable>
          </View>

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
