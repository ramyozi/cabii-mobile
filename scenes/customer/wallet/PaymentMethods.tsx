import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';
import { useAppTheme } from '@/plugin/theme-provider';

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
  description: {
    fontSize: 16,
  },
});

export default function PaymentMethods() {
  const { isDark } = useAppTheme();

  return (
    <View style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
      <Text style={[styles.title, isDark && { color: colors.white }]}>Payment Methods</Text>
      <Text style={[styles.description, isDark && { color: colors.gray }]}>
        Manage your saved credit cards, debit cards, and other payment methods.
      </Text>
    </View>
  );
}
