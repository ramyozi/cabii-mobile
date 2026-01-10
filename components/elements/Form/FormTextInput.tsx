import React from 'react';
import { TextInput, Text, View, TextInputProps } from 'react-native';
import { Controller, useFormContext, FieldPath, FieldValues } from 'react-hook-form';
import { useAppTheme } from '@/plugin/theme-provider';

type Props<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: string;
} & Omit<TextInputProps, 'onChangeText' | 'value'>;

export default function FormTextInput<T extends FieldValues>({ name, label, ...rest }: Props<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const err = errors && (errors as any)[name];
  const message = err?.message ? String(err.message) : undefined;

  const { theme } = useAppTheme();

  return (
    <View style={{ marginBottom: 12 }}>
      {label ? (
        <Text style={{ marginBottom: 6, color: theme.colors.text, fontWeight: '600' }}>
          {label}
        </Text>
      ) : null}

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={(value as any) ?? ''}
            onChangeText={onChange}
            placeholderTextColor={theme.colors.outline}
            style={{
              borderWidth: 1,
              borderColor: message ? theme.colors.error : theme.colors.outline,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 12,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              fontSize: 16,
            }}
            {...rest}
          />
        )}
      />

      {message ? (
        <Text style={{ color: theme.colors.error, fontSize: 12, marginTop: 4 }}>{message}</Text>
      ) : null}
    </View>
  );
}
