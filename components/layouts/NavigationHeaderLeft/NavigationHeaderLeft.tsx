import { SimpleLineIcons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { useAppTheme } from '@/plugin/theme-provider';

export default function NavigationHeaderLeft({ onPress }: { onPress: () => void }) {
  const { isDark } = useAppTheme();
  return (
    <SimpleLineIcons.Button
      name="menu"
      size={24}
      color={isDark ? colors.gray : colors.white}
      backgroundColor={colors.transparent}
      onPress={onPress}
    />
  );
}
