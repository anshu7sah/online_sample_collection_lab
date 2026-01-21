import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useBooking } from "./BookingContext"; // For personal & appointment info
import { useRouter } from "expo-router";
import PrimaryButton from "@/components/PrimaryButton";
import Toast from "react-native-toast-message";
import { useApp } from "@/contexts/AppContext";
import { useState } from "react";

const PAYMENT_MODES = ["Pay Later", "ESEWA", "KHALTI", "BANK_TRANSFER"];

export default function Step3() {
  const { state: bookingState } = useBooking();
  const { state: appState, dispatch } = useApp();
  const router = useRouter();

  const cart = appState.cart || [];
  const totalAmount = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const [selectedPayment, setSelectedPayment] = useState("Pay Later");

const confirmBooking = async () => {
  try {
    console.log("Final Booking Payload:", { bookingState, cart, paymentMode: selectedPayment });

    const formData = new FormData();

    // Append prescription file if exists
    if (bookingState.hasPrescription && bookingState.prescriptionFile) {
      formData.append("file", {
        uri: bookingState.prescriptionFile.uri,
        name: bookingState.prescriptionFile.name,
        type: bookingState.prescriptionFile.mimeType || "application/octet-stream",
      } as any);
    }

    // Append booking info
    formData.append("name", bookingState.name);
    formData.append("age", bookingState.age.toString());
    formData.append("gender", bookingState.gender);
    formData.append("mobile", bookingState.mobile);
    formData.append("address", bookingState.address);
    formData.append("latitude", bookingState.location?.latitude.toString() || "0");
    formData.append("longitude", bookingState.location?.longitude.toString() || "0");
    formData.append("date", bookingState.date);
    formData.append("timeSlot", bookingState.timeSlot);
    formData.append("prcDoctor", bookingState.prcDoctor || "");
    formData.append("paymentMode", selectedPayment); // from Step3 UI

    // Append cart items
    cart.forEach((item, index) => {
      formData.append(`items[${index}][type]`, item.type);
      formData.append(`items[${index}][name]`, item.name);
      formData.append(`items[${index}][price]`, item.price.toString());
      if (item.type === "test") formData.append(`items[${index}][testId]`, item.id.toString());
      if (item.type === "package") formData.append(`items[${index}][packageId]`, item.id.toString());
    });

    // POST request to backend
    const response = await fetch("https://your-backend.com/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${appState.token}`, // if protected route
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      Toast.show({ type: "error", text1: data.message || "Booking failed" });
      return;
    }

    Toast.show({ type: "success", text1: "Booking Confirmed" });

    // Clear cart and reset BookingContext
    dispatch({ type: "CLEAR_CART" });

    router.replace("/(tabs)");
  } catch (error) {
    console.error("Booking submission error:", error);
    Toast.show({ type: "error", text1: "Booking submission failed" });
  }
};


  const isDisabled =
    !bookingState.name ||
    !bookingState.date ||
    !bookingState.timeSlot ||
    !bookingState.address ||
    cart.length === 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Confirm Booking</Text>

      {/* Personal Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{bookingState.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{bookingState.age}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{bookingState.gender}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mobile:</Text>
          <Text style={styles.value}>{bookingState.mobile}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{bookingState.address}</Text>
        </View>
      </View>

      {/* Appointment Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Appointment Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{bookingState.date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Time Slot:</Text>
          <Text style={styles.value}>{bookingState.timeSlot}</Text>
        </View>
        {bookingState.prcDoctor && (
          <View style={styles.row}>
            <Text style={styles.label}>Doctor:</Text>
            <Text style={styles.value}>{bookingState.prcDoctor}</Text>
          </View>
        )}
        {bookingState.hasPrescription && bookingState.prescriptionFile && (
          <View style={styles.row}>
            <Text style={styles.label}>Prescription:</Text>
            <Text style={styles.value}>{bookingState.prescriptionFile.name}</Text>
          </View>
        )}
      </View>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Selected Tests / Packages</Text>
          {cart.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.label}>{item.name}</Text>
              <Text style={styles.value}>₹{Number(item.price).toFixed(2)}</Text>
            </View>
          ))}
          <View style={[styles.row, { marginTop: 8 }]}>
            <Text style={[styles.label, { fontWeight: "700" }]}>Total Payable</Text>
            <Text style={[styles.value, { fontWeight: "700" }]}>₹{totalAmount.toFixed(2)}</Text>
          </View>
        </View>
      )}

      {/* Payment Mode */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment Mode</Text>
        {PAYMENT_MODES.map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[
              styles.paymentOption,
              selectedPayment === mode && styles.paymentOptionSelected,
            ]}
            onPress={() => setSelectedPayment(mode)}
          >
            <Text
              style={[
                styles.paymentText,
                selectedPayment === mode && styles.paymentTextSelected,
              ]}
            >
              {mode}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonColumn}>
        <PrimaryButton
          label="Previous"
          onPress={() => router.back()}
          style={{ backgroundColor: "#fff", borderWidth: 1, borderColor: "#008080" }}
          textStyle={{ color: "#008080" }}
        />
        <PrimaryButton
          label="Confirm Booking"
          onPress={confirmBooking}
          disabled={isDisabled}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#008080",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontWeight: "500",
    color: "#374151",
  },
  value: {
    fontWeight: "600",
    color: "#111827",
  },
  buttonColumn: {
    flexDirection: "column",
    gap: 12,
    marginTop: 24,
  },
  paymentOption: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginVertical: 6,
    alignItems: "center",
  },
  paymentOptionSelected: {
    backgroundColor: "#008080",
    borderColor: "#008080",
  },
  paymentText: {
    color: "#374151",
    fontWeight: "500",
  },
  paymentTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
});
