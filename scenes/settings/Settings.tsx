import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { useAppTheme } from '@/plugin/theme-provider';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.lightGrayPurple,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.darkGray,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 14,
    color: colors.gray,
  },
  optionsContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  optionLabel: {
    fontSize: 16,
  },
  selectedOption: {
    backgroundColor: colors.lightPurple,
  },
});

const LANGUAGE_STORAGE_KEY = '@app_language';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useAppTheme();
  const [showLanguages, setShowLanguages] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved && saved !== currentLanguage) {
        await i18n.changeLanguage(saved);
        setCurrentLanguage(saved);
      }
    } catch (error) {
      console.error('Failed to load language:', error);
    }
  };

  const changeLanguage = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setCurrentLanguage(lang);
      setShowLanguages(false);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const getLanguageLabel = (code: string) => {
    switch (code) {
      case 'en':
        return 'English';
      case 'fr':
        return 'Français';
      default:
        return code;
    }
  };

  return (
    <ScrollView style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDark && { color: colors.white }]}>
          {t('settings.title')}
        </Text>

        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && { color: colors.gray }]}>
            {t('settings.preferences')}
          </Text>

          <Pressable
            style={[styles.settingItem, isDark && { backgroundColor: colors.darkGray }]}
            onPress={() => setShowLanguages(!showLanguages)}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="language"
                size={24}
                color={isDark ? colors.white : colors.darkPurple}
              />
              <View>
                <Text style={[styles.settingLabel, isDark && { color: colors.white }]}>
                  {t('settings.language')}
                </Text>
                <Text style={[styles.settingValue, isDark && { color: colors.gray }]}>
                  {getLanguageLabel(currentLanguage)}
                </Text>
              </View>
            </View>
            <Ionicons
              name={showLanguages ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.gray}
            />
          </Pressable>

          {showLanguages && (
            <View style={[styles.optionsContainer, isDark && { backgroundColor: colors.darkGray }]}>
              {['en', 'fr'].map((lang) => (
                <Pressable
                  key={lang}
                  style={[
                    styles.option,
                    currentLanguage === lang && styles.selectedOption,
                    isDark && { borderBottomColor: colors.blackGray },
                  ]}
                  onPress={() => changeLanguage(lang)}>
                  <Text style={[styles.optionLabel, isDark && { color: colors.white }]}>
                    {getLanguageLabel(lang)}
                  </Text>
                  {currentLanguage === lang && (
                    <Ionicons name="checkmark" size={20} color={colors.white} />
                  )}
                </Pressable>
              ))}
            </View>
          )}

          {/* Theme Settings */}
          <Pressable
            style={[
              styles.settingItem,
              isDark && { backgroundColor: colors.darkGray },
              { marginTop: 8 },
            ]}
            onPress={toggleTheme}>
            <View style={styles.settingLeft}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny'}
                size={24}
                color={isDark ? colors.white : colors.darkPurple}
              />
              <View>
                <Text style={[styles.settingLabel, isDark && { color: colors.white }]}>
                  {t('settings.theme')}
                </Text>
                <Text style={[styles.settingValue, isDark && { color: colors.gray }]}>
                  {isDark ? t('settings.darkMode') : t('settings.lightMode')}
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.gray}
            />
          </Pressable>
        </View>

        {/* Other Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && { color: colors.gray }]}>
            {t('settings.account')}
          </Text>

          <Pressable style={[styles.settingItem, isDark && { backgroundColor: colors.darkGray }]}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="notifications"
                size={24}
                color={isDark ? colors.white : colors.darkPurple}
              />
              <Text style={[styles.settingLabel, isDark && { color: colors.white }]}>
                {t('settings.notifications')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </Pressable>

          <Pressable
            style={[
              styles.settingItem,
              isDark && { backgroundColor: colors.darkGray },
              { marginTop: 8 },
            ]}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="shield-checkmark"
                size={24}
                color={isDark ? colors.white : colors.darkPurple}
              />
              <Text style={[styles.settingLabel, isDark && { color: colors.white }]}>
                {t('settings.privacy')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Pressable style={[styles.settingItem, isDark && { backgroundColor: colors.darkGray }]}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="information-circle"
                size={24}
                color={isDark ? colors.white : colors.darkPurple}
              />
              <Text style={[styles.settingLabel, isDark && { color: colors.white }]}>
                {t('settings.about')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
