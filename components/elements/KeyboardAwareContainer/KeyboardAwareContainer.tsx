import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  ScrollView,
  ScrollViewProps,
} from 'react-native';
import { useAppTheme } from '@/plugin/theme-provider';

export type KeyboardAwareContainerProps = {
  /** Main children */
  children: React.ReactNode;
  /** Style for KeyboardAvoidingView */
  containerStyle?: StyleProp<ViewStyle>;
  /** Style for ScrollView/View inner container */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Enable ScrollView instead of static view */
  scrollable?: boolean;
  /** ScrollView props if enabled */
  scrollViewProps?: ScrollViewProps;
  /** Center content vertically (useful for auth screens) */
  centered?: boolean;
};

/**
 * Keyboard-aware container that:
 * - Moves content above the keyboard
 * - Dismisses keyboard when tapping outside
 * - Allows full style customization
 * - Supports theme background
 */
export default function KeyboardAwareContainer({
  children,
  containerStyle,
  contentContainerStyle,
  scrollable = false,
  scrollViewProps,
  centered = false,
}: KeyboardAwareContainerProps) {
  const { theme } = useAppTheme();

  const contentStyles: StyleProp<ViewStyle> = [centered && styles.centered, contentContainerStyle];

  const content = scrollable ? (
    <ScrollView
      {...scrollViewProps}
      contentContainerStyle={[styles.scrollBase, contentStyles]}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View style={contentStyles}>{children}</View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.colors.background }, containerStyle]}
      behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {content}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, width: '100%' },
  scrollBase: { flexGrow: 1 },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
