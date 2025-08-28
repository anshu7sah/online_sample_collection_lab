import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';

export default function SplashScreen() {
  const router = useRouter();
  const { state } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      if (state.isAuthenticated) {
        router.replace('/(tabs)'); // home if logged in
      } else {
        router.replace('/auth/login'); // login if not
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [state.isAuthenticated]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
        Sukra Polyclinic
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: { width: 150, height: 150, marginBottom: 20 },
  text: { fontSize: 24, fontWeight: '700', color: '#0ea5e9' },
});
