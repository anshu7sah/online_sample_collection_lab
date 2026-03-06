import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from '@/components/Map';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  Navigation,
  Hand,
  MapPin,
  AlertCircle,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useBooking } from './BookingContext';
import { useGPSLocation } from '@/hooks/useGPSLocation';
import { COLORS } from '@/lib/theme';

export default function Step2() {
  const router = useRouter();
  const { state, dispatch } = useBooking();

  const gps = useGPSLocation();

  useEffect(() => {
    if (gps.location) dispatch({ location: gps.location });
    if (gps.address) dispatch({ address: gps.address });
  }, [gps.location, gps.address]);

  useEffect(() => {
    if (gps.error)
      Toast.show({ type: 'error', text1: 'Location Error', text2: gps.error });
  }, [gps.error]);

  const useCurrentLocation = async () => {
    await gps.fetchLocation();
  };
  useEffect(() => {
    if (!state.location && !gps.loading) useCurrentLocation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!state.address || state.address.trim() === '') return;
    const timeoutId = setTimeout(async () => {
      try {
        const results = await Location.geocodeAsync(state.address);
        if (results && results.length > 0) {
          dispatch({
            location: {
              latitude: results[0].latitude,
              longitude: results[0].longitude,
            },
          });
        }
      } catch (err) {
        console.log('Error forward geocoding:', err);
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [state.address]);

  const handleMapPress = async (e: any) => {
    const { coordinate } = e.nativeEvent;
    dispatch({ location: coordinate });

    try {
      const [place] = await Location.reverseGeocodeAsync({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });

      if (place) {
        const addrTokens = [
          place.name,
          place.street,
          place.city,
          place.region,
        ].filter(Boolean);
        if (addrTokens.length > 0) {
          dispatch({ address: addrTokens.join(', ') });
        }
      }
    } catch (err) {
      console.log('Error reverse geocoding map press:', err);
    }
  };

  const isValid =
    state.address && state.address.trim() !== '' && state.location;

  return (
    <ScrollView
      style={s.root}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
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

      <View style={s.stepRow}>
        {[1, 2, 3, 4].map((n) => (
          <View key={n} style={s.stepItem}>
            <View style={[s.stepCircle, n <= 2 && s.stepCircleActive]}>
              <Text style={[s.stepNum, n <= 2 && s.stepNumActive]}>{n}</Text>
            </View>
            <Text style={[s.stepLabel, n <= 2 && s.stepLabelActive]}>
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

      <Text style={s.title}>Location & Address</Text>

      <View style={s.inputGroup}>
        <Text style={s.inputLabel}>Detailed Address</Text>
        <TextInput
          style={[s.input, { height: 80, textAlignVertical: 'top' }]}
          placeholder="Complete Address (House No, Building, Street)"
          placeholderTextColor={COLORS.grey400}
          value={state.address}
          onChangeText={(v) => dispatch({ address: v })}
          multiline
        />
      </View>

      <Text style={s.inputLabel}>Pin Location on Map</Text>
      <View style={s.locationRow}>
        <TouchableOpacity
          style={[s.locBtn, s.locBtnActive]}
          onPress={useCurrentLocation}
          activeOpacity={0.7}
          disabled={gps.loading}
        >
          {gps.loading ? (
            <ActivityIndicator size={14} color={'#fff'} />
          ) : (
            <Navigation size={14} color={'#fff'} />
          )}
          <Text style={[s.locBtnText, s.locBtnTextActive]}>
            {gps.loading ? 'Fetching...' : 'Use Current Location'}
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
          onPress={() => router.push('/booking/step3')}
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
  headerRow: { marginBottom: 20, marginTop: 10 },
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
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 24,
    marginHorizontal: 16,
  },
  stepItem: { alignItems: 'center', flex: 1 },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.grey200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepCircleActive: { backgroundColor: COLORS.primary },
  stepNum: { fontSize: 13, fontWeight: '700', color: COLORS.grey400 },
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
  inputGroup: { marginBottom: 16 },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.grey500,
    marginBottom: 8,
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
  locationRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    marginTop: 4,
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
  map: { height: 280, borderRadius: 16, marginBottom: 12 },
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
