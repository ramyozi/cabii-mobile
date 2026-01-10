import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '@/theme';
import { useAppTheme } from '@/plugin/theme-provider';
import { useAuth } from '@/plugin/auth-provider/use-auth';
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
  logoutButton: {
    backgroundColor: colors.red,
  },
});

export default function DriverProfile() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDark } = useAppTheme();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ScrollView style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDark && { color: colors.white }]}>
          {user?.firstName} {user?.lastName}
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && { color: colors.white }]}>
            {t('driver.profile.account')}
          </Text>
          <Button
            title={t('driver.profile.editProfile')}
            titleStyle={styles.buttonTitle}
            style={styles.button}
            onPress={() => router.push('/(driver)/profile/edit-profile')}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && { color: colors.white }]}>
            {t('driver.profile.driverInfo')}
          </Text>
          <Button
            title={t('driver.profile.myDocuments')}
            titleStyle={styles.buttonTitle}
            style={styles.button}
            onPress={() => router.push('/(driver)/profile/documents')}
          />
          <Button
            title={t('driver.profile.myVehicle')}
            titleStyle={styles.buttonTitle}
            style={styles.button}
            onPress={() => router.push('/(driver)/profile/vehicle')}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && { color: colors.white }]}>
            {t('driver.profile.settings')}
          </Text>
          <Button
            title={t('driver.profile.settings')}
            titleStyle={styles.buttonTitle}
            style={styles.button}
            onPress={() => router.push('/(driver)/profile/settings')}
          />
        </View>

        <Button
          title={t('driver.profile.signOut')}
          titleStyle={styles.buttonTitle}
          style={[styles.button, styles.logoutButton]}
          onPress={handleSignOut}
        />
      </View>
    </ScrollView>
  );
}
