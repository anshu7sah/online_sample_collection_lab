import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

import { useBooking } from "./BookingContext";
import { useCurrent } from "@/hooks/useCurrent";
import PrimaryButton from "@/components/PrimaryButton";
import { calculateAge } from "@/lib/calculateAge";

export default function Step1() {
  const router = useRouter();
  const { state, dispatch } = useBooking();
  const { data:user } = useCurrent();

  const [forSelf, setForSelf] = useState(true);
  const [manualLocation, setManualLocation] = useState(false);

  // Auto-fill user data if "Self"
  useEffect(() => {
    if (forSelf && user) {
      dispatch({
        name: user.name ?? "",
        age: user.dob ? calculateAge(new Date(user.dob)) : "",
        mobile: user.mobile ?? "",
      });
    }
    if (!forSelf) {
      dispatch({ name: "", age: "", mobile: "" });
    }
  }, [forSelf, user]);

  // Fetch current location
  const useCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const loc = await Location.getCurrentPositionAsync({});
    dispatch({ location: { latitude: loc.coords.latitude, longitude: loc.coords.longitude } });
    setManualLocation(false);
  };

  // Handle tap on map when manual
const handleMapPress = (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
  if (!manualLocation) return;
  const { coordinate } = e.nativeEvent;
  dispatch({ location: coordinate });
};


  const isValid =
    state.name &&
    state.age &&
    state.gender &&
    state.mobile &&
    state.address &&
    state.location;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Details</Text>

      {/* For Self / For Others */}
      <View style={styles.toggleContainer}>
        <ToggleButton label="For Self" active={forSelf} onPress={() => setForSelf(true)} />
        <ToggleButton label="For Others" active={!forSelf} onPress={() => setForSelf(false)} />
      </View>

      {/* NAME */}
      <TextInput
        style={[styles.input, forSelf && styles.disabled]}
        placeholder="Name"
        value={state.name}
        editable={!forSelf}
        onChangeText={(v) => dispatch({ name: v })}
      />

      {/* AGE */}
      <TextInput
        style={[styles.input, forSelf && styles.disabled]}
        placeholder="Age"
        keyboardType="numeric"
        value={state.age}
        editable={!forSelf}
        onChangeText={(v) => dispatch({ age: v })}
      />

      {/* MOBILE */}
      <TextInput
        style={[styles.input, forSelf && styles.disabled]}
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        value={state.mobile}
        editable={!forSelf}
        onChangeText={(v) => dispatch({ mobile: v })}
      />

      {/* GENDER DROPDOWN */}
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={state.gender}
          onValueChange={(v) => dispatch({ gender: v })}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="MALE" />
          <Picker.Item label="Female" value="FEMALE" />
          <Picker.Item label="Bisexual" value="BISEXUAL" />
          <Picker.Item label="Transgender" value="TRANSGENDER" />
        </Picker>
      </View>

      {/* ADDRESS */}
      <TextInput
        style={styles.input}
        placeholder="Detailed Address"
        value={state.address}
        onChangeText={(v) => dispatch({ address: v })}
      />

      {/* LOCATION BUTTONS */}
      <View style={styles.locationBtnRow}>
        <LocationButton
          label="Use Current Location"
          active={!manualLocation}
          onPress={useCurrentLocation}
        />
        <LocationButton
          label="Set Manually"
          active={manualLocation}
          onPress={() => setManualLocation(true)}
        />
      </View>

      {/* MAP */}
      <MapView
        style={styles.map}
        region={
          state.location
            ? {
                latitude: state.location.latitude,
                longitude: state.location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : undefined
        }
        onPress={handleMapPress}
      >
        {state.location && <Marker coordinate={state.location} />}
      </MapView>

      {state.location && (
        <Text style={styles.locationText}>
          Location set ✔ ({state.location.latitude.toFixed(4)},{state.location.longitude.toFixed(4)})
        </Text>
      )}

      {/* NEXT BUTTON */}
      <View style={{ marginTop: 20 }}>
        <PrimaryButton
          label="Next"
          disabled={!isValid}
          onPress={() => router.push("/booking/step2")}
        />
      </View>
    </View>
  );
}

/* ------------------ HELPERS ------------------ */



function ToggleButton({ label, active, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.toggleBtn, active && styles.toggleActive]}
    >
      <Text style={[styles.toggleText, active && styles.toggleTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function LocationButton({ label, active, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.locationBtn, active && styles.locationBtnActive]}
    >
      <Text style={[styles.locationBtnText, active && styles.locationBtnTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },

  toggleContainer: { flexDirection: "row", marginBottom: 16, gap: 12 },

  toggleBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  toggleActive: { backgroundColor: "#008080" },
  toggleText: { fontWeight: "600", color: "#374151" },
  toggleTextActive: { color: "#fff" },

  input: { backgroundColor: "#fff", padding: 16, borderRadius: 15, marginBottom: 12 },
  disabled: { backgroundColor: "#F5F5F5", color: "#6B7280" },

  pickerWrapper: { backgroundColor: "#fff", borderRadius: 15, marginBottom: 12, overflow: "hidden" },

  locationBtnRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  locationBtn: { flex: 1, padding: 14, borderRadius: 14, backgroundColor: "#F5F5F5", alignItems: "center" },
  locationBtnActive: { backgroundColor: "#008080" },
  locationBtnText: { color: "#374151", fontWeight: "600" },
  locationBtnTextActive: { color: "#fff" },

  map: { height: 180, borderRadius: 15, marginBottom: 12 },

  locationText: { marginVertical: 8, color: "#008080", fontWeight: "600" },
});
