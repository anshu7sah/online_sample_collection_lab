import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  StatusBar,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Bell,
  Moon,
  Fingerprint,
  ScanFace,
  Smartphone,
} from 'lucide-react-native';
import { COLORS } from '@/lib/theme';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import * as LocalAuthentication from 'expo-local-authentication';

export default function SettingsScreen() {
  const router = useRouter();
  const { state, dispatch } = useApp();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [biometrics, setBiometrics] = useState(state.biometricsEnabled);

  // Detect what biometric types are available on this device
  const [hasFaceId, setHasFaceId] = useState(false);
  const [hasFingerprint, setHasFingerprint] = useState(false);
  const [biometricType, setBiometricType] = useState<
    'face' | 'fingerprint' | null
  >(null);

  useEffect(() => {
    (async () => {
      try {
        const types =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        setHasFaceId(
          types.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
          ),
        );
        setHasFingerprint(
          types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT),
        );

        // Load previously saved biometric type preference
        const savedType = await AsyncStorage.getItem('biometricType');
        if (savedType === 'face' || savedType === 'fingerprint') {
          setBiometricType(savedType);
        }
      } catch (e) {
        console.error('Error detecting biometric types:', e);
      }
    })();
  }, []);

  const enableBiometric = async (type: 'face' | 'fingerprint') => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        alert("Your device doesn't support biometrics.");
        return;
      }
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        alert(
          type === 'face'
            ? 'No Face ID / face recognition is set up on this device. Please set it up in your device settings first.'
            : 'No fingerprint is set up on this device. Please set it up in your device settings first.',
        );
        return;
      }

      const promptMessage =
        type === 'face'
          ? 'Authenticate with Face ID to enable it'
          : 'Authenticate with Fingerprint to enable it';

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Use password',
      });

      if (result.success) {
        setBiometrics(true);
        setBiometricType(type);
        dispatch({ type: 'SET_BIOMETRICS', payload: true });
        await AsyncStorage.setItem('biometricsEnabled', 'true');
        await AsyncStorage.setItem('biometricType', type);
      }
    } catch (e) {
      console.error('Biometric error: ', e);
    }
  };

  const disableBiometric = async () => {
    setBiometrics(false);
    setBiometricType(null);
    dispatch({ type: 'SET_BIOMETRICS', payload: false });
    await AsyncStorage.setItem('biometricsEnabled', 'false');
    await AsyncStorage.removeItem('biometricType');
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ChevronLeft size={24} color={COLORS.grey800} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.content}
      >
        {/* Notifications */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Notifications</Text>
          <View style={s.card}>
            <View style={s.row}>
              <View style={s.rowLeft}>
                <View style={[s.iconBox, { backgroundColor: '#FEF3C7' }]}>
                  <Bell size={20} color="#F59E0B" />
                </View>
                <Text style={s.rowTitle}>Push Notifications</Text>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{
                  false: COLORS.grey200,
                  true: COLORS.primaryLight,
                }}
                thumbColor={pushEnabled ? COLORS.primary : '#f4f3f4'}
              />
            </View>
            <View style={[s.row, { borderBottomWidth: 0 }]}>
              <View style={s.rowLeft}>
                <View style={[s.iconBox, { backgroundColor: '#E0E7FF' }]}>
                  <Bell size={20} color="#6366F1" />
                </View>
                <Text style={s.rowTitle}>Email Updates</Text>
              </View>
              <Switch
                value={emailEnabled}
                onValueChange={setEmailEnabled}
                trackColor={{
                  false: COLORS.grey200,
                  true: COLORS.primaryLight,
                }}
                thumbColor={emailEnabled ? COLORS.primary : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Appearance */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Appearance</Text>
          <View style={s.card}>
            <View style={[s.row, { borderBottomWidth: 0 }]}>
              <View style={s.rowLeft}>
                <View style={[s.iconBox, { backgroundColor: '#F1F5F9' }]}>
                  <Moon size={20} color="#64748B" />
                </View>
                <Text style={s.rowTitle}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{
                  false: COLORS.grey200,
                  true: COLORS.primaryLight,
                }}
                thumbColor={darkMode ? COLORS.primary : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Security - Biometrics */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Security</Text>
          <View style={s.card}>
            {/* Face ID / Face Recognition */}
            {hasFaceId && (
              <View style={s.row}>
                <View style={s.rowLeft}>
                  <View style={[s.iconBox, { backgroundColor: '#DBEAFE' }]}>
                    <ScanFace size={20} color="#3B82F6" />
                  </View>
                  <View>
                    <Text style={s.rowTitle}>
                      {Platform.OS === 'ios' ? 'Face ID' : 'Face Unlock'}
                    </Text>
                    {biometrics && biometricType === 'face' && (
                      <Text style={s.rowSubtitle}>Active</Text>
                    )}
                  </View>
                </View>
                <Switch
                  value={biometrics && biometricType === 'face'}
                  onValueChange={async (value) => {
                    if (value) {
                      await enableBiometric('face');
                    } else {
                      await disableBiometric();
                    }
                  }}
                  trackColor={{
                    false: COLORS.grey200,
                    true: COLORS.primaryLight,
                  }}
                  thumbColor={
                    biometrics && biometricType === 'face'
                      ? COLORS.primary
                      : '#f4f3f4'
                  }
                />
              </View>
            )}

            {/* Fingerprint */}
            {hasFingerprint && (
              <View
                style={[
                  s.row,
                  !hasFaceId && { borderBottomWidth: 0 },
                  hasFaceId && !hasFingerprint && { borderBottomWidth: 0 },
                ]}
              >
                <View style={s.rowLeft}>
                  <View style={[s.iconBox, { backgroundColor: '#FCE7F3' }]}>
                    <Fingerprint size={20} color="#EC4899" />
                  </View>
                  <View>
                    <Text style={s.rowTitle}>Fingerprint</Text>
                    {biometrics && biometricType === 'fingerprint' && (
                      <Text style={s.rowSubtitle}>Active</Text>
                    )}
                  </View>
                </View>
                <Switch
                  value={biometrics && biometricType === 'fingerprint'}
                  onValueChange={async (value) => {
                    if (value) {
                      await enableBiometric('fingerprint');
                    } else {
                      await disableBiometric();
                    }
                  }}
                  trackColor={{
                    false: COLORS.grey200,
                    true: COLORS.primaryLight,
                  }}
                  thumbColor={
                    biometrics && biometricType === 'fingerprint'
                      ? COLORS.primary
                      : '#f4f3f4'
                  }
                />
              </View>
            )}

            {/* Fallback if no biometrics available at all */}
            {!hasFaceId && !hasFingerprint && (
              <View style={[s.row, { borderBottomWidth: 0 }]}>
                <View style={s.rowLeft}>
                  <View style={[s.iconBox, { backgroundColor: '#F1F5F9' }]}>
                    <Smartphone size={20} color="#64748B" />
                  </View>
                  <Text style={s.rowTitle}>Biometrics Unavailable</Text>
                </View>
                <Text style={s.unavailableText}>Not supported</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey50,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.grey50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.grey800,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.grey400,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey50,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.grey800,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  rowSubtitle: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
    marginTop: 2,
  },
  unavailableText: {
    fontSize: 13,
    color: COLORS.grey400,
    fontWeight: '500',
  },
});
