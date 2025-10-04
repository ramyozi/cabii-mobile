import { Fragment, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import BottomSheetContents from '@/components/layouts/BottomSheetContents';
import BottomSheet from '@/components/elements/BottomSheet';
import useColorScheme from '@/hooks/useColorScheme';
import { colors, loadFonts, loadImages } from '@/theme';
import { Redirect, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Provider from '@/providers';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import '../i18n.config';

SplashScreen.preventAutoHideAsync();

function Router() {
  const { isDark } = useColorScheme();
  const { tokens, user, loading } = useAuth();
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([loadImages(), loadFonts()]);
      } catch (e) {
        console.error('App init error', e);
      } finally {
        await SplashScreen.hideAsync();
        setOpen(true);
      }
    })();
  }, []);

  if (loading) return null;

  if (!tokens || !user) {
    return <Slot />;
  }

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
