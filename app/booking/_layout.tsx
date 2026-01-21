import { Stack } from "expo-router";
import { BookingProvider } from "./BookingContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingLayout() {
  return (
    <BookingProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </BookingProvider>
  );
}
