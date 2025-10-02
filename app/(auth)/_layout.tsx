import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Auth' }} />
      <Stack.Screen name="login/index" options={{ title: 'Login' }} />
      <Stack.Screen name="sign-in/index" options={{ title: 'Register' }} />
      <Stack.Screen name="reset-password/index" options={{ title: 'Reset Password' }} />
    </Stack>
  );
}
