import React from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userService } from '@/services/user.service';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import { colors } from '@/theme';
import useColorScheme from '@/hooks/useColorScheme';
import Button from '@/components/elements/Button';
import { useTranslation } from 'react-i18next';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(2, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDark } = useColorScheme();
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginForm) => {
    try {
      await signIn(values.email, values.password, 'CUSTOMER');
      router.replace('/(main)/(tabs)/home');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}
      behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <View style={styles.container}>
        <Text style={[styles.title, isDark && { color: colors.gray }]}>
          {t('auth.sign_in_title', 'Sign In')}
        </Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder={t('auth.email', 'Email')}
                placeholderTextColor={isDark ? colors.gray : '#888'}
                autoCapitalize="none"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
              />
              {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
            </>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder={t('auth.password', 'Password')}
                placeholderTextColor={isDark ? colors.gray : '#888'}
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
              {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
            </>
          )}
        />

        <Button
          title={
            isSubmitting ? t('auth.signing_in', 'Signing in...') : t('auth.sign_in', 'Sign In')
          }
          style={styles.button}
          titleStyle={styles.buttonTitle}
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />

        <Text
          onPress={() => router.push('/(auth)/register')}
          style={[styles.link, isDark && { color: colors.lightPurple }]}>
          {t('auth.no_account', "Don't have an account? Sign up")}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightGrayPurple,
  },
  container: {
    width: '80%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 10,
    color: colors.blackGray,
    backgroundColor: colors.white,
  },
  inputDark: {
    borderColor: colors.darkPurple,
    color: colors.white,
    backgroundColor: colors.blackGray,
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: colors.lightPurple,
    height: 48,
    borderRadius: 25,
    justifyContent: 'center',
  },
  buttonTitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: colors.darkPurple,
  },
});
