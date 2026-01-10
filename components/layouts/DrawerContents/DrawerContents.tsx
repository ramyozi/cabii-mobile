import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { useAppTheme } from '@/plugin/theme-provider';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

export default function DrawerContents() {
  const { isDark } = useAppTheme();
  return (
    <SafeAreaView>
      <View style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
        <Text style={{ color: isDark ? colors.white : colors.black }}>Side Menu Contents</Text>
      </View>
    </SafeAreaView>
  );
}
