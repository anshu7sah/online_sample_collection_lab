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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Checkbox, RadioButton } from "react-native-paper";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

/* ================= CONSTANTS ================= */

const COLORS = {
  teal: "#008080",
  gold: "#FFB800",
  grey: "#F5F5F5",
  dark: "#6B7280",
  white: "#FFFFFF",
  blue: "#3B82F6",
};

const TIME_SLOTS = [
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "21:00 - 22:00",
];

const DOCTORS = ["Dr. S. Yadav", "Dr. R. Jha", "Dr. A. Mishra"];

/* ================= UTILS ================= */

const calculateAge = (dob: Date) =>
  Math.floor((Date.now() - dob.getTime()) / 31557600000);

/* ================= MAIN ================= */

export default function BookingScreen() {
  const router = useRouter();
  const pagerRef = useRef<PagerView>(null);
  const step = useSharedValue(0);

  const [profile, setProfile] = useState<"SELF" | "OTHER">("SELF");
  const [dob, setDob] = useState<Date | null>(null);
  const [showDob, setShowDob] = useState(false);

  const [location, setLocation] = useState<any>(null);
  const [manualLocation, setManualLocation] = useState(false);

  const [availability, setAvailability] = useState<
    "TODAY" | "TOMORROW" | "DAY_AFTER" | "CALENDAR" | null
  >(null);
  const [date, setDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const [timeSlot, setTimeSlot] = useState("");
  const [hasPrescription, setHasPrescription] = useState(false);

  const [prc, setPrc] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const [form, setForm] = useState({
    name: "Anshu Sah",
    age: "23",
    mobile: "98XXXXXXXX",
    address: "",
  });

  /* ================= NAV ================= */

  const next = () => {
    pagerRef.current?.setPage(step.value + 1);
    step.value += 1;
  };

  const back = () => {
    pagerRef.current?.setPage(step.value - 1);
    step.value -= 1;
  };

  /* ================= STEP FILL ================= */

  const fillStyle = useAnimatedStyle(() => ({
    height: withTiming(step.value * 90, { duration: 300 }),
  }));

  /* ================= LOCATION ================= */

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
    setManualLocation(false);
  };

  /* ================= DATE HANDLING ================= */

  const selectQuickDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setDate(d);
    setAvailability(
      days === 0 ? "TODAY" : days === 1 ? "TOMORROW" : "DAY_AFTER"
    );
  };


  return (
    <View style={{ flex: 1, backgroundColor: COLORS.grey }}>
      {/* ===== Step Indicator ===== */}
      <View style={styles.stepper}>
        <View style={styles.stepLine}>
          <Animated.View style={[styles.stepFill, fillStyle]} />
        </View>
        {[1, 2, 3].map((s, i) => (
          <View
            key={s}
            style={[
              styles.stepCircle,
              step.value >= i && styles.stepCircleActive,
            ]}
          >
            <Text style={styles.stepText}>{s}</Text>
          </View>
        ))}
      </View>

      <PagerView ref={pagerRef} style={{ flex: 1 }} scrollEnabled={false}>
        {/* ================= STEP 1 ================= */}
        <ScrollView key="1" contentContainerStyle={styles.page}>
          <Text style={styles.title}>Personal Details</Text>

          <View style={styles.toggleRow}>
            {["SELF", "OTHER"].map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setProfile(p as any)}
                style={[
                  styles.toggle,
                  profile === p && styles.toggleActive,
                ]}
              >
                <Text style={{ color: profile === p ? "#fff" : "#000" }}>
                  {p === "SELF" ? "For Self" : "For Other"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            editable={profile === "OTHER"}
            style={[styles.input, profile === "SELF" && styles.disabled]}
            value={form.name}
            placeholder="Name"
          />

          <TouchableOpacity onPress={() => setShowDob(true)}>
            <TextInput
              editable={false}
              style={styles.input}
              placeholder="Select DOB"
              value={dob ? dob.toDateString() : ""}
            />
          </TouchableOpacity>

          <TextInput
            editable={false}
            style={[styles.input, styles.disabled]}
            value={form.age}
            placeholder="Age"
          />

          {showDob && (
            <DateTimePicker
              value={dob || new Date()}
              mode="date"
              onChange={(e, d) => {
                setShowDob(false);
                if (!d) return;
                setDob(d);
                setForm({ ...form, age: calculateAge(d).toString() });
              }}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Detailed Address"
            value={form.address}
            onChangeText={(v) => setForm({ ...form, address: v })}
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
            onPress={(e) => {
              if (manualLocation) setLocation(e.nativeEvent.coordinate);
            }}
          >
            {location && (
              <Marker
                draggable={manualLocation}
                coordinate={location}
                onDragEnd={(e) =>
                  setLocation(e.nativeEvent.coordinate)
                }
              />
            )}
          </MapView>

          <View style={styles.buttonRow}>
            <OutlineButton
              label="Use Current Location"
              onPress={getCurrentLocation}
            />
            <OutlineButton
              label="Set Manually"
              onPress={() => setManualLocation(true)}
            />
          </View>

          <PrimaryButton
            label="Next"
            disabled={!location || !form.address}
            onPress={next}
          />
        </ScrollView>

        {/* ================= STEP 2 ================= */}
        <ScrollView key="2" contentContainerStyle={styles.page}>
          <Text style={styles.title}>Availability</Text>

          {[
            ["TODAY", "Today", () => selectQuickDate(0)],
            ["TOMORROW", "Tomorrow", () => selectQuickDate(1)],
            ["DAY_AFTER", "Day after Tomorrow", () => selectQuickDate(2)],
          ].map(([k, label, fn]: any) => (
            <TouchableOpacity
              key={k}
              style={styles.radioRow}
              onPress={fn}
            >
              <RadioButton
                value={k}
                status={availability === k ? "checked" : "unchecked"}
              />
              <Text>{label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.calendarBox}
            onPress={() => {
              setAvailability("CALENDAR");
              setShowCalendar(true);
            }}
          >
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
            <>
              <Text style={styles.subTitle}>Available Time Slots</Text>
              <View style={styles.grid}>
                {TIME_SLOTS.map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setTimeSlot(t)}
                    style={[
                      styles.slot,
                      timeSlot === t && styles.slotActive,
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          timeSlot === t ? "#fff" : COLORS.blue,
                      }}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <View style={styles.checkboxRow}>
            <Checkbox
              status={hasPrescription ? "checked" : "unchecked"}
              onPress={() => setHasPrescription(!hasPrescription)}
            />
            <Text>I have a prescription</Text>
          </View>

          <View style={styles.checkboxRow}>
            <Checkbox
              status={prc ? "checked" : "unchecked"}
              onPress={() => setPrc(!prc)}
            />
            <Text>Post Report Consultation (PRC)</Text>
          </View>

          {prc &&
            DOCTORS.map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => setSelectedDoctor(d)}
                style={[
                  styles.doctor,
                  selectedDoctor === d && styles.doctorActive,
                ]}
              >
                <View style={styles.leftBar} />
                <Text>{d}</Text>
              </TouchableOpacity>
            ))}

          <Footer>
            <OutlineButton label="Previous" onPress={back} />
            <PrimaryButton
              label="Next"
              disabled={!timeSlot}
              onPress={next}
            />
          </Footer>
        </ScrollView>

        {/* ================= STEP 3 ================= */}
        <ScrollView key="3" contentContainerStyle={styles.page}>
          <Text style={styles.title}>Payment</Text>

          <View style={styles.card}>
            <Text style={styles.testName}>COMPLETE BLOOD COUNT</Text>
            <Text style={styles.discount}>10% OFF - New Year Discount</Text>
          </View>

          <PriceRow label="Subtotal" value="Rs. 500" />
          <PriceRow label="Discount" value="- Rs. 50" green />
          <PriceRow label="Total" value="Rs. 450" bold />

          <Footer>
            <OutlineButton label="Previous" onPress={back} />
            <PrimaryButton
              label="Confirm Booking"
              onPress={() => {
                Toast.show({
                  type: "success",
                  text1: "Booking Confirmed",
                });
                router.replace("/(tabs)");
              }}
            />
          </Footer>
        </ScrollView>
      </PagerView>

      <Toast />
    </View>
  );
}

/* ================= REUSABLE ================= */

const PrimaryButton = ({ label, onPress, disabled }: any) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[
      styles.primary,
      { opacity: disabled ? 0.4 : 1 },
    ]}
  >
    <Text style={{ color: "#fff", fontSize: 16 }}>{label}</Text>
  </TouchableOpacity>
);

const OutlineButton = ({ label, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={styles.outline}>
    <Text style={{ color: COLORS.teal }}>{label}</Text>
  </TouchableOpacity>
);

const Footer = ({ children }: any) => (
  <View style={styles.footer}>{children}</View>
);

const PriceRow = ({ label, value, green, bold }: any) => (
  <View style={styles.priceRow}>
    <Text style={{ fontSize: 16 }}>{label}</Text>
    <Text
      style={{
        fontSize: 16,
        fontWeight: bold ? "700" : "400",
        color: green ? "green" : "#000",
      }}
    >
      {value}
    </Text>
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  page: { padding: 16, paddingLeft: 60 },

  title: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  subTitle: { marginVertical: 12, fontSize: 16 },

  stepper: { position: "absolute", left: 24, top: 40 },
  stepLine: {
    position: "absolute",
    width: 3,
    height: 240,
    backgroundColor: "#E5E7EB",
    left: 8,
  },
  stepFill: {
    width: 3,
    backgroundColor: COLORS.blue,
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.blue,
    backgroundColor: "#fff",
    marginBottom: 68,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleActive: {
    backgroundColor: COLORS.blue,
  },
  stepText: { color: "#fff", fontSize: 12 },

  toggleRow: { flexDirection: "row", marginBottom: 16 },
  toggle: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10,
  },
  toggleActive: {
    backgroundColor: COLORS.teal,
    borderColor: COLORS.teal,
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  disabled: { opacity: 0.6 },

  map: { height: 160, borderRadius: 12, marginVertical: 12 },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  radioRow: { flexDirection: "row", alignItems: "center" },

  calendarBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginVertical: 12,
  },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  slot: {
    borderWidth: 1,
    borderColor: COLORS.blue,
    padding: 10,
    borderRadius: 8,
    width: width / 2 - 60,
    alignItems: "center",
  },
  slotActive: { backgroundColor: COLORS.blue },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  doctor: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  doctorActive: {
    borderWidth: 2,
    borderColor: COLORS.teal,
  },
  leftBar: {
    width: 4,
    height: "100%",
    backgroundColor: COLORS.gold,
    marginRight: 8,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  testName: { fontSize: 17, fontWeight: "600" },
  discount: { color: "green", marginTop: 6 },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },

  primary: {
    backgroundColor: COLORS.blue,
    padding: 14,
    borderRadius: 14,
    flex: 1,
    alignItems: "center",
    marginLeft: 10,
  },
  outline: {
    borderWidth: 1,
    borderColor: COLORS.blue,
    padding: 14,
    borderRadius: 14,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
});
