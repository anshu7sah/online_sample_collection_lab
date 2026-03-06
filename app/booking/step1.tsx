import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import {
  User,
  Phone,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Navigation,
  Hand,
  Loader,
  AlertCircle,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { useBooking } from './BookingContext';
import { useCurrent } from '@/hooks/useCurrent';
import { useGPSLocation } from '@/hooks/useGPSLocation';
import { calculateAge } from '@/lib/calculateAge';
import { COLORS } from '@/lib/theme';

export default function Step1() {
  const router = useRouter();
  const { state, dispatch } = useBooking();
  const { data: user } = useCurrent();

  const [forSelf, setForSelf] = useState(true);
  const [manualLocation, setManualLocation] = useState(false);
  const gps = useGPSLocation();

  useEffect(() => {
    if (forSelf && user) {
      dispatch({
        name: user.name ?? '',
        age: user.dob ? calculateAge(new Date(user.dob)) : '',
        mobile: user.mobile ?? '',
      });
    }
    if (!forSelf) {
      dispatch({ name: '', age: '', mobile: '' });
    }
  }, [forSelf, user]);

  /* ── When GPS resolves, update booking context ── */
  useEffect(() => {
    if (gps.location) {
      dispatch({ location: gps.location });
    }
    if (gps.address) {
      dispatch({ address: gps.address });
    }
  }, [gps.location, gps.address]);

  /* ── Show toast on GPS error ── */
  useEffect(() => {
    if (gps.error) {
      Toast.show({
        type: 'error',
        text1: 'Location Error',
        text2: gps.error,
      });
    }
  }, [gps.error]);

  const useCurrentLocation = async () => {
    setManualLocation(false);
    await gps.fetchLocation();
  };

  useEffect(() => {
    if (!state.location && !manualLocation && !gps.loading) {
      useCurrentLocation();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMapPress = (e: any) => {
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
    <ScrollView
      style={s.root}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header / Back */}
      <View style={s.headerRow}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={24} color={COLORS.grey800} />
        </TouchableOpacity>
      </View>

      {/* Step Indicator */}
      <View style={s.stepRow}>
        {[1, 2, 3].map((n) => (
          <View key={n} style={s.stepItem}>
            <View style={[s.stepCircle, n === 1 && s.stepCircleActive]}>
              <Text style={[s.stepNum, n === 1 && s.stepNumActive]}>{n}</Text>
            </View>
            <Text style={[s.stepLabel, n === 1 && s.stepLabelActive]}>
              {n === 1 ? 'Details' : n === 2 ? 'Schedule' : 'Confirm'}
            </Text>
          </View>
        ))}
      </View>

      {/* Title */}
      <Text style={s.title}>Personal Details</Text>

      {/* For Self / Others */}
      <View style={s.toggleRow}>
        <TouchableOpacity
          style={[s.toggleBtn, forSelf && s.toggleBtnActive]}
          onPress={() => setForSelf(true)}
          activeOpacity={0.7}
        >
          <User size={16} color={forSelf ? '#fff' : COLORS.grey500} />
          <Text style={[s.toggleText, forSelf && s.toggleTextActive]}>
            For Self
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.toggleBtn, !forSelf && s.toggleBtnActive]}
          onPress={() => setForSelf(false)}
          activeOpacity={0.7}
        >
          <User size={16} color={!forSelf ? '#fff' : COLORS.grey500} />
          <Text style={[s.toggleText, !forSelf && s.toggleTextActive]}>
            For Others
          </Text>
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <View style={s.inputGroup}>
        <Text style={s.inputLabel}>Full Name</Text>
        <TextInput
          style={[s.input, forSelf && s.inputDisabled]}
          placeholder="Enter full name"
          placeholderTextColor={COLORS.grey400}
          value={state.name}
          editable={!forSelf}
          onChangeText={(v) => dispatch({ name: v })}
        />
      </View>

      <View style={s.row}>
        <View style={[s.inputGroup, { flex: 1, marginRight: 12 }]}>
          <Text style={s.inputLabel}>Age</Text>
          <TextInput
            style={[s.input, forSelf && s.inputDisabled]}
            placeholder="Age"
            placeholderTextColor={COLORS.grey400}
            keyboardType="numeric"
            value={state.age}
            editable={!forSelf}
            onChangeText={(v) => dispatch({ age: v })}
          />
        </View>
        <View style={[s.inputGroup, { flex: 1 }]}>
          <Text style={s.inputLabel}>Mobile</Text>
          <TextInput
            style={[s.input, forSelf && s.inputDisabled]}
            placeholder="Phone number"
            placeholderTextColor={COLORS.grey400}
            keyboardType="phone-pad"
            value={state.mobile}
            editable={!forSelf}
            onChangeText={(v) => dispatch({ mobile: v })}
          />
        </View>
      </View>

      <View style={s.inputGroup}>
        <Text style={s.inputLabel}>Gender</Text>
        <View style={s.pickerWrap}>
          <Picker
            selectedValue={state.gender}
            onValueChange={(v) => dispatch({ gender: v })}
            style={{ color: COLORS.grey800 }}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="MALE" />
            <Picker.Item label="Female" value="FEMALE" />
            <Picker.Item label="Bisexual" value="BISEXUAL" />
            <Picker.Item label="Transgender" value="TRANSGENDER" />
          </Picker>
        </View>
      </View>

      <View style={s.inputGroup}>
        <Text style={s.inputLabel}>Detailed Address</Text>
        <TextInput
          style={s.input}
          placeholder="Enter your full address"
          placeholderTextColor={COLORS.grey400}
          value={state.address}
          onChangeText={(v) => dispatch({ address: v })}
        />
      </View>

      {/* Location */}
      <Text style={s.inputLabel}>Location</Text>
      <View style={s.locationRow}>
        <TouchableOpacity
          style={[s.locBtn, !manualLocation && s.locBtnActive]}
          onPress={useCurrentLocation}
          activeOpacity={0.7}
          disabled={gps.loading}
        >
          {gps.loading ? (
            <ActivityIndicator
              size={14}
              color={!manualLocation ? '#fff' : COLORS.primary}
            />
          ) : (
            <Navigation
              size={14}
              color={!manualLocation ? '#fff' : COLORS.grey500}
            />
          )}
          <Text style={[s.locBtnText, !manualLocation && s.locBtnTextActive]}>
            {gps.loading ? 'Fetching...' : 'Current Location'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.locBtn, manualLocation && s.locBtnActive]}
          onPress={() => setManualLocation(true)}
          activeOpacity={0.7}
        >
          <Hand size={14} color={manualLocation ? '#fff' : COLORS.grey500} />
          <Text style={[s.locBtnText, manualLocation && s.locBtnTextActive]}>
            Set Manually
          </Text>
        </TouchableOpacity>
      </View>

      <MapView
        style={s.map}
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
        <View style={s.locConfirm}>
          <MapPin size={14} color={COLORS.success} />
          <Text style={s.locConfirmText}>
            {state.address
              ? state.address
              : `Location set (${state.location.latitude.toFixed(4)}, ${state.location.longitude.toFixed(4)})`}
          </Text>
        </View>
      )}

      {gps.error && (
        <View style={s.locError}>
          <AlertCircle size={14} color={COLORS.error} />
          <Text style={s.locErrorText}>{gps.error}</Text>
        </View>
      )}

      {/* Next */}
      <TouchableOpacity
        style={[s.nextBtn, !isValid && { opacity: 0.4 }]}
        disabled={!isValid}
        activeOpacity={0.8}
        onPress={() => router.push('/booking/step2')}
      >
        <Text style={s.nextBtnText}>Next</Text>
        <ChevronRight size={18} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, padding: 20, backgroundColor: '#F5F7FA' },

  headerRow: {
    marginBottom: 20,
    marginTop: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  /* Step Indicator */
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

  /* Toggle */
  toggleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  toggleBtnActive: { backgroundColor: COLORS.primary },
  toggleText: { fontWeight: '600', color: COLORS.grey500 },
  toggleTextActive: { color: '#fff' },

  /* Inputs */
  inputGroup: { marginBottom: 16 },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.grey500,
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    fontSize: 15,
    color: COLORS.grey800,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  inputDisabled: { backgroundColor: COLORS.grey100, color: COLORS.grey400 },
  row: { flexDirection: 'row' },
  pickerWrap: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },

  /* Location */
  locationRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    marginTop: 6,
  },
  locBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  locBtnActive: { backgroundColor: COLORS.primary },
  locBtnText: { color: COLORS.grey500, fontWeight: '600', fontSize: 13 },
  locBtnTextActive: { color: '#fff' },

  map: { height: 180, borderRadius: 16, marginBottom: 12 },

  locConfirm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.successLight,
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  locConfirmText: {
    fontSize: 13,
    color: COLORS.success,
    fontWeight: '600',
    flex: 1,
  },
  locError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.errorLight,
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  locErrorText: {
    fontSize: 13,
    color: COLORS.error,
    fontWeight: '600',
    flex: 1,
  },

  /* Next */
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
