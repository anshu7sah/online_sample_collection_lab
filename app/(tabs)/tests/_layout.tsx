import { Stack } from 'expo-router/stack';
import { COLORS } from '@/lib/theme';

export default function TestsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        headerShadowVisible: false,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="packages" options={{ title: 'Lab Packages' }} />
      <Stack.Screen name="all-tests" options={{ title: 'All Tests' }} />
      <Stack.Screen name="test-details" options={{ title: 'Test Details' }} />
      <Stack.Screen
        name="package-details"
        options={{ title: 'Package Details' }}
      />
    </Stack>
  );
}
