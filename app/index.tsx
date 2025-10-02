import { Redirect } from 'expo-router';
import { useAppSlice } from '@/slices';

export default function Index() {
  const { loggedIn, checked } = useAppSlice();

  if (!checked) return null;

  if (loggedIn) {
    return <Redirect href="/(main)/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
