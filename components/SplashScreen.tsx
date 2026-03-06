import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Heart, Activity, Shield } from 'lucide-react-native';
import { COLORS } from '@/lib/theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);
  const rotateAnim = new Animated.Value(0);
  const translateYAnim = new Animated.Value(50);
  const pulseAnim = new Animated.Value(1);

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    // Logo entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for the outer ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Navigate to main app
    const timer = setTimeout(() => {
      onFinish();
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        {[...Array(3)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.patternCircle,
              {
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.1 + i * 0.05],
                }),
                transform: [
                  { scale: pulseAnim },
                  { translateX: -150 + i * 50 },
                  { translateY: -100 + i * 40 },
                ],
              },
            ]}
          />
        ))}
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
          },
        ]}
      >
        {/* Animated Logo Container */}
        <View style={styles.logoWrapper}>
          {/* Outer Ring */}
          <Animated.View
            style={[
              styles.outerRing,
              {
                transform: [
                  { scale: pulseAnim },
                  { rotate: rotateInterpolation },
                ],
              },
            ]}
          >
            <View style={styles.ringInner} />
          </Animated.View>

          {/* Inner Ring */}
          <Animated.View
            style={[
              styles.innerRing,
              {
                transform: [
                  { scale: scaleAnim },
                  { rotate: rotateInterpolation },
                ],
              },
            ]}
          />

          {/* Logo Container */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Heart size={48} color={COLORS.primary} />
          </Animated.View>
        </View>

        {/* Brand Name */}
        <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
          Sukra
        </Animated.Text>
        <Animated.Text style={[styles.titleAccent, { opacity: fadeAnim }]}>
          Polyclinic
        </Animated.Text>

        {/* Tagline */}
        <View style={styles.taglineContainer}>
          <Activity size={18} color={COLORS.secondary} />
          <Text style={styles.subtitle}>Your Health, Our Priority</Text>
          <Shield size={18} color={COLORS.secondary} />
        </View>

        {/* Loading Dots */}
        <View style={styles.loadingContainer}>
          {[...Array(3)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.loadingDot,
                {
                  backgroundColor: COLORS.secondary,
                  transform: [
                    {
                      scale: pulseAnim.interpolate({
                        inputRange: [1, 1.2],
                        outputRange: [0.8, 1.2],
                      }),
                    },
                  ],
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5 + i * 0.25],
                  }),
                },
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary, // #006d77
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  patternCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.secondary, // #ef8e1f
    opacity: 0.1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoWrapper: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  outerRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    opacity: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderStyle: 'dashed',
  },
  innerRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: 'rgba(239, 142, 31, 0.3)',
  },
  logoContainer: {
    width: 90,
    height: 90,
    backgroundColor: '#FFFFFF',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'center',
  },
  titleAccent: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.secondary, // #ef8e1f
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
});
