import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  HelpCircle,
  PhoneCall,
  Mail,
  MessageCircle,
  ChevronRight,
} from 'lucide-react-native';
import { COLORS } from '@/lib/theme';
import { useRouter } from 'expo-router';

export default function HelpSupportScreen() {
  const router = useRouter();

  const handleCall = () => Linking.openURL('tel:+9779800000000');
  const handleEmail = () =>
    Linking.openURL('mailto:support@sukrapolyclinic.com');

  const faqs = [
    {
      q: 'How do I book a test?',
      a: 'You can book a test by navigating to the Tests tab, selecting your desired test, and proceeding to checkout.',
    },
    {
      q: 'When will I get my reports?',
      a: 'Most reports are available within 24 hours of sample collection.',
    },
    {
      q: 'Do you offer home collection?',
      a: 'Yes, we offer home collection services for most tests.',
    },
  ];

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ChevronLeft size={24} color={COLORS.grey800} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.content}
      >
        {/* Contact Options */}
        <View style={s.contactGrid}>
          <TouchableOpacity
            style={s.contactCard}
            onPress={handleCall}
            activeOpacity={0.7}
          >
            <View style={[s.iconWrap, { backgroundColor: '#E0F2FE' }]}>
              <PhoneCall size={24} color="#0284C7" />
            </View>
            <Text style={s.contactLabel}>Call Us</Text>
            <Text style={s.contactSub}>24/7 Support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.contactCard}
            onPress={handleEmail}
            activeOpacity={0.7}
          >
            <View style={[s.iconWrap, { backgroundColor: '#FEF3C7' }]}>
              <Mail size={24} color="#D97706" />
            </View>
            <Text style={s.contactLabel}>Email Us</Text>
            <Text style={s.contactSub}>Usually replies in 2h</Text>
          </TouchableOpacity>
        </View>

        {/* Chat Support */}
        <TouchableOpacity style={s.chatCard} activeOpacity={0.8}>
          <View style={s.chatLeft}>
            <View style={s.chatIconWrap}>
              <MessageCircle size={24} color="#fff" />
            </View>
            <View>
              <Text style={s.chatTitle}>Live Chat Support</Text>
              <Text style={s.chatSub}>Chat with our health advisors</Text>
            </View>
          </View>
          <ChevronRight size={20} color={COLORS.primary} />
        </TouchableOpacity>

        {/* FAQs */}
        <Text style={s.faqSectionTitle}>Frequently Asked Questions</Text>
        <View style={s.faqCard}>
          {faqs.map((faq, index) => (
            <View
              key={index}
              style={[
                s.faqItem,
                index === faqs.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={s.faqQ}>{faq.q}</Text>
              <Text style={s.faqA}>{faq.a}</Text>
            </View>
          ))}
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
  contactGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  contactCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  contactLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.grey800,
    marginBottom: 4,
  },
  contactSub: {
    fontSize: 12,
    color: COLORS.grey400,
  },
  chatCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(0,109,119,0.1)',
  },
  chatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chatTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  chatSub: {
    fontSize: 13,
    color: COLORS.grey500,
  },
  faqSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.grey800,
    marginBottom: 16,
  },
  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey50,
  },
  faqQ: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.grey800,
    marginBottom: 8,
  },
  faqA: {
    fontSize: 14,
    color: COLORS.grey500,
    lineHeight: 22,
  },
});
