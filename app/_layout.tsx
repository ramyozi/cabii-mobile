import { Fragment, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import BottomSheetContents from '@/components/layouts/BottomSheetContents';
import BottomSheet from '@/components/elements/BottomSheet';
import { colors, loadFonts, loadImages } from '@/theme';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Provider from '@/providers';
import { useAuth } from '@/plugin/auth-provider/use-auth';
import '../i18n.config';
import { useAppTheme } from '@/plugin/theme-provider';

SplashScreen.preventAutoHideAsync();

function Router() {
  const { isDark } = useAppTheme();
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
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <BottomSheet
        isOpen={isOpen}
        initialOpen
        backgroundStyle={{
          backgroundColor: isDark ? colors.dark.surface : colors.light.surface,
        }}>
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
