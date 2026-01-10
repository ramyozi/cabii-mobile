import React, { useState } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { colors } from '@/theme';
import { userService } from '@/services/user.service';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import MultiStepForm, { StepConfig } from '@/components/elements/Form/MultiStepForm';
import StepCommonInfo from './steps/StepCommonInfo';
import { schemaCommon, SignupFormData } from './signup.schemas';
import { ActiveRoleEnum, RoleEnum } from '@ramyozi/cabii-shared';
import { mapServerError } from '@/utils/serverErrorMapper';

export default function Signup() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signIn } = useAuth();

  const [creating, setCreating] = useState(false);

  const steps: StepConfig<SignupFormData>[] = [
    {
      id: 'common',
      title: t('auth.signForm.steps.common'),
      schema: schemaCommon,
      component: StepCommonInfo,
    },
  ];

  const initialValues: SignupFormData = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
  };

  const handleSubmit = async (data: SignupFormData) => {
    try {
      setCreating(true);

      // Create user account
      await userService.create({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: RoleEnum.User,
      });

      // Sign in and handle result
      const result = await signIn(data.email, data.password);

      // Handle different signin results
      if ((result as any)?.pendingRoleSelection) {
        // Multiple profiles exist - go to role selection
        router.replace('/(session)/choose-role');
      } else {
        // New user or single profile - redirect to root (will handle routing)
        router.replace('/');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      const errorMessage = mapServerError(err, t);
      Alert.alert(t('auth.signForm.messages.error'), errorMessage);
    } finally {
      setCreating(false);
    }
  };

  return (
    <View style={styles.container}>
      <MultiStepForm steps={steps} initialValues={initialValues} onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightGrayPurple },
});
