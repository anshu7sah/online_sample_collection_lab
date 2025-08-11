import { Stack } from 'expo-router/stack';

export default function TestsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="packages" options={{ title: 'Lab Packages', headerBackTitle: 'Back' }} />
      <Stack.Screen name="all-tests" options={{ title: 'All Tests', headerBackTitle: 'Back' }} />
      <Stack.Screen name="test-details" options={{ title: 'Test Details', headerBackTitle: 'Back' }} />
      <Stack.Screen name="booking" options={{ title: 'Book Test', headerBackTitle: 'Back' }} />
    </Stack>
  );
}