import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useAppTheme } from '@/plugin/theme-provider';

export default function ThemeToggle() {
  const { isDark, toggleTheme, theme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.labelContainer}>
        {isDark ? (
          <Moon size={20} color={theme.colors.primary} />
        ) : (
          <Sun size={20} color={theme.colors.primary} />
        )}
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </Text>
      </View>

      <Switch
        trackColor={{
          false: theme.colors.inversePrimary || '#E4E6EF',
          true: theme.colors.primary,
        }}
        thumbColor={theme.colors.onPrimary}
        ios_backgroundColor={theme.colors.inversePrimary || '#E4E6EF'}
        onValueChange={toggleTheme}
        value={isDark}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
