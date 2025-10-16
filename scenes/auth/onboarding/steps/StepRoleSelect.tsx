import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { colors } from '@/theme';
import { useTranslation } from 'react-i18next';
import { ActiveRoleEnum } from '@ramyozi/cabii-shared';

export default function StepRoleSelect() {
  const { register, setValue, watch } = useFormContext<any>();
  const value = watch('role');
  const { t } = useTranslation();

  const roles = [
    { id: ActiveRoleEnum.Customer, label: t('auth.signForm.roles.customer') },
    { id: ActiveRoleEnum.Driver, label: t('auth.signForm.roles.driver') },
  ];

  React.useEffect(() => {
    register('selectedRole' as any);
  }, [register]);

  return (
    <View>
      {roles.map(r => (
        <Pressable
          key={r.id}
          onPress={() =>
            setValue('selectedRole', r.id, { shouldDirty: true, shouldValidate: true })
          }
          style={{
            padding: 16,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: value === r.id ? colors.lightPurple : colors.gray,
            marginBottom: 12,
          }}>
          <Text>{r.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
