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

  // Quick date buttons: Today / Tomorrow / Day after Tomorrow
  const setQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    dispatch({ date: date.toISOString().split("T")[0] }); // store ISO string
  };

  const handleCustomDate = (event: any, selectedDate?: Date) => {
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
          const days = idx; // 0,1,2
          const buttonDate = new Date();
          buttonDate.setDate(buttonDate.getDate() + days);
          const iso = buttonDate.toISOString().split("T")[0];

          return (
            <TouchableOpacity
              key={label}
              style={[
                styles.quickDateBtn,
                state.date === iso && styles.quickDateBtnActive,
              ]}
              onPress={() => setQuickDate(days)}
              activeOpacity={0.8}
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
        <Text>{state.date ? state.date : "Select Date"}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={state.date ? new Date(state.date) : new Date()}
          mode="date"
          onChange={handleCustomDate}
        />
      )}

      {/* Time Slots - only visible if date selected */}
      {state.date && (
        <View style={styles.timeSlotGrid}>
          {TIME_SLOTS.map((slot) => {
            const isDisabled = false; // replace with backend check later
            const isSelected = state.timeSlot === slot;

            return (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.slot,
                  isSelected && styles.slotActive,
                  isDisabled && styles.slotDisabled,
                ]}
                onPress={() => !isDisabled && dispatch({ timeSlot: slot })}
                disabled={isDisabled}
              >
                <Text
                  style={[
                    { color: isSelected ? "#fff" : "#008080" },
                    isDisabled && { color: "#ccc" },
                  ]}
                >
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
        onPress={() =>
          dispatch({ hasPrescription: !state.hasPrescription })
        }
      />

      {state.hasPrescription && (
        <PrimaryButton label="Upload Prescription" onPress={pickPrescription} />
      )}

      {/* Post Report Consultation */}
      <Checkbox.Item
        label="Post Report Consultation"
        status={!!state.prcDoctor ? "checked" : "unchecked"}
        onPress={() =>
          dispatch({ prcDoctor: state.prcDoctor ? "" : DOCTORS[0] })
        }
      />

      {state.prcDoctor !== undefined && !!state.prcDoctor && (
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
              <Text
                style={
                  state.prcDoctor === d ? { color: "#fff" } : { color: "#008080" }
                }
              >
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Buttons Column: Previous + Next */}
      <View style={styles.buttonColumn}>
        <TouchableOpacity
          style={styles.prevBtn}
          onPress={() => router.back()}
        >
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

  quickDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  quickDateBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  quickDateBtnActive: {
    backgroundColor: "#008080",
  },
  quickDateText: {
    color: "#374151",
    fontWeight: "600",
    textAlign: "center",
  },
  quickDateTextActive: {
    color: "#fff",
  },

  datePickerBtn: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  timeSlotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  slot: {
    borderWidth: 1,
    borderColor: "#008080",
    paddingVertical: 12,
    borderRadius: 12,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  slotActive: {
    backgroundColor: "#008080",
  },
  slotDisabled: {
    backgroundColor: "#F0F0F0",
    borderColor: "#ccc",
  },

  doctorList: { marginVertical: 12 },
  doctorCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  doctorCardActive: {
    backgroundColor: "#008080",
  },

  buttonColumn: {
    flexDirection: "column",
    gap: 12,
    marginTop: 24,
  },
  prevBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#008080",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  prevBtnText: {
    color: "#008080",
    fontSize: 16,
    fontWeight: "600",
  },
  nextBtn: {
    backgroundColor: "#008080",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  nextBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
