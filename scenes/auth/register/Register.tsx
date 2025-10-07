import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
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

const registerSchema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(6, 'Invalid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { t } = useTranslation();
  const { isDark } = useColorScheme();
  const router = useRouter();
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (values: RegisterForm) => {
    try {
      await userService.register(values);
      // TODO: later, depending on what login form we use, role can be dynamic
      await signIn(values.email, values.password, 'customer');
      router.replace('/(main)/(tabs)/home');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}
      behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.title, isDark && { color: colors.gray }]}>
          {t('auth.sign_up_title', 'Create Account')}
        </Text>

        {(['firstname', 'lastname', 'email', 'phone', 'password'] as const).map(field => (
          <Controller
            key={field}
            control={control}
            name={field}
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  style={[styles.input, isDark && styles.inputDark]}
                  placeholder={t(`auth.${field}`, field)}
                  placeholderTextColor={isDark ? colors.gray : '#888'}
                  autoCapitalize={field === 'email' ? 'none' : 'words'}
                  keyboardType={field === 'phone' ? 'phone-pad' : 'default'}
                  secureTextEntry={field === 'password'}
                  value={value}
                  onChangeText={onChange}
                />
                {errors[field] && <Text style={styles.error}>{errors[field]?.message}</Text>}
              </>
            )}
          />
        ))}

        <Button
          title={isSubmitting ? t('auth.signing_up', 'Creating...') : t('auth.sign_up', 'Sign Up')}
          style={styles.button}
          titleStyle={styles.buttonTitle}
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />

        <Text
          onPress={() => router.push('/(auth)/login')}
          style={[styles.link, isDark && { color: colors.lightPurple }]}>
          {t('auth.already_have_account', 'Already have an account? Sign in')}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.lightGrayPurple },
  scrollContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
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
    backgroundColor: colors.blackGray,
    color: colors.white,
  },
  error: { color: 'red', fontSize: 13, marginBottom: 5 },
  button: {
    marginTop: 10,
    backgroundColor: colors.lightPurple,
    height: 48,
    borderRadius: 25,
    justifyContent: 'center',
    width: '100%',
  },
  buttonTitle: { fontSize: 16, color: colors.white, textAlign: 'center' },
  link: { textAlign: 'center', marginTop: 20, fontSize: 14, color: colors.darkPurple },
});
