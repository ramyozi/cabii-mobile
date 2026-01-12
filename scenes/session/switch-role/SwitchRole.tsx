import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import { ActiveRoleEnum } from '@ramyozi/cabii-shared';
import {
  Card,
  Text,
  Surface,
  ActivityIndicator,
  Snackbar,
  Dialog,
  Button,
  Portal,
} from 'react-native-paper';
import { Car, User } from 'lucide-react-native';
import { useAppTheme } from '@/plugin/theme-provider';
import { mapServerError } from '@/utils/serverErrorMapper';
import { useProfileCheck } from '@/hooks';
import { customerProfileService } from '@/services/customer-profile.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_CONTEXT_KEY = 'onboarding:context';

export default function ChooseRoleScreen() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const router = useRouter();
  const { switchRole, user } = useAuth();
  const { checkProfileForRole } = useProfileCheck();
  const [loading, setLoading] = useState<ActiveRoleEnum | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDriverDialog, setShowDriverDialog] = useState(false);

  const handleSelect = async (role: ActiveRoleEnum) => {
    try {
      setLoading(role);
      setError(null);

      // Check if profile exists for target role
      const { hasProfile } = await checkProfileForRole(role);

      if (!hasProfile) {
        // Handle missing profile based on role
        if (role === ActiveRoleEnum.Driver) {
          // Driver profile missing - prompt user to create
          setShowDriverDialog(true);
          setLoading(null);
          return;
        } else if (role === ActiveRoleEnum.Customer) {
          // Customer profile missing - auto-create
          if (!user?.id) {
            setError(t('auth.signForm.messages.noUser'));
            setLoading(null);
            return;
          }

          await customerProfileService.create({ userId: user.id });
          // Profile created, continue with role switch
        }
      }

      // Profile exists or was just created - switch role
      await switchRole(role);
      await new Promise(res => setTimeout(res, 300));
      // Redirect to root - index.tsx will handle role-based routing
      router.replace('/');
    } catch (err: any) {
      console.error('Role switch error:', err);
      const errorMessage = mapServerError(err, t);
      setError(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  const handleCreateDriverProfile = async () => {
    try {
      setShowDriverDialog(false);
      setLoading(ActiveRoleEnum.Driver);

      // Store context for onboarding flow
      await AsyncStorage.setItem(ONBOARDING_CONTEXT_KEY, 'role-switch');

      // Navigate to onboarding with driver role pre-selected
      router.push('/(onboarding)');
    } catch (err: any) {
      console.error('Error navigating to driver onboarding:', err);
      setError(t('auth.signForm.messages.error'));
    } finally {
      setLoading(null);
    }
  };

  const handleCancelDriverProfile = () => {
    setShowDriverDialog(false);
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

      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        duration={5000}
        action={{
          label: t('common.dismiss'),
          onPress: () => setError(null),
        }}
        style={{ backgroundColor: theme.colors.error }}>
        {error}
      </Snackbar>

      <Portal>
        <Dialog visible={showDriverDialog} onDismiss={handleCancelDriverProfile}>
          <Dialog.Title>{t('auth.chooseRole.driverProfileMissing.title')}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {t('auth.chooseRole.driverProfileMissing.message')}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCancelDriverProfile}>
              {t('auth.chooseRole.driverProfileMissing.cancel')}
            </Button>
            <Button onPress={handleCreateDriverProfile} mode="contained">
              {t('auth.chooseRole.driverProfileMissing.create')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
