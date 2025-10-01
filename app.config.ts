import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const expoProjectId = process.env.EXPO_PROJECT_ID ?? '18adc0d0-eb1d-11e9-8009-d524ed5cc4a7';
  const expoConfig: ExpoConfig = {
    ...config,
    slug: process.env.EXPO_SLUG ?? 'react-native-app',
    name: process.env.EXPO_NAME ?? 'React Native App',
    version: '1.0.0',
    orientation: 'portrait',
    ios: {
      ...config.ios,
      bundleIdentifier: process.env.EXPO_IOS_BUNDLE_IDENTIFIER ?? 'fr.cabii.app',
    },
    android: {
      ...config.android,
      package: process.env.EXPO_ANDROID_PACKAGE ?? 'fr.cabii.app',
    },
    web: {
      ...config.web,
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/logo-sm.png',
    },
    updates: {
      url: `https://u.expo.dev/${expoProjectId}`,
    },
    extra: {
      ...config.extra,
      eas: { projectId: expoProjectId },
      env: process.env.ENV ?? 'development',
      apiUrl: process.env.API_URL ?? 'https://localhost:3000',
    },
    plugins: [
      'expo-router',
      'expo-asset',
      'expo-localization',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#101212',
          },
          image: './assets/images/logo-lg.png',
          imageWidth: 200,
          resizeMode: 'contain',
        },
      ],
      [
        'expo-font',
        {
          fonts: [
            './assets/fonts/OpenSans-Bold.ttf',
            './assets/fonts/OpenSans-BoldItalic.ttf',
            './assets/fonts/OpenSans-Italic.ttf',
            './assets/fonts/OpenSans-Regular.ttf',
            './assets/fonts/OpenSans-Semibold.ttf',
            './assets/fonts/OpenSans-SemiboldItalic.ttf',
          ],
        },
      ],
    ],
  };
  // console.log('[##] expo config', expoConfig);
  return expoConfig;
};
