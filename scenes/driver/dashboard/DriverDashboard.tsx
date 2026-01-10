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
  statusSection: {
    marginBottom: 30,
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
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

export default function DriverDashboard() {
  const router = useRouter();
  const { isDark } = useAppTheme();

  return (
    <ScrollView style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDark && { color: colors.white }]}>Dashboard</Text>

        <View style={[styles.statusSection, isDark && { backgroundColor: colors.darkGray }]}>
          <Text style={[styles.statusText, { color: colors.green }]}>Status: Online</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && { color: colors.white }]}>
            Available Rides
          </Text>
          <Button
            title="View Available Rides"
            titleStyle={styles.buttonTitle}
            style={styles.button}
            onPress={() => router.push('/(driver)/dashboard/available-rides')}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && { color: colors.white }]}>
            Today's Summary
          </Text>
          <Text style={[{ fontSize: 14 }, isDark && { color: colors.gray }]}>
            Trips: 0 | Earnings: $0.00
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
