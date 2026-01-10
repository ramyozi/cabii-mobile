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
  summaryCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
    marginBottom: 30,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.green,
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

export default function DriverEarnings() {
  const router = useRouter();
  const { isDark } = useAppTheme();

  return (
    <ScrollView style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDark && { color: colors.white }]}>Earnings</Text>

        <View style={[styles.summaryCard, isDark && { backgroundColor: colors.darkGray }]}>
          <Text style={[styles.summaryTitle, isDark && { color: colors.white }]}>
            Total Earnings
          </Text>
          <Text style={styles.summaryAmount}>$0.00</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && { color: colors.white }]}>
            Breakdown
          </Text>
          <Button
            title="Daily Earnings"
            titleStyle={styles.buttonTitle}
            style={styles.button}
            onPress={() => router.push('/(driver)/earnings/daily')}
          />
          <Button
            title="Weekly Earnings"
            titleStyle={styles.buttonTitle}
            style={styles.button}
            onPress={() => router.push('/(driver)/earnings/weekly')}
          />
          <Button
            title="Earnings History"
            titleStyle={styles.buttonTitle}
            style={styles.button}
            onPress={() => router.push('/(driver)/earnings/history')}
          />
        </View>
      </View>
    </ScrollView>
  );
}
