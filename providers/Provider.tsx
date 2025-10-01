import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as ReduxProvider } from 'react-redux';
import useColorScheme from '@/hooks/useColorScheme';
import store from '@/utils/store';
import 'react-native-reanimated';
import {I18nextProvider} from "react-i18next";
import i18n from '../i18n.config';


export default function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isDark } = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
          <I18nextProvider i18n={i18n}>
              <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
                  {children}
              </ThemeProvider>
          </I18nextProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}
