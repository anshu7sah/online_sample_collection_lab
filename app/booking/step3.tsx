import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { useBooking } from './BookingContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Calendar,
  Clock,
  Upload,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
} from 'lucide-react-native';
import { COLORS } from '@/lib/theme';

const TIME_SLOTS = [
  '08:00-09:00',
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
  '17:00-18:00',
];

const DOCTORS = ['Dr. S. Yadav', 'Dr. R. Jha'];

export default function Step2() {
  const { state, dispatch } = useBooking();
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const pickPrescription = async () => {
    const res = await DocumentPicker.getDocumentAsync({});
    if (!res.canceled) dispatch({ prescriptionFile: res.assets[0] });
  };

  const setQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    dispatch({ date: date.toISOString().split('T')[0] });
  };

  const handleCustomDate = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate)
      dispatch({ date: selectedDate.toISOString().split('T')[0] });
  };

  const isValid =
    state.date &&
    state.timeSlot &&
    (!state.hasPrescription || state.prescriptionFile);

  return (
    <ScrollView
      style={s.root}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.stepRow}>
        {[1, 2, 3, 4].map((n) => (
          <View key={n} style={s.stepItem}>
            <View style={[s.stepCircle, n <= 3 && s.stepCircleActive]}>
              <Text style={[s.stepNum, n <= 3 && s.stepNumActive]}>{n}</Text>
            </View>
            <Text style={[s.stepLabel, n <= 3 && s.stepLabelActive]}>
              {n === 1
                ? 'Details'
                : n === 2
                  ? 'Address'
                  : n === 3
                    ? 'Schedule'
                    : 'Confirm'}
            </Text>
          </View>
        ))}
      </View>

      <Text style={s.title}>Schedule Appointment</Text>

      {/* ═══ Quick Date ═══ */}
      <Text style={s.sectionLabel}>Select Date</Text>
      <View style={s.quickDateRow}>
        {['Today', 'Tomorrow', 'Day After'].map((label, idx) => {
          const date = new Date();
          date.setDate(date.getDate() + idx);
          const iso = date.toISOString().split('T')[0];
          const active = state.date === iso;
          return (
            <TouchableOpacity
              key={label}
              style={[s.quickDateBtn, active && s.quickDateBtnActive]}
              onPress={() => setQuickDate(idx)}
              activeOpacity={0.7}
            >
              <Calendar size={14} color={active ? '#fff' : COLORS.grey400} />
              <Text style={[s.quickDateText, active && s.quickDateTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={s.datePickerBtn}
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.7}
      >
        <Calendar size={16} color={COLORS.grey400} />
        <Text style={s.datePickerText}>
          {state.date || 'Choose custom date...'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={state.date ? new Date(state.date) : new Date()}
          mode="date"
          onChange={handleCustomDate}
        />
      )}

      {/* ═══ Time Slots ═══ */}
      {state.date && (
        <>
          <Text style={s.sectionLabel}>Select Time Slot</Text>
          <View style={s.timeGrid}>
            {TIME_SLOTS.map((slot) => {
              const active = state.timeSlot === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  style={[s.timeSlot, active && s.timeSlotActive]}
                  onPress={() => dispatch({ timeSlot: slot })}
                  activeOpacity={0.7}
                >
                  <Clock size={12} color={active ? '#fff' : COLORS.primary} />
                  <Text
                    style={[s.timeSlotText, active && s.timeSlotTextActive]}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      {/* ═══ Prescription ═══ */}
      <View style={s.checkboxRow}>
        <Checkbox.Android
          status={state.hasPrescription ? 'checked' : 'unchecked'}
          onPress={() => dispatch({ hasPrescription: !state.hasPrescription })}
          color={COLORS.primary}
        />
        <Text style={s.checkboxLabel}>I have a prescription</Text>
      </View>

      {state.hasPrescription && (
        <View style={s.uploadSection}>
          {!state.prescriptionFile ? (
            <TouchableOpacity
              style={s.uploadBtn}
              onPress={pickPrescription}
              activeOpacity={0.7}
            >
              <Upload size={18} color={COLORS.primary} />
              <Text style={s.uploadBtnText}>Upload Prescription</Text>
            </TouchableOpacity>
          ) : (
            <View style={s.fileCard}>
              <FileText size={18} color={COLORS.primary} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={s.fileLabel}>Uploaded</Text>
                <Text style={s.fileName} numberOfLines={1}>
                  {state.prescriptionFile.name}
                </Text>
              </View>
              <TouchableOpacity
                style={s.fileRemove}
                onPress={() => dispatch({ prescriptionFile: null })}
              >
                <X size={14} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* ═══ Doctor ═══ */}
      <View style={s.checkboxRow}>
        <Checkbox.Android
          status={state.prcDoctor ? 'checked' : 'unchecked'}
          onPress={() =>
            dispatch({ prcDoctor: state.prcDoctor ? '' : DOCTORS[0] })
          }
          color={COLORS.primary}
        />
        <Text style={s.checkboxLabel}>Post Report Consultation</Text>
      </View>

      {state.prcDoctor && (
        <View style={s.doctorList}>
          {DOCTORS.map((d) => {
            const active = state.prcDoctor === d;
            return (
              <TouchableOpacity
                key={d}
                style={[s.doctorCard, active && s.doctorCardActive]}
                onPress={() => dispatch({ prcDoctor: d })}
                activeOpacity={0.7}
              >
                <Stethoscope
                  size={16}
                  color={active ? '#fff' : COLORS.primary}
                />
                <Text style={[s.doctorText, active && s.doctorTextActive]}>
                  {d}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* ═══ Navigation ═══ */}
      <View style={s.navRow}>
        <TouchableOpacity
          style={s.prevBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={18} color={COLORS.primary} />
          <Text style={s.prevBtnText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.nextBtn, !isValid && { opacity: 0.4 }]}
          disabled={!isValid}
          activeOpacity={0.8}
          onPress={() => router.push('/booking/step4')}
        >
          <Text style={s.nextBtnText}>Next</Text>
          <ChevronRight size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, padding: 20, backgroundColor: '#F5F7FA' },

  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 24,
    marginHorizontal: 16,
  },
  stepItem: { alignItems: 'center' },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.grey200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepCircleActive: { backgroundColor: COLORS.primary },
  stepNum: { fontSize: 14, fontWeight: '700', color: COLORS.grey400 },
  stepNumActive: { color: '#fff' },
  stepLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.grey400,
    textAlign: 'center',
  },
  stepLabelActive: { color: COLORS.primary },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.grey800,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.grey500,
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 2,
  },

  /* Quick Date */
  quickDateRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  quickDateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  quickDateBtnActive: { backgroundColor: COLORS.primary },
  quickDateText: { fontWeight: '600', fontSize: 12, color: COLORS.grey500 },
  quickDateTextActive: { color: '#fff' },

  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  datePickerText: { fontSize: 14, color: COLORS.grey500 },

  /* Time Slots */
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '48%',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    backgroundColor: '#fff',
  },
  timeSlotActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeSlotText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  timeSlotTextActive: { color: '#fff' },

  /* Checkbox */
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  checkboxLabel: { fontSize: 15, fontWeight: '600', color: COLORS.grey700 },

  /* Upload */
  uploadSection: { marginBottom: 8, marginLeft: 8 },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  uploadBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.grey200,
  },
  fileLabel: { fontSize: 11, color: COLORS.grey400 },
  fileName: { fontSize: 14, fontWeight: '600', color: COLORS.grey800 },
  fileRemove: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  /* Doctor */
  doctorList: { gap: 8, marginTop: 8, marginLeft: 8 },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  doctorCardActive: { backgroundColor: COLORS.primary },
  doctorText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
  doctorTextActive: { color: '#fff' },

  /* Nav */
  navRow: { flexDirection: 'row', gap: 12, marginTop: 28 },
  prevBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: '#fff',
  },
  prevBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 15 },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
