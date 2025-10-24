import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '@/plugin/theme-provider';
import { colors } from '@/theme';

export interface ButtonProps extends PressableProps {
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  isLoading?: boolean;
  loaderColor?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'filled' | 'outlined' | 'text';
  disabled?: boolean;
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

function Button({
  title,
  titleStyle,
  style,
  disabled,
  isLoading,
  loaderColor,
  children,
  variant = 'filled',
  ...others
}: ButtonProps) {
  const { theme } = useAppTheme();

  const palette = theme.colors;
  const isOutlined = variant === 'outlined';
  const isText = variant === 'text';
  const baseBg = isOutlined || isText ? 'transparent' : palette.primary;
  const borderColor = isOutlined ? palette.primary : 'transparent';
  const textColor = isOutlined || isText ? palette.primary : palette.onPrimary;

  const opacityStyle = { opacity: disabled ? 0.5 : 1 };

  return (
    <Pressable
      style={[
        styles.root,
        {
          backgroundColor: baseBg,
          borderColor,
          borderWidth: isOutlined ? 1.5 : 0,
        },
        opacityStyle,
        style,
      ]}
      disabled={disabled || isLoading}
      android_ripple={{
        color: palette.onSurface,
        borderless: false,
      }}
      {...others}>
      {isLoading ? (
        <ActivityIndicator size="small" color={loaderColor ?? textColor ?? colors.white} />
      ) : (
        <>
          {children}
          {title ? (
            <Text style={[styles.title, { color: textColor }, titleStyle]}>{title}</Text>
          ) : null}
        </>
      )}
    </Pressable>
  );
}

export default Button;
