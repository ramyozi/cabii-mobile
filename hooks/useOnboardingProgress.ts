import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActiveRoleEnum } from '@ramyozi/cabii-shared';

interface OnboardingProgress<T = any> {
  currentStepIndex: number;
  formData: T;
  targetRole: ActiveRoleEnum;
  timestamp: number;
  context: 'signup' | 'role-switch';
}

interface UseOnboardingProgressOptions {
  userId?: string;
  targetRole: ActiveRoleEnum;
  context: 'signup' | 'role-switch';
}

const STORAGE_PREFIX = 'onboarding:progress';

/**
 * Hook for persisting and restoring onboarding progress
 *
 * Supports both signup and role-switch onboarding flows.
 * Progress is saved to AsyncStorage and can be restored after:
 * - App restart
 * - App crash
 * - User logout/login
 * - Role switching
 *
 * @example
 * const { progress, saveProgress, clearProgress, hasProgress } = useOnboardingProgress({
 *   userId: user.id,
 *   targetRole: ActiveRoleEnum.Driver,
 *   context: 'role-switch'
 * });
 */
export function useOnboardingProgress<T = any>(options: UseOnboardingProgressOptions) {
  const { userId, targetRole, context } = options;
  const [progress, setProgress] = useState<OnboardingProgress<T> | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate storage key
  const getStorageKey = useCallback(() => {
    if (!userId) return `${STORAGE_PREFIX}:${context}:${targetRole}`;
    return `${STORAGE_PREFIX}:${userId}:${context}:${targetRole}`;
  }, [userId, context, targetRole]);

  // Load progress from storage
  const loadProgress = useCallback(async () => {
    try {
      setLoading(true);
      const key = getStorageKey();
      const stored = await AsyncStorage.getItem(key);

      if (stored) {
        const parsed = JSON.parse(stored) as OnboardingProgress<T>;

        // Check if progress is not stale (older than 7 days)
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        const age = Date.now() - parsed.timestamp;

        if (age < maxAge) {
          setProgress(parsed);
        } else {
          // Clear stale progress
          await AsyncStorage.removeItem(key);
          setProgress(null);
        }
      } else {
        setProgress(null);
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  }, [getStorageKey]);

  // Save progress to storage
  const saveProgress = useCallback(
    async (stepIndex: number, formData: T) => {
      try {
        const key = getStorageKey();
        const progressData: OnboardingProgress<T> = {
          currentStepIndex: stepIndex,
          formData,
          targetRole,
          context,
          timestamp: Date.now(),
        };

        await AsyncStorage.setItem(key, JSON.stringify(progressData));
        setProgress(progressData);
      } catch (error) {
        console.error('Error saving onboarding progress:', error);
      }
    },
    [getStorageKey, targetRole, context],
  );

  // Clear progress from storage
  const clearProgress = useCallback(async () => {
    try {
      const key = getStorageKey();
      await AsyncStorage.removeItem(key);
      setProgress(null);
    } catch (error) {
      console.error('Error clearing onboarding progress:', error);
    }
  }, [getStorageKey]);

  // Check if progress exists
  const hasProgress = progress !== null && progress.currentStepIndex > 0;

  // Load progress on mount
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    progress,
    saveProgress,
    clearProgress,
    loadProgress,
    hasProgress,
    loading,
  };
}
