import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import FormTextInput from '@/components/elements/Form/FormTextInput';

export default function StepCommonInfo() {
  const { t } = useTranslation();
  return (
    <View>
      <FormTextInput name="firstname" label={t('auth.signForm.fields.firstname')} />
      <FormTextInput name="lastname" label={t('auth.signForm.fields.lastname')} />
      <FormTextInput
        name="email"
        label={t('auth.signForm.fields.email')}
        keyboardType="email-address"
      />
      <FormTextInput
        name="phone"
        label={t('auth.signForm.fields.phone')}
        keyboardType="phone-pad"
      />
      <FormTextInput name="password" label={t('auth.signForm.fields.password')} secureTextEntry />
    </View>
  );
}
