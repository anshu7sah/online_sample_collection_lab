import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useBooking } from './BookingContext';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';
import { useCreateBooking } from '@/hooks/useCreateBooking';
import {
  User,
  Calendar,
  ShoppingCart,
  CreditCard,
  ChevronLeft,
  CheckCircle,
  MapPin,
  Phone,
  Clock,
  FileText,
  Stethoscope,
} from 'lucide-react-native';
import { COLORS } from '@/lib/theme';

const PAYMENT_MODES = [
  { key: 'PAY_LATER', label: 'Pay Later', icon: Clock },
  { key: 'ESEWA', label: 'eSewa', icon: CreditCard },
  { key: 'KHALTI', label: 'Khalti', icon: CreditCard },
  { key: 'BANK_TRANSFER', label: 'Bank Transfer', icon: CreditCard },
];

export default function Step3() {
  const { state: bookingState } = useBooking();
  const { state: appState, dispatch } = useApp();
  const router = useRouter();
  const { mutate: createBooking, isPending } = useCreateBooking();

  const cart = appState.cart || [];
  const totalAmount = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const [selectedPayment, setSelectedPayment] = useState('PAY_LATER');

  const confirmBooking = async () => {
    try {
      const formData = new FormData();
      if (bookingState.hasPrescription && bookingState.prescriptionFile) {
        formData.append('file', {
          uri: bookingState.prescriptionFile.uri,
          name: bookingState.prescriptionFile.name,
          type:
            bookingState.prescriptionFile.mimeType ||
            'application/octet-stream',
        } as any);
      }
      formData.append('name', bookingState.name);
      formData.append('age', bookingState.age.toString());
      formData.append('gender', bookingState.gender);
      formData.append('mobile', bookingState.mobile);
      formData.append('address', bookingState.address);
      formData.append(
        'latitude',
        bookingState.location?.latitude.toString() || '0',
      );
      formData.append(
        'longitude',
        bookingState.location?.longitude.toString() || '0',
      );
      formData.append('date', bookingState.date);
      formData.append('timeSlot', bookingState.timeSlot);
      formData.append('prcDoctor', bookingState.prcDoctor || '');
      formData.append('paymentMode', selectedPayment);
      cart.forEach((item, index) => {
        formData.append(`items[${index}][type]`, item.type);
        formData.append(`items[${index}][name]`, item.name);
        formData.append(`items[${index}][price]`, item.price.toString());
        if (item.type === 'test')
          formData.append(`items[${index}][testId]`, item.id.toString());
        if (item.type === 'package')
          formData.append(`items[${index}][packageId]`, item.id.toString());
      });

      createBooking(formData, {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: 'Booking Confirmed' });
          dispatch({ type: 'CLEAR_CART' });
          router.replace('/(tabs)');
        },
        onError: (error: any) => {
          Toast.show({
            type: 'error',
            text1: error?.response?.data?.message || 'Booking failed',
          });
        },
      });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Booking submission failed' });
    }
  };

  const isDisabled =
    !bookingState.name ||
    !bookingState.date ||
    !bookingState.timeSlot ||
    !bookingState.address ||
    cart.length === 0;

  return (
    <ScrollView
      style={s.root}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Step Indicator */}
      <View style={s.stepRow}>
        {[1, 2, 3].map((n) => (
          <View key={n} style={s.stepItem}>
            <View style={[s.stepCircle, s.stepCircleActive]}>
              <Text style={[s.stepNum, s.stepNumActive]}>{n}</Text>
            </View>
            <Text style={[s.stepLabel, s.stepLabelActive]}>
              {n === 1 ? 'Details' : n === 2 ? 'Schedule' : 'Confirm'}
            </Text>
          </View>
        ))}
      </View>

      <Text style={s.title}>Confirm Booking</Text>

      {/* ═══ Personal Details ═══ */}
      <View style={s.card}>
        <View style={s.cardHeader}>
          <User size={16} color={COLORS.primary} />
          <Text style={s.cardTitle}>Personal Details</Text>
        </View>
        <SummaryRow label="Name" value={bookingState.name} />
        <SummaryRow label="Age" value={bookingState.age} />
        <SummaryRow label="Gender" value={bookingState.gender} />
        <SummaryRow label="Mobile" value={bookingState.mobile} />
        <SummaryRow label="Address" value={bookingState.address} last />
      </View>

      {/* ═══ Appointment Details ═══ */}
      <View style={s.card}>
        <View style={s.cardHeader}>
          <Calendar size={16} color={COLORS.primary} />
          <Text style={s.cardTitle}>Appointment</Text>
        </View>
        <SummaryRow label="Date" value={bookingState.date} />
        <SummaryRow label="Time Slot" value={bookingState.timeSlot} />
        {bookingState.prcDoctor && (
          <SummaryRow label="Doctor" value={bookingState.prcDoctor} />
        )}
        {bookingState.hasPrescription && bookingState.prescriptionFile && (
          <SummaryRow
            label="Prescription"
            value={bookingState.prescriptionFile.name}
            last
          />
        )}
      </View>

      {/* ═══ Cart Summary ═══ */}
      {cart.length > 0 && (
        <View style={s.card}>
          <View style={s.cardHeader}>
            <ShoppingCart size={16} color={COLORS.primary} />
            <Text style={s.cardTitle}>Selected Tests / Packages</Text>
          </View>
          {cart.map((item, i) => (
            <SummaryRow
              key={item.id}
              label={item.name}
              value={`NPR ${Number(item.price)}`}
              last={i === cart.length - 1}
            />
          ))}
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Total Payable</Text>
            <Text style={s.totalValue}>NPR {totalAmount.toLocaleString()}</Text>
          </View>
        </View>
      )}

      {/* ═══ Payment ═══ */}
      <View style={s.card}>
        <View style={s.cardHeader}>
          <CreditCard size={16} color={COLORS.primary} />
          <Text style={s.cardTitle}>Payment Mode</Text>
        </View>
        <View style={s.paymentGrid}>
          {PAYMENT_MODES.map((mode) => {
            const active = selectedPayment === mode.key;
            const Icon = mode.icon;
            return (
              <TouchableOpacity
                key={mode.key}
                style={[s.paymentBtn, active && s.paymentBtnActive]}
                onPress={() => setSelectedPayment(mode.key)}
                activeOpacity={0.7}
              >
                <Icon size={16} color={active ? '#fff' : COLORS.grey500} />
                <Text style={[s.paymentText, active && s.paymentTextActive]}>
                  {mode.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ═══ Navigation ═══ */}
      <View style={s.navRow}>
        <TouchableOpacity
          style={s.prevBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={18} color={COLORS.primary} />
          <Text style={s.prevBtnText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.confirmBtn, (isDisabled || isPending) && { opacity: 0.4 }]}
          disabled={isDisabled || isPending}
          activeOpacity={0.8}
          onPress={confirmBooking}
        >
          <CheckCircle size={18} color="#fff" />
          <Text style={s.confirmBtnText}>
            {isPending ? 'Submitting...' : 'Confirm'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* Helper */
function SummaryRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[sr.row, last && { borderBottomWidth: 0 }]}>
      <Text style={sr.label}>{label}</Text>
      <Text style={sr.value} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const sr = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100,
  },
  label: { fontSize: 13, color: COLORS.grey400, fontWeight: '500' },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.grey800,
    maxWidth: '55%',
    textAlign: 'right',
  },
});

const s = StyleSheet.create({
  root: { flex: 1, padding: 20, backgroundColor: '#F5F7FA' },

  stepRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 24,
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
  stepLabel: { fontSize: 11, fontWeight: '600', color: COLORS.grey400 },
  stepLabelActive: { color: COLORS.primary },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.grey800,
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.primaryDark },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1.5,
    borderTopColor: COLORS.primary,
  },
  totalLabel: { fontSize: 14, fontWeight: '700', color: COLORS.grey800 },
  totalValue: { fontSize: 18, fontWeight: '800', color: COLORS.secondary },

  paymentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  paymentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '47%',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.grey200,
    backgroundColor: '#fff',
  },
  paymentBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  paymentText: { fontSize: 13, fontWeight: '600', color: COLORS.grey500 },
  paymentTextActive: { color: '#fff' },

  navRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
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
  confirmBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
