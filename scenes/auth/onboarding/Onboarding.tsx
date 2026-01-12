import React, { useMemo, useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Button as PaperButton, Snackbar, useTheme, Card, Surface } from 'react-native-paper';

import { useAuth } from '@/plugin/auth-provider/use-auth';
import MultiStepForm, { StepConfig } from '@/components/elements/Form/MultiStepForm';
import { customerProfileService } from '@/services/customer-profile.service';
import { driverProfileService } from '@/services/driver-profile.service';
import { driverDocumentService } from '@/services/driver-document.service';
import { vehicleService } from '@/services/vehicle.service';
import StepRoleSelect from '@/scenes/auth/onboarding/steps/StepRoleSelect';
import StepDriverDocuments from '@/scenes/auth/onboarding/steps/StepDriverDocuments';
import StepDriverVehicle from '@/scenes/auth/onboarding/steps/StepDriverVehicle';
import StepSummaryDriver from '@/scenes/auth/onboarding/steps/StepSummaryDriver';
import {
  OnboardingFormData,
  schemaDriver,
  schemaRole,
} from '@/scenes/auth/onboarding/onboarding.schemas';
import { ActiveRoleEnum } from '@ramyozi/cabii-shared';
import { mapServerError } from '@/utils/serverErrorMapper';
import { useOnboardingProgress } from '@/hooks';

const ONBOARDING_CONTEXT_KEY = 'onboarding:context';

export default function Onboarding() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { user, switchRole } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [context, setContext] = useState<'signup' | 'role-switch'>('signup');
  const [initialValues, setInitialValues] = useState<OnboardingFormData>({
    selectedRole: ActiveRoleEnum.Customer,
    driver: { driverLicenseSerial: '', documents: [], vehicles: [] },
  });

  // Detect onboarding context and target role
  useEffect(() => {
    (async () => {
      try {
        const savedContext = await AsyncStorage.getItem(ONBOARDING_CONTEXT_KEY);

        if (savedContext === 'role-switch') {
          setContext('role-switch');
          // Pre-select driver role for role-switch flow
          setInitialValues({
            selectedRole: ActiveRoleEnum.Driver,
            driver: { driverLicenseSerial: '', documents: [], vehicles: [] },
          });
        }
      } catch (error) {
        console.error('Error detecting onboarding context:', error);
      }
    })();
  }, []);

  // Determine target role based on context
  const targetRole = context === 'role-switch' ? ActiveRoleEnum.Driver : ActiveRoleEnum.Customer;

  // Progress persistence hook
  const { saveProgress, clearProgress, progress } = useOnboardingProgress<OnboardingFormData>({
    userId: user?.id,
    targetRole,
    context,
  });

  // Restore progress if available (after context is determined)
  useEffect(() => {
    if (progress && progress.formData && progress.context === context) {
      setInitialValues(prev => ({
        ...prev,
        ...progress.formData,
      }));
    }
  }, [progress, context]);

  const steps: StepConfig<OnboardingFormData>[] = useMemo(
    () => [
      {
        id: 'role',
        title: t('auth.signForm.steps.role'),
        schema: schemaRole,
        component: StepRoleSelect,
        // Skip role selection if coming from role-switch (driver role pre-selected)
        when: () => context === 'signup',
      },
      {
        id: 'docs',
        title: t('auth.signForm.steps.docs'),
        schema: schemaDriver,
        component: StepDriverDocuments,
        when: d => d.selectedRole === ActiveRoleEnum.Driver,
      },
      {
        id: 'vehicle',
        title: t('auth.signForm.steps.vehicle'),
        schema: schemaDriver,
        component: StepDriverVehicle,
        when: d => d.selectedRole === ActiveRoleEnum.Driver,
        skippable: true,
      },
      {
        id: 'summary',
        title: t('auth.signForm.steps.summary'),
        component: StepSummaryDriver,
        when: d => d.selectedRole === ActiveRoleEnum.Driver,
      },
    ],
    [t, context],
  );

  // Save progress when moving to next step
  const handleStepNext = async (stepId: string, data: OnboardingFormData) => {
    try {
      const currentStepIndex = steps.findIndex(s => s.id === stepId);
      await saveProgress(currentStepIndex + 1, data);
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
      // Don't block navigation on save error
    }
  };

  // Allow user to skip onboarding and come back later
  const handleSkip = async () => {
    setServerError(null);
    try {
      if (!user?.id) {
        setServerError(t('auth.signForm.messages.noUser'));
        return;
      }

      // Save current progress (don't lose data)
      await saveProgress(0, initialValues);

      // Ensure user has a customer profile to land on
      try {
        await customerProfileService.create({ userId: user.id });
      } catch (error) {
        // Profile might already exist, that's OK
        console.log('Customer profile might already exist:', error);
      }

      // Switch to customer role (safe default)
      await switchRole(ActiveRoleEnum.Customer);

      // Clear onboarding context (but keep progress for resume)
      await AsyncStorage.removeItem(ONBOARDING_CONTEXT_KEY);

      // Redirect to app
      router.replace('/');
    } catch (err: any) {
      console.error('Error skipping onboarding:', err);
      setServerError(mapServerError(err, t));
    }
  };

  const handleSubmit = async (data: OnboardingFormData) => {
    setServerError(null);
    try {
      if (!user?.id) {
        setServerError(t('auth.signForm.messages.noUser'));
        return;
      }

      if (data.selectedRole === ActiveRoleEnum.Customer) {
        try {
          await customerProfileService.create({ userId: user.id });
        } catch (createError: any) {
          // Profile might already exist - that's OK, continue
          console.log('Customer profile creation note:', createError.message || createError);
          // Only fail if it's NOT a duplicate error
          if (!createError.message?.toLowerCase().includes('already exists')) {
            throw createError;
          }
        }
        await switchRole(ActiveRoleEnum.Customer);
      }

      if (data.selectedRole === ActiveRoleEnum.Driver) {
        // Validate driver license is provided
        if (!data.driver.driverLicenseSerial || data.driver.driverLicenseSerial.trim() === '') {
          setServerError(t('auth.signForm.messages.driverLicenseRequired'));
          return;
        }

        let driverProfileId: string;

        try {
          const driverResponse = await driverProfileService.create({
            userId: user.id,
            driverLicenseSerial: data.driver.driverLicenseSerial,
          });
          driverProfileId = driverResponse.data.id;
        } catch (createError: any) {
          // Profile might already exist - try to get existing profile
          console.log('Driver profile creation note:', createError.message || createError);
          if (createError.message?.toLowerCase().includes('already exists')) {
            // Get existing driver profile
            const existingProfiles = await driverProfileService.getAll();
            if (existingProfiles.data && existingProfiles.data.length > 0) {
              driverProfileId = existingProfiles.data[0].id;
            } else {
              throw createError;
            }
          } else {
            throw createError;
          }
        }

        // Upload documents and vehicles first
        for (const doc of data.driver.documents ?? []) {
          if (doc.fileUrl && doc.fileUrl.trim() !== '') {
            try {
              await driverDocumentService.upload({
                driverId: driverProfileId,
                documentType: doc.type,
                filePath: doc.fileUrl,
                expiryDate: doc.expiryDate,
              });
            } catch (docError: any) {
              console.error('Document upload error:', docError);
              // Continue with other documents even if one fails
            }
          }
        }

        for (const v of data.driver.vehicles ?? []) {
          if (v.brand && v.model && v.plate) {
            try {
              await vehicleService.create({ ...v, driverId: driverProfileId });
            } catch (vehicleError: any) {
              console.error('Vehicle creation error:', vehicleError);
              // Continue with other vehicles even if one fails
            }
          }
        }

        // Switch role only after all data is successfully uploaded
        await switchRole(ActiveRoleEnum.Driver);
      }

      // Clear onboarding context and progress
      await AsyncStorage.removeItem(ONBOARDING_CONTEXT_KEY);
      await clearProgress();

      // Redirect to root - index.tsx will handle role-based routing
      router.replace('/');
    } catch (err: any) {
      console.error('Onboarding error:', err);
      setServerError(mapServerError(err, t));
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.colors.background }]}
      behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Surface style={styles.surface} elevation={3}>
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.header}>
                  <Text
                    variant="headlineSmall"
                    style={[styles.title, { color: theme.colors.primary }]}>
                    {context === 'role-switch'
                      ? t('auth.signForm.titles.becomeDriver')
                      : t('auth.signForm.titles.setupProfile')}
                  </Text>
                  <PaperButton mode="text" onPress={handleSkip} compact>
                    {t('auth.signForm.actions.skipForNow')}
                  </PaperButton>
                </View>

                <MultiStepForm<OnboardingFormData>
                  steps={steps}
                  initialValues={initialValues}
                  onSubmit={handleSubmit}
                  onStepNext={handleStepNext}
                />
              </Card.Content>
            </Card>
          </Surface>
        </ScrollView>
      </TouchableWithoutFeedback>

      <Snackbar
        visible={!!serverError}
        onDismiss={() => setServerError(null)}
        action={{ label: 'OK', onPress: () => setServerError(null) }}
        duration={6000}
        style={{ backgroundColor: theme.colors.error }}>
        {serverError}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  surface: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    overflow: 'hidden',
  },
  card: { borderRadius: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
  },
});
