import { Stack } from 'expo-router/stack';
import { COLORS } from '@/lib/theme';

export default function TestsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="packages" />
      <Stack.Screen name="all-tests" />
      <Stack.Screen name="test-details" />
      <Stack.Screen name="package-details" />
    </Stack>
  );
}
