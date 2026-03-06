import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { User, Calendar, CheckCircle } from 'lucide-react-native';
import api from '@/lib/axios';
import { COLORS } from '@/lib/theme';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

export default function Signup() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mobile } = useLocalSearchParams();

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const formatDisplay = (date: Date) => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const completeSignupMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/signup', {
        name,
        dob: dob ? formatDate(dob) : '',
        mobile,
      });
      return res.data;
    },
    onSuccess: (data) => {
      // Immediately update user data in cache to reflect that profile is complete
      // and prevent TabLayout redirecting back here
      if (data?.user) {
        queryClient.setQueryData(['current-user'], data.user);
      } else {
        queryClient.invalidateQueries({ queryKey: ['current-user'] });
      }
      Toast.show({ type: 'success', text1: 'Profile created successfully' });
      router.replace('/(tabs)');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to complete signup';
      Toast.show({ type: 'error', text1: 'Error', text2: msg });
    },
  });

  const isValid = name.trim().length > 0 && dob !== null;

  return (
    <LinearGradient
      colors={['#004e56', COLORS.primary, '#00888a']}
      locations={[0, 0.5, 1]}
      style={s.root}
    >
      <StatusBar barStyle="light-content" backgroundColor="#004e56" />

      {/* Decorative circles */}
      <View style={s.deco1} />
      <View style={s.deco2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={s.container} edges={['top', 'bottom']}>
          <ScrollView
            contentContainerStyle={s.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo */}
            <View style={s.logoWrap}>
              <View style={s.logoRing}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={s.logo}
                  resizeMode="cover"
                />
              </View>
              <Text style={s.brandName}>Complete Your Profile</Text>
            </View>

            {/* Card */}
            <View style={s.card}>
              {/* Card body */}
              <View style={s.cardBody}>
                {/* Name Input */}
                <View style={s.inputGroup}>
                  <Text style={s.inputLabel}>FULL NAME</Text>
                  <View style={s.inputWrap}>
                    <User size={18} color={COLORS.grey400} />
                    <TextInput
                      style={s.input}
                      placeholder="Enter your full name"
                      placeholderTextColor={COLORS.grey400}
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                {/* Date of Birth */}
                <View style={s.inputGroup}>
                  <Text style={s.inputLabel}>DATE OF BIRTH</Text>
                  <TouchableOpacity
                    style={s.dateBtn}
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}
                  >
                    <Calendar
                      size={18}
                      color={dob ? COLORS.primary : COLORS.grey400}
                    />
                    <Text style={[s.dateBtnText, dob && s.dateBtnTextFilled]}>
                      {dob ? formatDisplay(dob) : 'Select your date of birth'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Date Picker Modal */}
                {showDatePicker && (
                  <DateTimePicker
                    value={dob || new Date(2000, 0, 1)}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    maximumDate={new Date()}
                    minimumDate={new Date(1930, 0, 1)}
                    onChange={handleDateChange}
                  />
                )}

                {/* Finish Button */}
                <TouchableOpacity
                  style={[s.cta, !isValid && { opacity: 0.5 }]}
                  onPress={() => completeSignupMutation.mutate()}
                  disabled={!isValid || completeSignupMutation.isPending}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={[COLORS.secondary, '#c67510']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={s.ctaGrad}
                  >
                    <CheckCircle size={18} color="#fff" />
                    <Text style={s.ctaText}>
                      {completeSignupMutation.isPending
                        ? 'Finishing…'
                        : 'FINISH'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 30,
  },

  deco1: {
    position: 'absolute',
    top: -width * 0.15,
    right: -width * 0.1,
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  deco2: {
    position: 'absolute',
    bottom: -width * 0.1,
    left: -width * 0.15,
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: 'rgba(239,142,31,0.06)',
  },

  /* Logo */
  logoWrap: { alignItems: 'center', marginBottom: 16 },
  logoRing: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 10,
  },
  logo: { width: 70, height: 70, borderRadius: 18 },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },

  /* Card */
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 12,
  },
  cardTop: {
    padding: 24,
    backgroundColor: COLORS.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,109,119,0.08)',
  },
  title: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', lineHeight: 20 },
  cardBody: { padding: 22 },

  /* Inputs */
  inputGroup: { marginBottom: 18 },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
    marginBottom: 8,
    letterSpacing: 0.8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F6F6F6',
    borderWidth: 1.5,
    borderColor: '#E2E2E2',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: { flex: 1, fontSize: 16, color: '#222' },

  /* Date Button */
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F6F6F6',
    borderWidth: 1.5,
    borderColor: '#E2E2E2',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  dateBtnText: { fontSize: 15, color: COLORS.grey400 },
  dateBtnTextFilled: { color: '#222', fontWeight: '600' },

  /* CTA */
  cta: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  ctaGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 17,
  },
  ctaText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: 0.8,
  },
});
