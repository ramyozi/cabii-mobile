import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '@/theme';
import { useAppTheme } from '@/plugin/theme-provider';
import Button from '@/components/elements/Button';

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
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.darkPurple,
    marginBottom: 8,
  },
  buttonTitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
  },
  placeholder: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default function CurrentTrip() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDark } = useAppTheme();

  return (
    <ScrollView style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDark && { color: colors.white }]}>
          {t('driver.current.title')}
        </Text>

        <View style={styles.section}>
          <Text style={[styles.placeholder, isDark && { color: colors.gray }]}>
            {t('driver.current.noActiveTrip')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && { color: colors.white }]}>
            {t('driver.current.quickActions')}
          </Text>
          <Button
            title={t('driver.current.openNavigation')}
            titleStyle={styles.buttonTitle}
            style={styles.button}
            onPress={() => router.push('/(driver-app)/current/navigation')}
          />
          <Button
            title={t('driver.current.viewTripSummary')}
            titleStyle={styles.buttonTitle}
            style={styles.button}
            onPress={() => router.push('/(driver-app)/current/trip-summary')}
          />
        </View>
      </View>
    </ScrollView>
  );
}
