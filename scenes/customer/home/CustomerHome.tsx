import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '@/theme';
import { useAppTheme } from '@/plugin/theme-provider';
import Button from '@/components/elements/Button';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.lightGrayPurple,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.darkPurple,
    marginBottom: 12,
  },
  buttonTitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
  },
});

export default function CustomerHome() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDark } = useAppTheme();

  return (
    <View style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
      <Text style={[styles.title, isDark && { color: colors.white }]}>
        {t('home.welcome')}
      </Text>
      <Text style={[styles.subtitle, isDark && { color: colors.gray }]}>
        {t('customer.home.whereToGo')}
      </Text>
      <Button
        title={t('customer.home.bookRide')}
        titleStyle={styles.buttonTitle}
        style={styles.button}
        onPress={() => router.push('/(customer-app)/(tabs)/home/book-ride')}
      />
      <Button
        title={t('customer.home.bookDelivery')}
        titleStyle={styles.buttonTitle}
        style={styles.button}
        onPress={() => router.push('/(customer-app)/(tabs)/home/book-delivery')}
      />
    </View>
  );
}
