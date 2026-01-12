import React, { useMemo, useState, useEffect } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/theme';
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
import { useAppTheme } from '@/plugin/theme-provider';
import { mapServerError } from '@/utils/serverErrorMapper';
import { useOnboardingProgress } from '@/hooks';

const ONBOARDING_CONTEXT_KEY = 'onboarding:context';

export default function Onboarding() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const router = useRouter();
  const { user, switchRole } = useAuth();
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

  const handleSubmit = async (data: OnboardingFormData) => {
    try {
      if (!user?.id) {
        Alert.alert(t('auth.signForm.messages.error'), t('auth.signForm.messages.noUser'));
        return;
      }

      if (data.selectedRole === ActiveRoleEnum.Customer) {
        await customerProfileService.create({ userId: user.id });
        await switchRole(ActiveRoleEnum.Customer);
      }

      if (data.selectedRole === ActiveRoleEnum.Driver) {
        const driverResponse = await driverProfileService.create({
          userId: user.id,
          driverLicenseSerial: data.driver.driverLicenseSerial,
        });

        // Upload documents and vehicles first
        for (const doc of data.driver.documents ?? []) {
          await driverDocumentService.upload({
            driverId: driverResponse.data.id,
            documentType: doc.type,
            filePath: doc.fileUrl,
            expiryDate: doc.expiryDate,
          });
        }

        for (const v of data.driver.vehicles ?? []) {
          await vehicleService.create({ ...v, driverId: driverResponse.data.id });
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
      const errorMessage = mapServerError(err, t);
      Alert.alert(t('auth.signForm.messages.error'), errorMessage);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.text }}>
      <MultiStepForm<OnboardingFormData>
        steps={steps}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onStepNext={handleStepNext}
      />
    </View>
  );
}
