import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  UserCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
  Shield,
  HelpCircle,
  FileText,
  Heart,
  Star,
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { useCurrent } from '@/hooks/useCurrent';
import { useRouter } from 'expo-router';
import { COLORS } from '@/lib/theme';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { dispatch } = useApp();
  const { data: user, isLoading } = useCurrent();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          dispatch({ type: 'LOGOUT' });
          router.replace('/auth/login');
        },
      },
    ]);
  };

  const getInitials = () => {
    if (!user?.name) return '?';
    return user.name
      .split(' ')
      .map((w: string) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <View style={s.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={s.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  /* ── Menu sections ── */
  const accountItems = [
    {
      icon: Bell,
      title: 'Notifications',
      desc: 'Manage alerts & reminders',
      color: '#F59E0B',
      bg: '#FEF3C7',
      onPress: () => router.push('/profile/notifications' as any),
    },
    {
      icon: Calendar,
      title: 'My Bookings',
      desc: 'View booking history',
      color: COLORS.primary,
      bg: COLORS.primaryLight,
      onPress: () => router.push('/profile/my-bookings' as any),
    },
    {
      icon: MapPin,
      title: 'Saved Addresses',
      desc: 'Home sample collection',
      color: '#DC2626',
      bg: '#FEE2E2',
      onPress: () => router.push('/profile/saved-addresses' as any),
    },
    {
      icon: Heart,
      title: 'Health Records',
      desc: 'Your medical history',
      color: '#EC4899',
      bg: '#FCE7F3',
      onPress: () => router.push('/profile/health-records' as any),
    },
  ];

  const generalItems = [
    {
      icon: Settings,
      title: 'Settings',
      desc: 'Preferences & privacy',
      color: COLORS.grey500,
      bg: COLORS.grey100,
      onPress: () => router.push('/profile/settings' as any),
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      desc: 'FAQs, contact us',
      color: '#3B82F6',
      bg: '#DBEAFE',
      onPress: () => router.push('/profile/help-support' as any),
    },
    {
      icon: FileText,
      title: 'Terms & Privacy',
      desc: 'Legal information',
      color: '#6366F1',
      bg: '#E0E7FF',
      onPress: () => router.push('/auth/terms' as any),
    },
    {
      icon: Star,
      title: 'Rate the App',
      desc: 'Share your feedback',
      color: '#F59E0B',
      bg: '#FEF3C7',
      onPress: () => {
        Alert.alert(
          'Coming Soon',
          'Rating feature will be available in the next app store release.',
        );
      },
    },
  ];

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#004e56" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* ═══ Hero Header ═══ */}
        <LinearGradient
          colors={['#004e56', COLORS.primary, '#00888a']}
          locations={[0, 0.5, 1]}
          style={s.hero}
        >
          <SafeAreaView edges={['top']}>
            <View style={s.heroContent}>
              {/* Avatar */}
              <View style={s.avatarOuter}>
                <LinearGradient
                  colors={[COLORS.secondary, '#d97706']}
                  style={s.avatarGrad}
                >
                  <View style={s.avatarInner}>
                    <Text style={s.avatarText}>{getInitials()}</Text>
                  </View>
                </LinearGradient>
              </View>

              {/* Name & contact */}
              <Text style={s.userName}>{user?.name || 'Unnamed User'}</Text>
              <Text style={s.userSub}>{user?.email || user?.mobile || ''}</Text>

              {/* Stats row */}
              <View style={s.statsRow}>
                <View style={s.statBox}>
                  <Text style={s.statNum}>0</Text>
                  <Text style={s.statLabel}>Tests</Text>
                </View>
                <View style={s.statDivider} />
                <View style={s.statBox}>
                  <Text style={s.statNum}>0</Text>
                  <Text style={s.statLabel}>Reports</Text>
                </View>
                <View style={s.statDivider} />
                <View style={s.statBox}>
                  <Text style={s.statNum}>0</Text>
                  <Text style={s.statLabel}>Bookings</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>

          {/* Decorative */}
          <View style={s.deco1} />
          <View style={s.deco2} />
        </LinearGradient>

        {/* ═══ Contact Info Card ═══ */}
        <View style={s.infoCardWrap}>
          <View style={s.infoCard}>
            {user?.mobile && (
              <View style={s.infoRow}>
                <View
                  style={[s.infoIcon, { backgroundColor: COLORS.primaryLight }]}
                >
                  <Phone size={16} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.infoLabel}>Phone</Text>
                  <Text style={s.infoValue}>{user.mobile}</Text>
                </View>
              </View>
            )}
            {user?.email && (
              <View style={s.infoRow}>
                <View style={[s.infoIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Mail size={16} color="#F59E0B" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.infoLabel}>Email</Text>
                  <Text style={s.infoValue}>{user.email}</Text>
                </View>
              </View>
            )}
            {user?.dob && (
              <View style={[s.infoRow, { borderBottomWidth: 0 }]}>
                <View style={[s.infoIcon, { backgroundColor: '#FCE7F3' }]}>
                  <Calendar size={16} color="#EC4899" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.infoLabel}>Date of Birth</Text>
                  <Text style={s.infoValue}>
                    {new Date(user.dob).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ═══ Account Menu ═══ */}
        <View style={s.menuSection}>
          <Text style={s.menuLabel}>ACCOUNT</Text>
          <View style={s.menuCard}>
            {accountItems.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  s.menuItem,
                  i === accountItems.length - 1 && { borderBottomWidth: 0 },
                ]}
                activeOpacity={0.6}
                onPress={item.onPress}
              >
                <View style={[s.menuIcon, { backgroundColor: item.bg }]}>
                  <item.icon size={18} color={item.color} />
                </View>
                <View style={s.menuContent}>
                  <Text style={s.menuTitle}>{item.title}</Text>
                  <Text style={s.menuDesc}>{item.desc}</Text>
                </View>
                <ChevronRight size={18} color={COLORS.grey300} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ═══ General Menu ═══ */}
        <View style={s.menuSection}>
          <Text style={s.menuLabel}>GENERAL</Text>
          <View style={s.menuCard}>
            {generalItems.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  s.menuItem,
                  i === generalItems.length - 1 && { borderBottomWidth: 0 },
                ]}
                activeOpacity={0.6}
                onPress={item.onPress}
              >
                <View style={[s.menuIcon, { backgroundColor: item.bg }]}>
                  <item.icon size={18} color={item.color} />
                </View>
                <View style={s.menuContent}>
                  <Text style={s.menuTitle}>{item.title}</Text>
                  <Text style={s.menuDesc}>{item.desc}</Text>
                </View>
                <ChevronRight size={18} color={COLORS.grey300} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ═══ Logout ═══ */}
        <View style={s.logoutWrap}>
          <TouchableOpacity
            style={s.logoutBtn}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <View style={s.logoutIconWrap}>
              <LogOut size={18} color={COLORS.error} />
            </View>
            <Text style={s.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* ═══ Footer ═══ */}
        <View style={s.footer}>
          <View style={s.footerBrand}>
            <Shield size={14} color={COLORS.grey400} />
            <Text style={s.footerBrandText}>Sukra Polyclinic</Text>
          </View>
          <Text style={s.footerVersion}>
            v1.0.0 • Your health, our priority
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ═══════════════════════════════════════
   S T Y L E S
   ═══════════════════════════════════════ */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F7FA' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    fontSize: 15,
    color: COLORS.primary,
    marginTop: 12,
    fontWeight: '500',
  },

  /* ── Hero ── */
  hero: {
    paddingBottom: 50,
    overflow: 'hidden',
  },
  heroContent: { alignItems: 'center', paddingTop: 20, paddingBottom: 10 },
  avatarOuter: { marginBottom: 16 },
  avatarGrad: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  userSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statBox: { alignItems: 'center', paddingHorizontal: 20 },
  statNum: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  deco1: {
    position: 'absolute',
    top: -width * 0.15,
    right: -width * 0.1,
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  deco2: {
    position: 'absolute',
    bottom: -width * 0.1,
    left: -width * 0.15,
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: 'rgba(239,142,31,0.08)',
  },

  /* ── Info card ── */
  infoCardWrap: { paddingHorizontal: 20, marginTop: -30 },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.grey400,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: COLORS.grey800,
    fontWeight: '600',
  },

  /* ── Menu ── */
  menuSection: { marginTop: 24, paddingHorizontal: 20 },
  menuLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.grey400,
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey50,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuContent: { flex: 1 },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.grey800,
    marginBottom: 2,
  },
  menuDesc: {
    fontSize: 12,
    color: COLORS.grey400,
  },

  /* ── Logout ── */
  logoutWrap: { paddingHorizontal: 20, marginTop: 28 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: COLORS.errorLight,
    paddingVertical: 15,
    borderRadius: 14,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.error,
  },

  /* ── Footer ── */
  footer: { alignItems: 'center', marginTop: 28, paddingBottom: 10 },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  footerBrandText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.grey400,
  },
  footerVersion: {
    fontSize: 11,
    color: COLORS.grey300,
    fontStyle: 'italic',
  },
});
