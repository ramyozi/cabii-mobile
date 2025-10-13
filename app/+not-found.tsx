import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';
import Button from '@/components/elements/Button';
import { useRouter } from 'expo-router';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGrayPurple,
  },
  link: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: colors.lightPurple,
    height: 44,
    width: '50%',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default function NotFoundScreen() {
      const router = useRouter();

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Link href="/" style={styles.link}>
        <Button
                title="Go Home"
                onPress={() =>
                  router.push({ pathname: '/(main)/(tabs)/home'})
                }
              />
      </Link>
    </View>
  );
}
