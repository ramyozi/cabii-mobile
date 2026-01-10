import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '@/theme';
import Button from '@/components/elements/Button';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import { ActiveRoleEnum } from '@ramyozi/cabii-shared';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGrayPurple,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    color: colors.gray,
  },
  subtitle: {
    fontSize: 16,
    color: colors.blackGray,
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default function NotFoundScreen() {
  const router = useRouter();
  const { t } = useTranslation()

return (
    <View style={styles.root}>
      <Stack.Screen options={{ title: t('common.errors.default') }} />
      <Text style={styles.title}>404</Text>
      <Text style={styles.subtitle}>{t('common.errors.default')}</Text>

      <Button
        title={t('home.welcome')}
        onPress={() => router.push('/')}
      />
    </View>
  );
}
