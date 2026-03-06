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

export default function Privacy() {
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
            <Text style={styles.headerTitle}>Privacy Policy</Text>
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

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.body}>
          We collect the following types of information when you use the Sukra
          Polyclinic App:{'\n'}
          {'\n'}
          <Text style={styles.bold}>Personal Information:</Text>
          {'\n'}• Full name, date of birth, and gender{'\n'}• Mobile number and
          email address{'\n'}• Home address for sample collection{'\n'}•
          Government-issued ID (when required for verification){'\n'}
          {'\n'}
          <Text style={styles.bold}>Health Information:</Text>
          {'\n'}• Test bookings and results{'\n'}• Medical history relevant to
          test preparation{'\n'}• Prescriptions uploaded for test orders
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.body}>
          We use your information to:{'\n'}
          {'\n'}• Process and manage your test bookings{'\n'}• Coordinate home
          sample collection visits{'\n'}• Deliver your test results securely
          {'\n'}• Send appointment reminders and updates{'\n'}• Improve our
          services and user experience{'\n'}• Comply with legal and regulatory
          requirements{'\n'}• Communicate important health-related notifications
        </Text>

        <Text style={styles.sectionTitle}>3. Data Security</Text>
        <Text style={styles.body}>
          We implement industry-standard security measures to protect your
          personal and health information:{'\n'}
          {'\n'}• End-to-end encryption for data in transit{'\n'}• Secure server
          infrastructure with regular audits{'\n'}• Role-based access controls
          for staff{'\n'}• Regular security assessments and updates{'\n'}•
          Compliance with healthcare data protection standards
        </Text>

        <Text style={styles.sectionTitle}>4. Data Sharing</Text>
        <Text style={styles.body}>
          We do not sell your personal information. We may share your data with:
          {'\n'}
          {'\n'}• Authorized laboratory partners for processing tests{'\n'}•
          Healthcare providers when you explicitly request it{'\n'}• Law
          enforcement when required by applicable law{'\n'}• Service providers
          who assist in operating our App (under strict confidentiality
          agreements)
        </Text>

        <Text style={styles.sectionTitle}>5. Data Retention</Text>
        <Text style={styles.body}>
          We retain your personal information for as long as your account is
          active or as needed to provide services. Medical records and test
          results are retained as required by applicable healthcare regulations
          (minimum 5 years). You may request deletion of your account data by
          contacting us.
        </Text>

        <Text style={styles.sectionTitle}>6. Your Rights</Text>
        <Text style={styles.body}>
          You have the right to:{'\n'}
          {'\n'}• Access your personal data stored with us{'\n'}• Request
          correction of inaccurate information{'\n'}• Request deletion of your
          account and associated data{'\n'}• Withdraw consent for marketing
          communications{'\n'}• Export your medical records and test results
          {'\n'}• Lodge a complaint regarding data handling
        </Text>

        <Text style={styles.sectionTitle}>7. Cookies & Analytics</Text>
        <Text style={styles.body}>
          The App may use analytics tools to understand usage patterns and
          improve performance. These tools collect anonymized data such as
          device type, operating system, and general usage statistics. No
          personally identifiable health information is used for analytics
          purposes.
        </Text>

        <Text style={styles.sectionTitle}>8. Third-Party Links</Text>
        <Text style={styles.body}>
          Our App may contain links to third-party websites or services. We are
          not responsible for the privacy practices of these external services.
          We encourage you to review their privacy policies before providing
          personal information.
        </Text>

        <Text style={styles.sectionTitle}>9. Children's Privacy</Text>
        <Text style={styles.body}>
          Our App is not intended for children under 16 years of age. Test
          bookings for minors must be made by a parent or legal guardian. We do
          not knowingly collect personal information from children without
          parental consent.
        </Text>

        <Text style={styles.sectionTitle}>10. Changes to This Policy</Text>
        <Text style={styles.body}>
          We may update this Privacy Policy periodically. We will notify you of
          significant changes through the App or via your registered contact
          details. Continued use of the App after changes constitutes acceptance
          of the updated policy.
        </Text>

        <Text style={styles.sectionTitle}>11. Contact Us</Text>
        <Text style={styles.body}>
          For privacy-related inquiries or to exercise your data rights, contact
          us at:{'\n'}
          {'\n'}📧 Email: privacy@sukrapolyclinic.com{'\n'}📞 Phone:
          +977-XXX-XXXXXXX{'\n'}📍 Address: Sukra Polyclinic, Nepal{'\n'}
          {'\n'}Data Protection Officer: Available upon request
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
  bold: {
    fontWeight: '700',
    color: '#333',
  },
});
