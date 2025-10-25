import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import { ActiveRoleEnum } from '@ramyozi/cabii-shared';
import { Card, Text, Surface, ActivityIndicator } from 'react-native-paper';
import { Car, User } from 'lucide-react-native';
import { useAppTheme } from '@/plugin/theme-provider';

export default function ChooseRoleScreen() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const router = useRouter();
  const { switchRole } = useAuth();
  const [loading, setLoading] = useState<ActiveRoleEnum | null>(null);

  const handleSelect = async (role: ActiveRoleEnum) => {
    try {
      setLoading(role);
      await switchRole(role);
      await new Promise(res => setTimeout(res, 300));
      router.replace('/(main)/(tabs)');
    } finally {
      setLoading(null);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.surface} elevation={3}>
        <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.primary }]}>
          {t('auth.chooseRole.title')}
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {t('auth.chooseRole.subtitle')}
        </Text>

        <View style={styles.cardContainer}>
          <Card
            style={[
              styles.card,
              { borderColor: theme.colors.primary, backgroundColor: theme.colors.surface },
            ]}
            onPress={() => handleSelect(ActiveRoleEnum.Driver)}>
            <Card.Content style={styles.cardContent}>
              <Car size={40} color={theme.colors.primary} />
              <Text style={styles.roleTitle}>{t('auth.signForm.roles.driver')}</Text>
              <Text style={styles.roleDesc}>{t('auth.chooseRole.driverDesc')}</Text>
              {loading === ActiveRoleEnum.Driver && (
                <ActivityIndicator
                  animating
                  color={theme.colors.primary}
                  style={{ marginTop: 8 }}
                />
              )}
            </Card.Content>
          </Card>

          <Card
            style={[
              styles.card,
              { borderColor: theme.colors.primary, backgroundColor: theme.colors.surface },
            ]}
            onPress={() => handleSelect(ActiveRoleEnum.Customer)}>
            <Card.Content style={styles.cardContent}>
              <User size={40} color={theme.colors.primary} />
              <Text style={styles.roleTitle}>{t('auth.signForm.roles.customer')}</Text>
              <Text style={styles.roleDesc}>{t('auth.chooseRole.customerDesc')}</Text>
              {loading === ActiveRoleEnum.Customer && (
                <ActivityIndicator
                  animating
                  color={theme.colors.primary}
                  style={{ marginTop: 8 }}
                />
              )}
            </Card.Content>
          </Card>
        </View>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  surface: {
    padding: 20,
    borderRadius: 16,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  cardContainer: {
    gap: 16,
    marginBottom: 20,
  },
  card: {
    borderWidth: 1.5,
    borderRadius: 16,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  roleTitle: {
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 18,
  },
  roleDesc: {
    textAlign: 'center',
    marginTop: 6,
    color: '#777',
  },
});
