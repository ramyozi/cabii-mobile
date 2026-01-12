import { useState, useCallback } from 'react';
import { customerProfileService } from '@/services/customer-profile.service';
import { driverProfileService } from '@/services/driver-profile.service';
import { ActiveRoleEnum } from '@ramyozi/cabii-shared';

interface ProfileCheckResult {
  hasProfile: boolean;
  profileId?: string;
}

/**
 * Hook for checking if user has specific role profiles
 *
 * Provides methods to check if the current user has:
 * - Driver profile
 * - Customer profile
 *
 * @example
 * const { checkDriverProfile, checkCustomerProfile, checking } = useProfileCheck();
 *
 * const handleRoleSwitch = async () => {
 *   const { hasProfile } = await checkDriverProfile();
 *   if (!hasProfile) {
 *     // Prompt user to create driver profile
 *   }
 * };
 */
export function useProfileCheck() {
  const [checking, setChecking] = useState(false);

  /**
   * Check if user has a driver profile
   * Returns the first driver profile found (most users will have only one)
   */
  const checkDriverProfile = useCallback(async (): Promise<ProfileCheckResult> => {
    try {
      setChecking(true);
      const response = await driverProfileService.getAll();

      if (response.data && response.data.length > 0) {
        return {
          hasProfile: true,
          profileId: response.data[0].id,
        };
      }

      return { hasProfile: false };
    } catch (error) {
      console.error('Error checking driver profile:', error);
      // If error, assume no profile to be safe
      return { hasProfile: false };
    } finally {
      setChecking(false);
    }
  }, []);

  /**
   * Check if user has a customer profile
   * Returns the first customer profile found (most users will have only one)
   */
  const checkCustomerProfile = useCallback(async (): Promise<ProfileCheckResult> => {
    try {
      setChecking(true);
      const response = await customerProfileService.getAll();

      if (response.data && response.data.length > 0) {
        return {
          hasProfile: true,
          profileId: response.data[0].id,
        };
      }

      return { hasProfile: false };
    } catch (error) {
      console.error('Error checking customer profile:', error);
      // If error, assume no profile to be safe
      return { hasProfile: false };
    } finally {
      setChecking(false);
    }
  }, []);

  /**
   * Check if user has a profile for the target role
   */
  const checkProfileForRole = useCallback(
    async (role: ActiveRoleEnum): Promise<ProfileCheckResult> => {
      switch (role) {
        case ActiveRoleEnum.Driver:
          return checkDriverProfile();
        case ActiveRoleEnum.Customer:
          return checkCustomerProfile();
        default:
          return { hasProfile: false };
      }
    },
    [checkDriverProfile, checkCustomerProfile],
  );

  return {
    checkDriverProfile,
    checkCustomerProfile,
    checkProfileForRole,
    checking,
  };
}
