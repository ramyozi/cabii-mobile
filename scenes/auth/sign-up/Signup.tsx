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
import { ActiveRoleEnum, RoleEnum } from '@cabii/shared';

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
      const user = await userService.create({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: RoleEnum.User,
      });

      await signIn(data.email, data.password, ActiveRoleEnum.Onboarding);
      Alert.alert(t('auth.signForm.messages.userCreated'));
      router.replace('/onboarding');
    } catch (err) {
      console.error(err);
      Alert.alert(t('auth.signForm.messages.error'));
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
