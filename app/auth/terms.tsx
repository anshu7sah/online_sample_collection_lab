import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft } from 'lucide-react-native';

const P = '#006d77';
const PD = '#004e56';

export default function Terms() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={PD} />
      <LinearGradient colors={[PD, P]} style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Terms of Service</Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.updated}>Last updated: March 6, 2026</Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.body}>
          By downloading, installing, or using the Sukra Polyclinic mobile
          application ("App"), you agree to be bound by these Terms of Service
          ("Terms"). If you do not agree to these Terms, please do not use the
          App.
        </Text>

        <Text style={styles.sectionTitle}>2. Description of Service</Text>
        <Text style={styles.body}>
          Sukra Polyclinic provides an online platform that allows users to:
          {'\n'}
          {'\n'}• Browse and search for medical laboratory tests and health
          packages{'\n'}• Book sample collection appointments{'\n'}• View test
          results and medical reports{'\n'}• Manage their healthcare profile
          {'\n'}• Access home sample collection services
        </Text>

        <Text style={styles.sectionTitle}>3. User Registration</Text>
        <Text style={styles.body}>
          To access certain features of the App, you must register by providing
          your mobile number and verifying it via OTP. You agree to:{'\n'}
          {'\n'}• Provide accurate and complete information{'\n'}• Keep your
          account credentials secure{'\n'}• Notify us immediately of any
          unauthorized use of your account{'\n'}• Be responsible for all
          activities under your account
        </Text>

        <Text style={styles.sectionTitle}>4. Medical Disclaimer</Text>
        <Text style={styles.body}>
          The App is intended to facilitate laboratory test bookings and sample
          collection. It does not provide medical advice, diagnosis, or
          treatment. Always seek the advice of your physician or qualified
          healthcare provider with any questions regarding a medical condition.
          Test results provided through the App should be interpreted by a
          qualified medical professional.
        </Text>

        <Text style={styles.sectionTitle}>5. Sample Collection</Text>
        <Text style={styles.body}>
          When booking a home sample collection:{'\n'}
          {'\n'}• Ensure the patient is available at the scheduled time{'\n'}•
          Follow any pre-test instructions provided (e.g., fasting requirements)
          {'\n'}• Provide accurate address and contact details{'\n'}•
          Cancellations must be made at least 2 hours before the scheduled time
        </Text>

        <Text style={styles.sectionTitle}>6. Payments & Refunds</Text>
        <Text style={styles.body}>
          All prices displayed are in Nepalese Rupees (NPR). Payment is
          collected at the time of sample collection or as otherwise specified.
          Refunds for cancelled tests will be processed within 7-10 business
          days. Visit charges may be non-refundable if the collection team has
          already been dispatched.
        </Text>

        <Text style={styles.sectionTitle}>7. Intellectual Property</Text>
        <Text style={styles.body}>
          All content, trademarks, and data on the App, including but not
          limited to software, logos, text, graphics, and images, are the
          property of Sukra Polyclinic and are protected by applicable
          intellectual property laws.
        </Text>

        <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
        <Text style={styles.body}>
          Sukra Polyclinic shall not be liable for any indirect, incidental,
          special, or consequential damages resulting from the use or inability
          to use the App, including but not limited to delays in sample
          collection or report generation.
        </Text>

        <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
        <Text style={styles.body}>
          We reserve the right to modify these Terms at any time. Changes will
          be effective immediately upon posting in the App. Your continued use
          of the App after changes constitutes acceptance of the updated Terms.
        </Text>

        <Text style={styles.sectionTitle}>10. Contact Us</Text>
        <Text style={styles.body}>
          If you have questions about these Terms, please contact us at:{'\n'}
          {'\n'}📧 Email: info@sukrapolyclinic.com{'\n'}📞 Phone:
          +977-XXX-XXXXXXX
          {'\n'}📍 Address: Sukra Polyclinic, Nepal
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 22, paddingTop: 24 },
  updated: {
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 22,
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
  },
});
