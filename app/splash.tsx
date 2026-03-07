import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { COLORS } from '@/lib/theme';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { state } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const tagFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(tagFade, {
        toValue: 1,
        duration: 600,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!state.authReady) return;

    const checkBiometricsAndNavigate = async () => {
      if (state.token) {
        if (state.biometricsEnabled) {
          try {
            // Read the saved biometric type to show the correct prompt
            const biometricType = await AsyncStorage.getItem('biometricType');
            let promptMessage = 'Unlock Sukra Polyclinic';
            if (biometricType === 'face') {
              promptMessage =
                Platform.OS === 'ios'
                  ? 'Unlock with Face ID'
                  : 'Unlock with Face Recognition';
            } else if (biometricType === 'fingerprint') {
              promptMessage = 'Unlock with Fingerprint';
            }

            const result = await LocalAuthentication.authenticateAsync({
              promptMessage,
              fallbackLabel: 'Use Mobile Number',
            });
            if (result.success) {
              router.replace('/(tabs)');
            } else {
              router.replace('/auth/login');
            }
          } catch (e) {
            console.error('Biometric prompt error', e);
            router.replace('/auth/login');
          }
        } else {
          router.replace('/(tabs)');
        }
      } else {
        router.replace('/auth/login');
      }
    };

    const timer = setTimeout(() => {
      checkBiometricsAndNavigate();
    }, 3000);
    return () => clearTimeout(timer);
  }, [state.authReady, state.token, state.biometricsEnabled]);

  return (
    <LinearGradient
      colors={['#004e56', COLORS.primary, '#00888a']}
      locations={[0, 0.5, 1]}
      style={s.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#004e56" />

      {/* Decorative circles */}
      <View style={s.deco1} />
      <View style={s.deco2} />
      <View style={s.deco3} />

      <Animated.View
        style={[
          s.logoWrap,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={s.logoBg}>
          <Image
            source={require('../assets/logo.png')}
            style={s.logo}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      <Animated.Text style={[s.title, { opacity: fadeAnim }]}>
        Sukra Polyclinic
      </Animated.Text>

      <Animated.Text style={[s.tagline, { opacity: tagFade }]}>
        Your health, our priority
      </Animated.Text>

      {/* Bottom loader */}
      <Animated.View style={[s.loaderWrap, { opacity: tagFade }]}>
        <View style={s.loaderTrack}>
          <Animated.View style={s.loaderBar} />
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  deco1: {
    position: 'absolute',
    top: -width * 0.2,
    right: -width * 0.15,
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  deco2: {
    position: 'absolute',
    bottom: -width * 0.15,
    left: -width * 0.2,
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: 'rgba(239,142,31,0.06)',
  },
  deco3: {
    position: 'absolute',
    top: width * 0.3,
    left: -width * 0.1,
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  logoWrap: { marginBottom: 24 },
  logoBg: {
    width: 130,
    height: 130,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 100, height: 100 },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
    fontStyle: 'italic',
  },

  loaderWrap: { position: 'absolute', bottom: 80, width: 120 },
  loaderTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderBar: {
    width: '40%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 2,
  },
});
