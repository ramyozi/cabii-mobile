import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login/index" />
      <Stack.Screen name="register/index" options={{ title: 'Register' }} />
      <Stack.Screen name="reset-password/index" options={{ title: 'Reset Password' }} />
    </Stack>
  );
}
