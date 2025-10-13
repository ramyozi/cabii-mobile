import React from 'react';
import { View, Text } from 'react-native';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Button from '@/components/elements/Button';
import { colors } from '@/theme';
import FormTextInput from '@/components/elements/Form/FormTextInput';

type Form = {
  driver: {
    vehicles?: {
      brand: string;
      model: string;
      plate: string;
      color: string;
      chassisNumber: string;
      year?: number;
      categoryId: string;
    }[];
  };
};

export default function StepDriverVehicle() {
  const { t } = useTranslation();
  const { control } = useFormContext<Form>();
  const { fields, append, remove } = useFieldArray({ control, name: 'driver.vehicles' as const });

  return (
    <View>
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
        {t('auth.signForm.steps.vehicle')}
      </Text>

      {fields.length === 0 && <Text>{t('auth.signForm.messages.none')}</Text>}

      {/* wip
      {fields.map((f, idx) => (
        <View
          key={f.id}
          style={{ borderWidth: 1, borderColor: colors.gray, padding: 8, marginBottom: 8 }}>
          <FormTextInput
            name={`driver.vehicles.${idx}.brand`}
            label={t('auth.signForm.fields.vehicle_brand')}
          />
          <FormTextInput
            name={`driver.vehicles.${idx}.model`}
            label={t('auth.signForm.fields.vehicle_model')}
          />
          <FormTextInput
            name={`driver.vehicles.${idx}.plate`}
            label={t('auth.signForm.fields.vehicle_plate')}
          />
          <FormTextInput
            name={`driver.vehicles.${idx}.color`}
            label={t('auth.signForm.fields.vehicle_color')}
          />
          <FormTextInput
            name={`driver.vehicles.${idx}.chassisNumber`}
            label={t('auth.signForm.fields.vehicle_chassis')}
          />
          <FormTextInput
            name={`driver.vehicles.${idx}.year`}
            label={t('auth.signForm.fields.vehicle_year')}
          />
          <FormTextInput
            name={`driver.vehicles.${idx}.categoryId`}
            label={t('auth.signForm.fields.vehicle_category')}
          />
          <Button title={t('auth.signForm.actions.remove')} onPress={() => remove(idx)} />
        </View>
      ))}
      */}

      <Button
        title={t('auth.signForm.actions.addVehicle')}
        onPress={() =>
          append({ brand: '', model: '', plate: '', color: '', chassisNumber: '', categoryId: '' })
        }
      />
    </View>
  );
}
