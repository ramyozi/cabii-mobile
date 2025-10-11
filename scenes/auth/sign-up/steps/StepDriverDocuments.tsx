import React from 'react';
import { View, Text } from 'react-native';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Button from '@/components/elements/Button';
import FormTextInput from '@/components/elements/Form/FormTextInput';
import { DriverDocumentTypeEnum } from '@/types/document';

export default function StepDriverDocuments() {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'driver.documents' });

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
        {t('auth.signForm.fields.driverLicenseSerial')}
      </Text>
      <FormTextInput name="driver.driverLicenseSerial" label="N° Permis de conduire" />

      <Text style={{ fontSize: 18, fontWeight: '600', marginVertical: 8 }}>
        {t('auth.signForm.fields.documents')}
      </Text>

      {/* wip
          {fields.map((field, index) => (
            <View key={field.id} style={{ marginBottom: 12 }}>
              <FormTextInput
                name={`driver.documents.${index}.fileUrl`}
                label={t('auth.signForm.fields.fileUrl')}
              />
              <FormTextInput
                name={`driver.documents.${index}.expiryDate`}
                label={t('auth.signForm.fields.expiryDate')}
              />
              <FormTextInput
                name={`driver.documents.${index}.type`}
                label={t('auth.signForm.fields.type')}
                placeholder={Object.values(DriverDocumentTypeEnum).join(', ')}
              />
              <Button
                title={t('auth.signForm.actions.remove')}
                onPress={() => remove(index)}
                style={{ marginTop: 8, backgroundColor: '#ff5555' }}
              />
            </View>
          ))}
        */}
      <Button
        title={t('auth.signForm.actions.addDocument')}
        onPress={() =>
          append({
            type: DriverDocumentTypeEnum.ID_CARD,
            fileUrl: '',
            expiryDate: '',
          })
        }
      />
    </View>
  );
}
