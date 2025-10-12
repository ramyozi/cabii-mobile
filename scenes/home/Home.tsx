import { StyleSheet, Text, View } from 'react-native';
import useColorScheme from '@/hooks/useColorScheme';
import Button from '@/components/elements/Button';
import { useRouter } from 'expo-router';
import { colors } from '@/theme';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/plugin/auth-provider/use-auth';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGrayPurple,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonTitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: colors.lightPurple,
    height: 44,
    width: '50%',
  },
});

export default function Home() {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const router = useRouter();
  const { isDark } = useColorScheme();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace({ pathname: '(auth)/login' });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
      <Text style={[styles.title, isDark && { color: colors.gray }]}>{t('home.welcome')}</Text>
      <Button
        title="log out"
        titleStyle={[styles.buttonTitle, isDark && { color: colors.blackGray }]}
        style={styles.button}
        onPress={() => {
          handleSignOut();
        }}
      />
      <Button
        title="Go to Details"
        titleStyle={[styles.buttonTitle, isDark && { color: colors.blackGray }]}
        style={styles.button}
        onPress={() =>
          router.push({ pathname: '(main)/(tabs)/home/details', params: { from: 'Home' } })
        }
      />
    </View>
  );
}
