import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AppProvider } from '@/contexts/AppContext';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="auth/otp" />
        <Stack.Screen name="auth/user-details" />
        <Stack.Screen name="booking" options={{ title: 'Book Test', headerBackTitle: 'Back' }} />

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
            <Toast />

    </AppProvider>
  );
}
