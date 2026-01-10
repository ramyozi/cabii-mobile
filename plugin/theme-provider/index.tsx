import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import {
  MD3LightTheme as PaperLightTheme,
  MD3DarkTheme as PaperDarkTheme,
  PaperProvider,
  useTheme as usePaperTheme,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/theme';

const STORAGE_KEY = 'cabii_theme_mode';

const lightTheme = {
  ...PaperLightTheme,
  colors: {
    ...PaperLightTheme.colors,

    primary: colors.primary,
    background: colors.light.background,
    surface: colors.light.surface,
    text: colors.light.text,
    onSurface: colors.light.text,
    error: colors.error,

    secondary: colors.secondary,
    outline: colors.gray300,
  },
};

const darkTheme = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    primary: colors.dark.primary,
    background: colors.dark.background,
    surface: colors.dark.surface,
    text: colors.dark.text,
    onSurface: colors.dark.text,
    error: colors.error,

    secondary: colors.secondary,
    outline: colors.gray600,
  },
};

export type AppTheme = typeof lightTheme;

const ThemeContext = createContext<{
  isDark: boolean;
  toggleTheme: () => void;
  theme: AppTheme;
}>({
  isDark: false,
  toggleTheme: () => {},
  theme: lightTheme,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === 'dark') setIsDark(true);
    })();
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      AsyncStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light').catch(() => {});
      return next;
    });
  };

  const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
}

export const useAppTheme = () => useContext(ThemeContext);

export const usePaper = usePaperTheme;
