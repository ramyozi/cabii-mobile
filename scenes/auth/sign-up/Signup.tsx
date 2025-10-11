import React, { useMemo, useState } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { colors } from '@/theme';
import { ActiveRoleEnum, RoleEnum } from '@/plugin/auth-provider/auth-state';
import { userService } from '@/services/user.service';
import { customerProfileService } from '@/services/customer-profile.service';
import { driverProfileService } from '@/services/driver-profile.service';
import { driverDocumentService } from '@/services/driver-document.service';
import { vehicleService } from '@/services/vehicle.service';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import MultiStepForm, { StepConfig } from '@/components/elements/Form/MultiStepForm';
import StepCommonInfo from './steps/StepCommonInfo';
import StepRoleSelect from './steps/StepRoleSelect';
import StepDriverDocuments from './steps/StepDriverDocuments';
import StepDriverVehicle from './steps/StepDriverVehicle';
import StepSummaryDriver from './steps/StepSummaryDriver';
import { schemaCommon, schemaRole, schemaDriver, SignupFormData } from './signup.schemas';

export default function Signup() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signIn, switchRole } = useAuth();

  const [userCreated, setUserCreated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const initialValues: SignupFormData = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    selectedRole: ActiveRoleEnum.Customer,
    driver: { driverLicenseSerial: '', documents: [], vehicles: [] },
  };

  const steps: StepConfig<SignupFormData>[] = useMemo(
    () => [
      {
        id: 'common',
        title: t('auth.signForm.steps.common'),
        schema: schemaCommon,
        component: StepCommonInfo,
      },
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

  const handleSubmit = async (data: SignupFormData) => {
    try {
      if (!userCreated || !userId) return;

      if (data.selectedRole === ActiveRoleEnum.Customer) {
        await customerProfileService.create({ userId });
        await switchRole(ActiveRoleEnum.Customer);
      }

      if (data.selectedRole === ActiveRoleEnum.Driver) {
        const driver = await driverProfileService.create({
          userId,
          driverLicenseSerial: data.driver.driverLicenseSerial,
        });
        await switchRole(ActiveRoleEnum.Driver);

        for (const doc of data.driver.documents ?? []) {
          await driverDocumentService.upload({
            driverId: driver.id,
            documentType: doc.type,
            file: doc.fileUrl,
            expiryDate: doc.expiryDate,
          });
        }

        for (const v of data.driver.vehicles ?? []) {
          await vehicleService.create({ ...v, driverId: driver.id });
        }
      }

      Alert.alert(t('auth.signForm.messages.success'));
      router.replace('/(main)/(tabs)/home');
    } catch (e) {
      console.error(e);
      Alert.alert(t('auth.signForm.messages.error'));
    }
  };

  return (
    <View style={[styles.container]}>
      <MultiStepForm<SignupFormData>
        steps={steps}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onStepNext={async (stepId, data) => {
          if (stepId === 'common' && !userCreated) {
            const user = await userService.register({
              firstname: data.firstname,
              lastname: data.lastname,
              email: data.email,
              phone: data.phone,
              password: data.password,
              role: RoleEnum.USER,
            });

            setUserId(user.id);
            setUserCreated(true);

            await signIn(data.email, data.password, ActiveRoleEnum.Onboarding);

            Alert.alert(t('auth.signForm.messages.userCreated'));
          }
          return true;
        }}
        onStepBack={stepId => {
          if (userCreated && (stepId === 'role' || stepId === 'common')) return false;
          return true;
        }}
        lockedSteps={userCreated ? ['common', 'role'] : []}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightGrayPurple },
});
