import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

export default function DriverDashboard() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDark } = useAppTheme();
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    tripsToday: 0,
    earningsToday: 0,
    availableRides: 0,
  });

  // TODO: Fetch real data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // API call would go here
        // const response = await driverService.getDashboardStats();
        // setStats(response.data);

        // Mock data for now
        setStats({
          tripsToday: 0,
          earningsToday: 0,
          availableRides: 0,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <ScrollView style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDark && { color: colors.white }]}>
          {t('driver.dashboard.title')}
        </Text>

        <View style={[styles.statusSection, isDark && { backgroundColor: colors.darkGray }]}>
          <Text
            style={[
              styles.statusText,
              { color: isOnline ? colors.green : colors.gray },
            ]}>
            {t('driver.dashboard.status')}: {isOnline ? t('driver.dashboard.online') : t('driver.dashboard.offline')}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.darkPurple} />
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDark && { color: colors.white }]}>
                {t('driver.dashboard.availableRides')}
              </Text>
              {stats.availableRides > 0 ? (
                <Button
                  title={t('driver.dashboard.viewAvailableRides')}
                  titleStyle={styles.buttonTitle}
                  style={styles.button}
                  onPress={() => router.push('/(driver-app)/(tabs)/dashboard/available-rides')}
                />
              ) : (
                <Text style={[{ fontSize: 14 }, isDark && { color: colors.gray }]}>
                  {t('driver.dashboard.noRides')}
                </Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDark && { color: colors.white }]}>
                {t('driver.dashboard.todaySummary')}
              </Text>
              <View style={styles.statsContainer}>
                <View style={[styles.statBox, isDark && { backgroundColor: colors.darkGray }]}>
                  <Text style={[styles.statLabel, isDark && { color: colors.gray }]}>
                    {t('driver.dashboard.trips')}
                  </Text>
                  <Text style={[styles.statValue, isDark && { color: colors.white }]}>
                    {stats.tripsToday || 0}
                  </Text>
                </View>
                <View style={[styles.statBox, isDark && { backgroundColor: colors.darkGray }]}>
                  <Text style={[styles.statLabel, isDark && { color: colors.gray }]}>
                    {t('driver.dashboard.earnings')}
                  </Text>
                  <Text style={[styles.statValue, isDark && { color: colors.white }]}>
                    ${(stats.earningsToday || 0).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
