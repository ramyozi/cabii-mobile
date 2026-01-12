import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { User, Mail, Phone, Lock } from 'lucide-react-native';

import { userService } from '@/services/user.service';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import { RoleEnum } from '@ramyozi/cabii-shared';
import { mapServerError } from '@/utils/serverErrorMapper';
import { createFormValidator } from '@/utils/formValidator';

const v = createFormValidator();

const signupSchema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
  email: v.emailValidation(false),
  phone: z.string().min(1, 'Phone is required'),
  password: v.passwordValidation(2, 52),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { signIn } = useAuth();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignupForm) => {
    setServerError(null);
    try {
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
      setServerError(mapServerError(err, t));
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
                  {t('auth.signup.title')}
                </Text>

                <Divider style={styles.divider} />

                <Controller
                  control={control}
                  name="firstname"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TextInput
                        label={t('auth.signForm.fields.firstname')}
                        mode="outlined"
                        value={value}
                        onChangeText={onChange}
                        style={styles.input}
                        error={!!errors.firstname}
                        left={
                          <TextInput.Icon
                            icon={() => <User size={20} color={theme.colors.primary} />}
                          />
                        }
                      />
                      <HelperText type="error" visible={!!errors.firstname}>
                        {errors.firstname?.message}
                      </HelperText>
                    </>
                  )}
                />

                <Controller
                  control={control}
                  name="lastname"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TextInput
                        label={t('auth.signForm.fields.lastname')}
                        mode="outlined"
                        value={value}
                        onChangeText={onChange}
                        style={styles.input}
                        error={!!errors.lastname}
                        left={
                          <TextInput.Icon
                            icon={() => <User size={20} color={theme.colors.primary} />}
                          />
                        }
                      />
                      <HelperText type="error" visible={!!errors.lastname}>
                        {errors.lastname?.message}
                      </HelperText>
                    </>
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TextInput
                        label={t('auth.signForm.fields.email')}
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
                  name="phone"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TextInput
                        label={t('auth.signForm.fields.phone')}
                        mode="outlined"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="phone-pad"
                        style={styles.input}
                        error={!!errors.phone}
                        left={
                          <TextInput.Icon
                            icon={() => <Phone size={20} color={theme.colors.primary} />}
                          />
                        }
                      />
                      <HelperText type="error" visible={!!errors.phone}>
                        {errors.phone?.message}
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
                        label={t('auth.signForm.fields.password')}
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
                  {t('auth.signup.createAccount')}
                </Button>

                <Text
                  variant="bodyMedium"
                  style={[styles.link, { color: theme.colors.primary }]}
                  onPress={() => router.back()}>
                  {t('auth.signup.haveAccount')}
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
        duration={6000}
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
