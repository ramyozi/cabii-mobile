import React from 'react';
import { View, Text } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { colors } from '@/theme';

export default function StepSummaryDriver() {
  const { t } = useTranslation();
  const { watch } = useFormContext<any>();
  const data = watch();

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        {t('auth.signForm.steps.summary')}
      </Text>

      <Text style={{ color: colors.blackGray, fontWeight: '600' }}>
        {t('auth.signForm.fields.driverLicenseSerial')}:
      </Text>
      <Text>{data.driver.driverLicenseSerial || '—'}</Text>

      <Text style={{ marginTop: 12, fontWeight: '600' }}>
        {t('auth.signForm.fields.documents')}:
      </Text>
      {data.driver.documents?.length ? (
        data.driver.documents.map((d: any, i: number) => (
          <Text key={i}>
            - {d.type} ({d.expiryDate || '—'})
          </Text>
        ))
      ) : (
        <Text>({t('auth.signForm.messages.none')})</Text>
      )}

      <Text style={{ marginTop: 12, fontWeight: '600' }}>
        {t('auth.signForm.fields.vehicles')}:
      </Text>
      {data.driver.vehicles?.length ? (
        data.driver.vehicles.map((v: any, i: number) => (
          <Text key={i}>
            - {v.brand} {v.model} ({v.plate})
          </Text>
        ))
      ) : (
        <Text>({t('auth.signForm.messages.none')})</Text>
      )}
    </View>
  );
}
