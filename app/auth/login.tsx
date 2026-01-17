"use client";

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import api from '@/lib/axios';

const OTP_LENGTH = 6;

export default function Login() {
  const router = useRouter();
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [otpSent, setOtpSent] = useState(false);

  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/send-otp', { mobile });
      return res.data;
    },
    onSuccess: () => {
      setOtpSent(true);
      setTimeout(() => inputsRef.current[0]?.focus(), 300);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await api.post('/auth/verify-otp', {
        mobile,
        otp: code,
      });
      return res.data;
    },
    onSuccess: async (data) => {
      await AsyncStorage.setItem('token', data.token);
      Keyboard.dismiss();
      console.log("data",data);

      if (data.isNewUser) {
        router.replace({
          pathname: '/auth/signup',
          params: { mobile },
        });
      } else {
        router.replace('/(tabs)');
      }
    },
  });

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // Auto-submit
    const code = newOtp.join('');
    if (code.length === OTP_LENGTH && !code.includes('')) {
      verifyOtpMutation.mutate(code);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <LinearGradient colors={['#009688', '#FF9800']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.card}>
          <Text style={styles.title}>
            {otpSent ? 'Enter OTP' : 'Login / Signup'}
          </Text>

          {!otpSent ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter Mobile Number"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobile}
                onChangeText={setMobile}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={() => sendOtpMutation.mutate()}
              >
                <Text style={styles.buttonText}>Send OTP</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.otpRow}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      inputsRef.current[index] = ref;
                    }}
                    style={styles.otpBox}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(val) => handleOtpChange(val, index)}
                    onKeyPress={({ nativeEvent }) =>
                      handleKeyPress(nativeEvent.key, index)
                    }
                  />
                ))}
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => verifyOtpMutation.mutate(otp.join(''))}
              >
                <Text style={styles.buttonText}>Verify OTP</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 180, height: 180, marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    width: '85%',
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#009688',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#FF9800',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    width: 45,
    height: 50,
  },
});
