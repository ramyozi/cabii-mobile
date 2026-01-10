import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
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
});

export default function PassengerWallet() {
  const router = useRouter();
  const { isDark } = useAppTheme();

  return (
    <ScrollView style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDark && { color: colors.white }]}>Wallet</Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && { color: colors.white }]}>
            Payment Methods
          </Text>
          <Button
            title="Manage Payment Methods"
            titleStyle={styles.buttonTitle}
            style={styles.button}
            onPress={() => router.push('/(passenger)/wallet/payment-methods')}
          />
          <Button
            title="Add Payment Method"
            titleStyle={styles.buttonTitle}
            style={styles.button}
            onPress={() => router.push('/(passenger)/wallet/add-payment-method')}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && { color: colors.white }]}>
            Transactions
          </Text>
          <Button
            title="View Transaction History"
            titleStyle={styles.buttonTitle}
            style={styles.button}
            onPress={() => router.push('/(passenger)/wallet/transaction-history')}
          />
        </View>
      </View>
    </ScrollView>
  );
}
