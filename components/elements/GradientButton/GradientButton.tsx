import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import Button, { ButtonProps } from '../Button';
import { useAppTheme } from '@/plugin/theme-provider';

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
});

export interface GradientButtonProps extends ButtonProps {
  gradientBackgroundProps?: LinearGradientProps;
  gradientBackgroundStyle?: StyleProp<ViewStyle>;
}

function GradientButton({
  gradientBackgroundProps,
  gradientBackgroundStyle,
  style,
  ...others
}: GradientButtonProps) {
  const { theme } = useAppTheme();

  const defaultGradient: LinearGradientProps = {
    colors: [theme.colors.primary, theme.colors.secondary],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  };

  return (
    <Button {...others} style={[styles.root, style]}>
      <LinearGradient
        {...defaultGradient}
        {...gradientBackgroundProps}
        style={[styles.gradientBackground, gradientBackgroundStyle]}
      />
    </Button>
  );
}

export default GradientButton;
