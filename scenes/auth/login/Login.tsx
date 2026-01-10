import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Mail, Lock } from 'lucide-react-native';
import {
  Text,
  TextInput,
  Button,
  HelperText,
  Snackbar,
  useTheme,
  Card,
  Divider,
  Surface,
} from 'react-native-paper';

import { useAuth } from '@/plugin/auth-provider/use-auth';
import { createFormValidator } from '@/utils/formValidator';
import { mapServerError } from '@/utils/serverErrorMapper';

const v = createFormValidator();

const loginSchema = z.object({
  email: v.emailValidation(false),
  password: v.passwordValidation(2, 52),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { signIn } = useAuth();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginForm) => {
    setServerError(null);
    try {
      const result = await signIn(values.email, values.password);

      if ((result as any)?.pendingRoleSelection) {
        router.replace('/(session)/choose-role');
      } else {
        router.replace('/(main)/(tabs)/home');
      }
    } catch (error: any) {
      setServerError(mapServerError(error, t));
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.colors.background }]}
      behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Surface style={styles.surface} elevation={3}>
            <Card style={styles.card}>
              <Card.Content>
                <Text
                  variant="headlineLarge"
                  style={[styles.title, { color: theme.colors.primary }]}>
                  {t('auth.login.title')}
                </Text>

                <Divider style={styles.divider} />

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TextInput
                        label={t('auth.login.email')}
                        mode="outlined"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                        error={!!errors.email}
                        left={
                          <TextInput.Icon
                            icon={() => <Mail size={20} color={theme.colors.primary} />}
                          />
                        }
                      />
                      <HelperText type="error" visible={!!errors.email}>
                        {errors.email?.message}
                      </HelperText>
                    </>
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TextInput
                        label={t('auth.login.password')}
                        mode="outlined"
                        secureTextEntry
                        value={value}
                        onChangeText={onChange}
                        style={styles.input}
                        error={!!errors.password}
                        left={
                          <TextInput.Icon
                            icon={() => <Lock size={20} color={theme.colors.primary} />}
                          />
                        }
                      />
                      <HelperText type="error" visible={!!errors.password}>
                        {errors.password?.message}
                      </HelperText>
                    </>
                  )}
                />

                <Button
                  mode="contained"
                  loading={isSubmitting}
                  style={[styles.button, { backgroundColor: theme.colors.primary }]}
                  onPress={handleSubmit(onSubmit)}>
                  {t('auth.login.signIn')}
                </Button>

                <Text
                  variant="bodyMedium"
                  style={[styles.link, { color: theme.colors.primary }]}
                  onPress={() => router.push('/(auth)/sign-up')}>
                  {t('auth.login.noAccount')}
                </Text>
              </Card.Content>
            </Card>
          </Surface>
        </ScrollView>
      </TouchableWithoutFeedback>

      <Snackbar
        visible={!!serverError}
        onDismiss={() => setServerError(null)}
        action={{ label: 'OK', onPress: () => setServerError(null) }}
        style={{ backgroundColor: theme.colors.error }}>
        {serverError}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  surface: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    overflow: 'hidden',
  },
  card: { borderRadius: 20 },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: { marginBottom: 16 },
  input: { marginBottom: 8 },
  button: { marginTop: 20, borderRadius: 8 },
  link: {
    textAlign: 'center',
    marginTop: 24,
    textDecorationLine: 'underline',
  },
});
