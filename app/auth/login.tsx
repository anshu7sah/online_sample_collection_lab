import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  ChevronLeft,
  Sparkles,
} from 'lucide-react-native';
import api from '@/lib/axios';
import { COLORS } from '@/lib/theme';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');
const OTP_LENGTH = 6;

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const mobileRef = useRef<TextInput>(null);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  /* ─── OTP countdown ─── */
  useEffect(() => {
    if (!otpSent) return;
    setTimer(30);
    setCanResend(false);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [otpSent]);

  /* ─── Mutations ─── */
  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/send-otp', { mobile });
      return res.data;
    },
    onSuccess: () => {
      setOtpSent(true);
      setTimeout(() => inputsRef.current[0]?.focus(), 400);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to send OTP';
      Toast.show({ type: 'error', text1: 'Error', text2: msg });
      setOtpSent(true);
      setTimeout(() => inputsRef.current[0]?.focus(), 400);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await api.post('/auth/verify-otp', { mobile, otp: code });
      return res.data;
    },
    onSuccess: async (data) => {
      await AsyncStorage.setItem('token', data.token);
      Keyboard.dismiss();
      Toast.show({ type: 'success', text1: 'Login successful' });
      if (data.isNewUser) {
        router.replace({ pathname: '/auth/signup', params: { mobile } });
      } else {
        router.replace('/(tabs)');
      }
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Login failed';
      Toast.show({ type: 'error', text1: 'Error', text2: msg });
    },
  });

  /* ─── Handlers ─── */
  const handleMobileChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setMobile(cleaned);
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
    const code = newOtp.join('');
    if (code.length === OTP_LENGTH && !code.includes(''))
      verifyOtpMutation.mutate(code);
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#004e56" />
      <LinearGradient
        colors={['#004e56', COLORS.primary, '#008b8b']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative blobs */}
      <View style={s.blob1} />
      <View style={s.blob2} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={[
              s.scroll,
              {
                paddingTop: insets.top + 30,
                paddingBottom: insets.bottom + 30,
              },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {/* ─── Branding ─── */}
            <View style={s.brandWrap}>
              <View style={s.logoShadow}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={s.logo}
                  resizeMode="cover"
                />
              </View>
              <Text style={s.brandName}>Sukra Polyclinic</Text>
              <View style={s.tagRow}>
                <Sparkles size={12} color="rgba(255,255,255,0.7)" />
                <Text style={s.tagText}>Your Health, Our Priority</Text>
              </View>
            </View>

            {/* ─── Main Card ─── */}
            <View style={s.card}>
              {!otpSent ? (
                /* ══════ PHONE SCREEN ══════ */
                <View>
                  <Text style={s.heading}>Welcome Back</Text>
                  <Text style={s.sub}>
                    Enter your mobile number to continue
                  </Text>

                  <Text style={s.fieldLabel}>Mobile Number</Text>
                  <View style={s.phoneRow}>
                    <View style={s.countryBox}>
                      <Text style={s.flagEmoji}>🇳🇵</Text>
                      <Text style={s.countryCode}>+977</Text>
                    </View>
                    <TextInput
                      ref={mobileRef}
                      style={s.phoneInput}
                      placeholder="98XXXXXXXX"
                      placeholderTextColor="#aaa"
                      keyboardType="number-pad"
                      maxLength={10}
                      value={mobile}
                      onChangeText={handleMobileChange}
                      returnKeyType="done"
                      textContentType="telephoneNumber"
                      autoComplete="tel"
                    />
                    {mobile.length === 10 && (
                      <View style={s.checkMark}>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 12,
                            fontWeight: '800',
                          }}
                        >
                          ✓
                        </Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    disabled={mobile.length < 10 || sendOtpMutation.isPending}
                    onPress={() => sendOtpMutation.mutate()}
                    style={{ marginTop: 6 }}
                  >
                    <LinearGradient
                      colors={
                        mobile.length >= 10
                          ? [COLORS.secondary, '#c67510']
                          : ['#ccc', '#bbb']
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={s.ctaGrad}
                    >
                      <Text style={s.ctaLabel}>
                        {sendOtpMutation.isPending ? 'Sending…' : 'Get OTP'}
                      </Text>
                      {!sendOtpMutation.isPending && (
                        <ArrowRight
                          size={18}
                          color="#fff"
                          style={{ marginLeft: 8 }}
                        />
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                /* ══════ OTP SCREEN ══════ */
                <View>
                  <Text style={s.heading}>Verify OTP</Text>
                  <Text style={s.sub}>
                    We sent a 6-digit code to{' '}
                    <Text style={{ fontWeight: '700', color: COLORS.primary }}>
                      +977 {mobile}
                    </Text>
                  </Text>

                  <View style={s.otpRow}>
                    {otp.map((digit, i) => (
                      <TextInput
                        key={i}
                        ref={(r) => {
                          inputsRef.current[i] = r;
                        }}
                        style={[s.otpCell, !!digit && s.otpCellFilled]}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(v) => handleOtpChange(v, i)}
                        onKeyPress={({ nativeEvent }) =>
                          handleKeyPress(nativeEvent.key, i)
                        }
                        selectTextOnFocus
                      />
                    ))}
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    disabled={
                      otp.join('').length < OTP_LENGTH ||
                      verifyOtpMutation.isPending
                    }
                    onPress={() => verifyOtpMutation.mutate(otp.join(''))}
                  >
                    <LinearGradient
                      colors={
                        otp.join('').length >= OTP_LENGTH
                          ? [COLORS.secondary, '#c67510']
                          : ['#ccc', '#bbb']
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={s.ctaGrad}
                    >
                      <ShieldCheck size={18} color="#fff" />
                      <Text style={[s.ctaLabel, { marginLeft: 8 }]}>
                        {verifyOtpMutation.isPending
                          ? 'Verifying…'
                          : 'Verify & Login'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Bottom actions */}
                  <View style={s.otpActions}>
                    <TouchableOpacity
                      style={s.editBtn}
                      onPress={() => {
                        setOtpSent(false);
                        setOtp(Array(OTP_LENGTH).fill(''));
                      }}
                    >
                      <ChevronLeft size={15} color={COLORS.primary} />
                      <Text style={s.editBtnText}>Change Number</Text>
                    </TouchableOpacity>

                    {timer > 0 ? (
                      <View style={s.timerBox}>
                        <Clock size={13} color={COLORS.grey400} />
                        <Text style={s.timerText}>
                          {String(Math.floor(timer / 60)).padStart(2, '0')}:
                          {String(timer % 60).padStart(2, '0')}
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          if (canResend) sendOtpMutation.mutate();
                        }}
                      >
                        <Text style={s.resendText}>Resend Code</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            </View>

            {/* Footer */}
            <Text style={s.footer}>
              By continuing, you agree to our{' '}
              <Text
                style={s.footerLink}
                onPress={() => router.push('/auth/terms')}
              >
                Terms
              </Text>{' '}
              &{' '}
              <Text
                style={s.footerLink}
                onPress={() => router.push('/auth/privacy')}
              >
                Privacy Policy
              </Text>
            </Text>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ════════════════════════════════════════════════
   S T Y L E S
   ════════════════════════════════════════════════ */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.primary },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  /* Blobs */
  blob1: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  blob2: {
    position: 'absolute',
    bottom: -50,
    left: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(239,142,31,0.1)',
  },

  /* Brand */
  brandWrap: { alignItems: 'center', marginBottom: 32 },
  logoShadow: {
    width: 90,
    height: 90,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 14,
  },
  logo: { width: 90, height: 90 },
  brandName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  /* Card */
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.grey800,
    marginBottom: 4,
  },
  sub: {
    fontSize: 14,
    color: COLORS.grey400,
    lineHeight: 21,
    marginBottom: 24,
  },

  /* Phone */
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.grey400,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.grey200,
    marginBottom: 18,
    height: 56,
    paddingHorizontal: 4,
  },
  countryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: COLORS.grey200,
    marginRight: 6,
    height: 32,
  },
  flagEmoji: { fontSize: 18, marginRight: 4 },
  countryCode: { fontSize: 14, fontWeight: '700', color: COLORS.grey700 },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    paddingHorizontal: 8,
    height: '100%',
  },
  checkMark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  /* CTA */
  ctaGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
  },
  ctaLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  /* OTP */
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 22,
  },
  otpCell: {
    flex: 1,
    height: 54,
    backgroundColor: '#F5F7FA',
    borderWidth: 1.5,
    borderColor: COLORS.grey200,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  otpCellFilled: {
    borderColor: COLORS.secondary,
    backgroundColor: '#FFF8F0',
  },
  otpActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
  },
  editBtn: { flexDirection: 'row', alignItems: 'center', padding: 4 },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 2,
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.grey100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timerText: { fontSize: 13, fontWeight: '600', color: COLORS.grey500 },
  resendText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondary,
    padding: 4,
  },

  /* Footer */
  footer: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 28,
    paddingHorizontal: 12,
  },
  footerLink: {
    color: '#fff',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
