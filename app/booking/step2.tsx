import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Checkbox } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { useBooking } from "./BookingContext";
import { useRouter } from "expo-router";
import PrimaryButton from "@/components/PrimaryButton";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

const TIME_SLOTS = [
  "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
  "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00",
  "16:00-17:00", "17:00-18:00",
];

const DOCTORS = ["Dr. S. Yadav", "Dr. R. Jha"];

export default function Step2() {
  const { state, dispatch } = useBooking();
  const router = useRouter();

  const [showDatePicker, setShowDatePicker] = useState(false);

  const pickPrescription = async () => {
    const res = await DocumentPicker.getDocumentAsync({});
    if (!res.canceled) {
      dispatch({ prescriptionFile: res.assets[0] });
    }
  };

  const setQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    dispatch({ date: date.toISOString().split("T")[0] });
  };

  const handleCustomDate = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      dispatch({ date: selectedDate.toISOString().split("T")[0] });
    }
  };

  const isValid =
    state.date &&
    state.timeSlot &&
    (!state.hasPrescription || state.prescriptionFile);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Schedule</Text>

      {/* Quick Date Selectors */}
      <View style={styles.quickDateRow}>
        {["Today", "Tomorrow", "Day after Tomorrow"].map((label, idx) => {
          const date = new Date();
          date.setDate(date.getDate() + idx);
          const iso = date.toISOString().split("T")[0];

          return (
            <TouchableOpacity
              key={label}
              style={[
                styles.quickDateBtn,
                state.date === iso && styles.quickDateBtnActive,
              ]}
              onPress={() => setQuickDate(idx)}
            >
              <Text
                style={[
                  styles.quickDateText,
                  state.date === iso && styles.quickDateTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Date Picker */}
      <TouchableOpacity
        style={styles.datePickerBtn}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{state.date || "Select Date"}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={state.date ? new Date(state.date) : new Date()}
          mode="date"
          onChange={handleCustomDate}
        />
      )}

      {/* Time Slots */}
      {state.date && (
        <View style={styles.timeSlotGrid}>
          {TIME_SLOTS.map((slot) => {
            const isSelected = state.timeSlot === slot;

            return (
              <TouchableOpacity
                key={slot}
                style={[styles.slot, isSelected && styles.slotActive]}
                onPress={() => dispatch({ timeSlot: slot })}
              >
                <Text style={{ color: isSelected ? "#fff" : "#008080" }}>
                  {slot}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Prescription Checkbox */}
      <Checkbox.Item
        label="I have a prescription"
        status={state.hasPrescription ? "checked" : "unchecked"}
        onPress={() => dispatch({ hasPrescription: !state.hasPrescription })}
      />

      {/* ✅ Prescription Upload UI (ONLY ADDITION) */}
      {state.hasPrescription && (
        <View style={styles.prescriptionBox}>
          {!state.prescriptionFile ? (
            <PrimaryButton label="Upload Prescription" onPress={pickPrescription} />
          ) : (
            <View style={styles.uploadedFileRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fileLabel}>Uploaded Prescription</Text>
                <Text style={styles.fileName} numberOfLines={1}>
                  {state.prescriptionFile.name}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => dispatch({ prescriptionFile: null })}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Post Report Consultation */}
      <Checkbox.Item
        label="Post Report Consultation"
        status={!!state.prcDoctor ? "checked" : "unchecked"}
        onPress={() =>
          dispatch({ prcDoctor: state.prcDoctor ? "" : DOCTORS[0] })
        }
      />

      {state.prcDoctor && (
        <View style={styles.doctorList}>
          {DOCTORS.map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.doctorCard,
                state.prcDoctor === d && styles.doctorCardActive,
              ]}
              onPress={() => dispatch({ prcDoctor: d })}
            >
              <Text style={{ color: state.prcDoctor === d ? "#fff" : "#008080" }}>
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonColumn}>
        <TouchableOpacity style={styles.prevBtn} onPress={() => router.back()}>
          <Text style={styles.prevBtnText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextBtn, !isValid && { opacity: 0.4 }]}
          disabled={!isValid}
          onPress={() => router.push("/booking/step3")}
        >
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },

  quickDateRow: { flexDirection: "row", marginBottom: 12 },
  quickDateBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    marginHorizontal: 4,
  },
  quickDateBtnActive: { backgroundColor: "#008080" },
  quickDateText: { fontWeight: "600", color: "#374151" },
  quickDateTextActive: { color: "#fff" },

  datePickerBtn: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  timeSlotGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  slot: {
    borderWidth: 1,
    borderColor: "#008080",
    paddingVertical: 12,
    borderRadius: 12,
    width: "48%",
    alignItems: "center",
  },
  slotActive: { backgroundColor: "#008080" },

  prescriptionBox: { marginBottom: 12 },
  uploadedFileRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  fileLabel: { fontSize: 12, color: "#6B7280" },
  fileName: { fontSize: 14, fontWeight: "600", color: "#111827" },
  removeBtn: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 12,
  },
  removeText: { color: "#DC2626", fontWeight: "600" },

  doctorList: { marginVertical: 12 },
  doctorCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  doctorCardActive: { backgroundColor: "#008080" },

  buttonColumn: { marginTop: 24, gap: 12 },
  prevBtn: {
    borderWidth: 1,
    borderColor: "#008080",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  prevBtnText: { color: "#008080", fontWeight: "600" },
  nextBtn: {
    backgroundColor: "#008080",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  nextBtnText: { color: "#fff", fontWeight: "600" },
});
