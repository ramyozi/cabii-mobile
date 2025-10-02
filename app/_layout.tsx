import { Fragment, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import BottomSheetContents from '@/components/layouts/BottomSheetContents';
import BottomSheet from '@/components/elements/BottomSheet';
import useColorScheme from '@/hooks/useColorScheme';
import { colors, loadFonts, loadImages } from '@/theme';
import { Redirect, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppSlice } from '@/slices';
import { getUserAsync } from '@/services';
import Provider from '@/providers';
import { User } from '@/types';
import { Storage, StorageKeys } from '@/utils/storage';
import '../i18n.config';

// keep the splash screen visible while complete fetching resources
SplashScreen.preventAutoHideAsync();

function Router() {
  const { isDark } = useColorScheme();
  const { dispatch, setUser, setLoggedIn, setTokens, loggedIn, checked } = useAppSlice();
  const [isOpen, setOpen] = useState(false);

  /**
   * preload assets and user info
   */
  useEffect(() => {
    (async () => {
      try {
        // preload assets
        await Promise.all([loadImages(), loadFonts()]);

        // restore tokens from storage
        const accessToken = await Storage.getItem(StorageKeys.accessToken);
        const refreshToken = await Storage.getItem(StorageKeys.refreshToken);

        if (accessToken && refreshToken) {
          dispatch(setTokens({ accessToken, refreshToken }));
          dispatch(setLoggedIn(true));

          // fetch user profile (optional but recommended)
          try {
            const user = await getUserAsync();
            if (user) dispatch(setUser(user));
          } catch (e) {
            console.warn('Failed to fetch user profile', e);
          }
        } else {
          dispatch(setLoggedIn(false));
        }
      } catch (e) {
        console.error('App init error', e);
        dispatch(setLoggedIn(false));
      } finally {
        // hide splash screen no matter what
        SplashScreen.hideAsync();
        setOpen(true);
      }
    })();
  }, []);

  if (!checked) return null;

  if (!loggedIn) {
    // clean layout for auth
    return <Slot />;
  }

  // full layout for main app
  return (
    <Fragment>
      <Slot />
      <StatusBar style="light" />
      <BottomSheet
        isOpen={isOpen}
        initialOpen
        backgroundStyle={isDark && { backgroundColor: colors.blackGray }}>
        <BottomSheetContents onClose={() => setOpen(false)} />
      </BottomSheet>
    </Fragment>
  );
}

export default function RootLayout() {
  return (
    <Provider>
      <Router />
    </Provider>
  );
}
