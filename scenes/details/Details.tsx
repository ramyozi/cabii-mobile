import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import GradientButton from '@/components/elements/GradientButton';
import { useAppTheme } from '@/plugin/theme-provider';

export default function Details() {
  const router = useRouter();
  const { from } = useLocalSearchParams();
  const { theme } = useAppTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{`Details (from ${from})`}</Text>

      <GradientButton
        title="Go back to Home"
        titleStyle={[styles.buttonTitle, { color: theme.colors.onPrimary }]}
        style={[styles.button, { borderRadius: 22 }]}
        gradientBackgroundProps={{
          colors: [theme.colors.primary, theme.colors.secondary],
          start: { x: 0, y: 1 },
          end: { x: 0.8, y: 0 },
        }}
        onPress={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 44,
    width: '50%',
  },
});
