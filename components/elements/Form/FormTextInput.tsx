import React from 'react';
import { TextInput, Text, View, TextInputProps } from 'react-native';
import { Controller, useFormContext, FieldPath, FieldValues } from 'react-hook-form';
import { colors } from '@/theme';

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

  return (
    <View style={{ marginBottom: 12 }}>
      {label ? <Text style={{ marginBottom: 6 }}>{label}</Text> : null}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value as any}
            onChangeText={onChange}
            style={{
              borderWidth: 1,
              borderColor: message ? 'red' : colors.gray,
              borderRadius: 8,
              padding: 10,
              backgroundColor: colors.white,
              color: colors.blackGray,
            }}
            {...rest}
          />
        )}
      />
      {message ? <Text style={{ color: 'red', fontSize: 12 }}>{message}</Text> : null}
    </View>
  );
}
