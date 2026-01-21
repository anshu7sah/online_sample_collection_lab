import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import PagerView from "react-native-pager-view";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Checkbox, RadioButton } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const COLORS = {
  blue: "#2563EB",
  teal: "#0D9488",
  grey: "#F3F4F6",
  dark: "#374151",
  white: "#FFFFFF",
};

const TIME_SLOTS = [
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
];

const DOCTORS = ["Dr. S. Yadav", "Dr. R. Jha", "Dr. A. Mishra"];

const calculateAge = (dob: Date) =>
  Math.floor((Date.now() - dob.getTime()) / 31557600000);

/* ================= MAIN ================= */

export default function BookingScreen() {
  const router = useRouter();
  const pagerRef = useRef<PagerView>(null);

  const [step, setStep] = useState(0);

  /* ================= FORM STATE ================= */

  const [profile, setProfile] = useState<"SELF" | "OTHER">("SELF");
  const [dob, setDob] = useState<Date | null>(null);
  const [showDob, setShowDob] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    mobile: "",
  });

  const [location, setLocation] = useState<any>(null);
  const [manualLocation, setManualLocation] = useState(false);

  const [date, setDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [timeSlot, setTimeSlot] = useState("");

  const [hasPrescription, setHasPrescription] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState<any>(null);

  const [prc, setPrc] = useState(false);
  const [doctor, setDoctor] = useState("");

  /* ================= NAVIGATION ================= */

  const goNext = () => {
    pagerRef.current?.setPage(step + 1);
    setStep(step + 1);
  };

  const goBack = () => {
    pagerRef.current?.setPage(step - 1);
    setStep(step - 1);
  };

  /* ================= VALIDATION ================= */

  const step1Valid =
    form.name &&
    form.age &&
    form.mobile &&
    location;

  const step2Valid =
    date &&
    timeSlot &&
    (!hasPrescription || prescriptionFile) &&
    (!prc || doctor);

  /* ================= LOCATION ================= */

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
    setManualLocation(false);
  };

  /* ================= PRESCRIPTION ================= */

  const pickPrescription = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
    });

    if (!res.canceled) {
      setPrescriptionFile(res.assets[0]);
    }
  };

  /* ================= CONFIRM ================= */

  const confirmBooking = () => {
    const payload = {
      profile,
      form,
      dob,
      location,
      date,
      timeSlot,
      hasPrescription,
      prescriptionFile,
      prc,
      doctor,
    };

    console.log("FINAL BOOKING PAYLOAD", payload);

    Toast.show({ type: "success", text1: "Booking Confirmed" });
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.grey }}>
      {/* ================= STEPPER ================= */}
      <View style={styles.stepHeader}>
        {["Details", "Schedule", "Confirm"].map((label, i) => (
          <View key={i} style={styles.stepItem}>
            <View
              style={[
                styles.stepDot,
                step >= i && { backgroundColor: COLORS.blue },
              ]}
            />
            <Text style={[styles.stepLabel, step === i && { color: COLORS.blue }]}>
              {label}
            </Text>
          </View>
        ))}
      </View>

      <PagerView ref={pagerRef} style={{ flex: 1 }} scrollEnabled={false}>
        {/* ================= STEP 1 ================= */}
        <ScrollView key="1" contentContainerStyle={styles.page}>
          <Text style={styles.title}>Personal Details</Text>

          <TextInput
            placeholder="Full Name"
            style={styles.input}
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
          />

          <TouchableOpacity onPress={() => setShowDob(true)}>
            <TextInput
              editable={false}
              style={styles.input}
              placeholder="Date of Birth"
              value={dob ? dob.toDateString() : ""}
            />
          </TouchableOpacity>

          <TextInput
            editable={false}
            style={styles.input}
            placeholder="Age"
            value={form.age}
          />

          {showDob && (
            <DateTimePicker
              value={dob || new Date()}
              mode="date"
              onChange={(e, d) => {
                setShowDob(false);
                if (d) {
                  setDob(d);
                  setForm({ ...form, age: calculateAge(d).toString() });
                }
              }}
            />
          )}

          <TextInput
            placeholder="Phone Number"
            keyboardType="phone-pad"
            style={styles.input}
            value={form.mobile}
            onChangeText={(v) => setForm({ ...form, mobile: v })}
          />

          <MapView
            style={styles.map}
            region={
              location && {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            }
            onPress={(e) =>
              manualLocation && setLocation(e.nativeEvent.coordinate)
            }
          >
            {location && <Marker coordinate={location} />}
          </MapView>

          <View style={styles.row}>
            <OutlineButton label="Use Current Location" onPress={getCurrentLocation} />
            <OutlineButton label="Set Manually" onPress={() => setManualLocation(true)} />
          </View>

          <PrimaryButton
            label="Next"
            disabled={!step1Valid}
            onPress={goNext}
          />
        </ScrollView>

        {/* ================= STEP 2 ================= */}
        <ScrollView key="2" contentContainerStyle={styles.page}>
          <Text style={styles.title}>Availability</Text>

          <TouchableOpacity onPress={() => setShowCalendar(true)} style={styles.input}>
            <Text>{date ? date.toDateString() : "Select Date"}</Text>
          </TouchableOpacity>

          {showCalendar && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              onChange={(e, d) => {
                setShowCalendar(false);
                if (d) setDate(d);
              }}
            />
          )}

          {date && (
            <View style={styles.grid}>
              {TIME_SLOTS.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.slot,
                    timeSlot === t && styles.slotActive,
                  ]}
                  onPress={() => setTimeSlot(t)}
                >
                  <Text style={{ color: timeSlot === t ? "#fff" : COLORS.blue }}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.row}>
            <Checkbox
              status={hasPrescription ? "checked" : "unchecked"}
              onPress={() => setHasPrescription(!hasPrescription)}
            />
            <Text>I have a prescription</Text>
          </View>

          {hasPrescription && (
            <OutlineButton
              label={prescriptionFile ? "Prescription Added" : "Upload Prescription"}
              onPress={pickPrescription}
            />
          )}

          <View style={styles.row}>
            <Checkbox
              status={prc ? "checked" : "unchecked"}
              onPress={() => setPrc(!prc)}
            />
            <Text>Post Report Consultation</Text>
          </View>

          {prc &&
            DOCTORS.map((d) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.doctor,
                  doctor === d && styles.doctorActive,
                ]}
                onPress={() => setDoctor(d)}
              >
                <Text>{d}</Text>
              </TouchableOpacity>
            ))}

          <View style={{ marginTop: 24 }}>
            <OutlineButton label="Previous" onPress={goBack} />
            <View style={{ height: 12 }} />
            <PrimaryButton
              label="Next"
              disabled={!step2Valid}
              onPress={goNext}
            />
          </View>
        </ScrollView>

        {/* ================= STEP 3 ================= */}
        <ScrollView key="3" contentContainerStyle={styles.page}>
          <Text style={styles.title}>Confirm Booking</Text>

          <PrimaryButton label="Confirm Booking" onPress={confirmBooking} />
        </ScrollView>
      </PagerView>

      <Toast />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    backgroundColor: COLORS.white,
  },
  stepItem: { alignItems: "center" },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#CBD5E1",
    marginBottom: 4,
  },
  stepLabel: { fontSize: 12, color: "#6B7280" },

  page: { padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },

  input: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  map: { height: 180, borderRadius: 12, marginVertical: 12 },

  row: { flexDirection: "row", alignItems: "center", gap: 12 },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  slot: {
    borderWidth: 1,
    borderColor: COLORS.blue,
    padding: 12,
    borderRadius: 10,
    width: width / 2 - 30,
    alignItems: "center",
  },
  slotActive: { backgroundColor: COLORS.blue },

  doctor: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  doctorActive: {
    borderWidth: 2,
    borderColor: COLORS.teal,
  },
});

/* ================= BUTTONS ================= */

const PrimaryButton = ({ label, onPress, disabled }: any) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={{
      backgroundColor: COLORS.blue,
      padding: 16,
      borderRadius: 16,
      opacity: disabled ? 0.4 : 1,
      alignItems: "center",
    }}
  >
    <Text style={{ color: "#fff", fontSize: 17 }}>{label}</Text>
  </TouchableOpacity>
);

const OutlineButton = ({ label, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      borderWidth: 1,
      borderColor: COLORS.blue,
      padding: 16,
      borderRadius: 16,
      alignItems: "center",
      flex: 1,
    }}
  >
    <Text style={{ color: COLORS.blue }}>{label}</Text>
  </TouchableOpacity>
);
