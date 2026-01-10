import React, { useMemo } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
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

export default function Onboarding() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const router = useRouter();
  const { user, switchRole } = useAuth();

  const steps: StepConfig<OnboardingFormData>[] = useMemo(
    () => [
      {
        id: 'role',
        title: t('auth.signForm.steps.role'),
        schema: schemaRole,
        component: StepRoleSelect,
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
    [t],
  );

  const initialValues: OnboardingFormData = {
    selectedRole: ActiveRoleEnum.Customer,
    driver: { driverLicenseSerial: '', documents: [], vehicles: [] },
  };

  const handleSubmit = async (data: OnboardingFormData) => {
    try {
      if (!user?.id) return;

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

      Alert.alert(t('auth.signForm.messages.success'));
      // Redirect to root - index.tsx will handle role-based routing
      router.replace('/');
    } catch (e) {
      console.error(e);
      Alert.alert(t('auth.signForm.messages.error'));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.text }}>
      <MultiStepForm<OnboardingFormData>
        steps={steps}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </View>
  );
}
