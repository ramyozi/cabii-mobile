import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
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

export default function PassengerHome() {
  const router = useRouter();
  const { isDark } = useAppTheme();

  return (
    <View style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
      <Text style={[styles.title, isDark && { color: colors.white }]}>Welcome Passenger</Text>
      <Text style={[styles.subtitle, isDark && { color: colors.gray }]}>
        Choose your service
      </Text>
      <Button
        title="Book a Ride"
        titleStyle={styles.buttonTitle}
        style={styles.button}
        onPress={() => router.push('/(passenger)/home/book-ride')}
      />
      <Button
        title="Book a Delivery"
        titleStyle={styles.buttonTitle}
        style={styles.button}
        onPress={() => router.push('/(passenger)/home/book-delivery')}
      />
    </View>
  );
}
