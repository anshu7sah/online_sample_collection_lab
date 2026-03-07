import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'sukralab',
  slug: 'sukralab',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/logo.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/logo.png',
    resizeMode: 'contain',
    backgroundColor: '#004e56',
  },
  android: {
    package: 'com.anshu7sah.sukralab',
    permissions: ['ACCESS_FINE_LOCATION'],
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_API_KEY ?? '',
      },
    },
  },
  ios: {
    bundleIdentifier: 'com.anshu7sah.sukralab',
    supportsTablet: true,
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        'This app needs your location to book appointments.',
    },
  },
  web: {
    bundler: 'metro',
    output: 'single',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-font',
    'expo-web-browser',
    '@react-native-community/datetimepicker',
    [
      'expo-local-authentication',
      {
        faceIDPermission:
          'Allow $(PRODUCT_NAME) to use Face ID for secure authentication.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: '7cd2be34-7ddd-4a01-9f66-c98b07984892',
    },
  },
});
