import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as ReduxProvider } from 'react-redux';
import store from '@/utils/store';
import 'react-native-reanimated';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n.config';
import { SwrProvider } from '@/plugin/swr.provider';
import { AuthProvider } from '@/plugin/auth-provider/auth.provider';
import { ThemeProvider } from '@/plugin/theme-provider';

export default function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <SwrProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ReduxProvider store={store}>
            <I18nextProvider i18n={i18n}>
              <ThemeProvider>{children}</ThemeProvider>
            </I18nextProvider>
          </ReduxProvider>
        </GestureHandlerRootView>
      </SwrProvider>
    </AuthProvider>
  );
}
