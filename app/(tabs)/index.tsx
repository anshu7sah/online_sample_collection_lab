import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  FlaskConical,
  ClipboardList,
  Activity,
  CalendarCheck,
  Search,
  X,
  ArrowRight,
  Sparkles,
  Stethoscope,
  Truck,
  Clock,
  ChevronRight,
  Bell,
} from 'lucide-react-native';
import { router } from 'expo-router';

import { useDebounce } from '@/hooks/useDebounce';
import { useTests } from '@/hooks/useTests';
import { usePackages } from '@/hooks/usePackages';
import { useCurrent } from '@/hooks/useCurrent';
import { COLORS } from '@/lib/theme';

const { width } = Dimensions.get('window');
const DEFAULT_PACKAGE_IMAGE =
  'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 400);
  const { data: user } = useCurrent();
  const scrollY = useRef(new Animated.Value(0)).current;

  const isSearching = isSearchActive || debouncedSearch.trim().length > 0;

  /* ── Initials for avatar ── */
  const getInitials = () => {
    if (!user?.name) return '?';
    return user.name
      .split(' ')
      .map((w: string) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const notificationCount = 2; // Dummy notification count

  const { data: testData, isLoading: testsLoading } = useTests({
    page: 1,
    limit: 50,
    filters: { testName: debouncedSearch },
  });
  const tests = testData?.tests || [];

  const { data: packageData, isLoading: packagesLoading } = usePackages({
    page: 1,
    limit: 10,
    filters: {},
  });
  const featuredPackages = packageData?.data || [];

  /* ── Quick Actions ── */
  const quickActions = [
    {
      title: 'Lab\nPackages',
      icon: FlaskConical,
      bg: COLORS.primaryLight,
      iconColor: COLORS.primary,
      route: '/tests/packages',
    },
    {
      title: 'All\nTests',
      icon: Activity,
      bg: COLORS.secondaryLight,
      iconColor: COLORS.secondary,
      route: '/tests/all-tests',
    },
    {
      title: 'My\nReports',
      icon: ClipboardList,
      bg: '#EDE9FE',
      iconColor: '#7C3AED',
      route: '/reports',
    },
    {
      title: 'Book\nTest',
      icon: CalendarCheck,
      bg: '#FEE2E2',
      iconColor: '#DC2626',
      route: '/tests',
    },
  ];

  /* ── Features ── */
  const features = [
    {
      icon: Truck,
      title: 'Home Collection',
      desc: 'Sample pickup from your door',
      color: COLORS.primary,
    },
    {
      icon: Clock,
      title: 'Quick Reports',
      desc: 'Results within 24 hours',
      color: COLORS.secondary,
    },
    {
      icon: Stethoscope,
      title: 'Expert Care',
      desc: 'Certified lab technicians',
      color: '#7C3AED',
    },
  ];

  /* ── Greeting ── */
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = user?.name?.split(' ')[0] || 'there';

  /* ── Search Results ── */
  const renderSearchResults = () => {
    if (testsLoading) {
      return (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 60 }}
        />
      );
    }
    if (tests.length === 0) {
      return (
        <View style={s.emptySearch}>
          <Search size={48} color={COLORS.grey300} />
          <Text style={s.emptyTitle}>No tests found</Text>
          <Text style={s.emptyDesc}>Try a different search term</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={tests}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.searchCard}
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: '/tests/test-details',
                params: { id: item.id, type: 'test' },
              })
            }
          >
            <View style={s.searchIconWrap}>
              <FlaskConical size={18} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.searchName} numberOfLines={1}>
                {item.testName}
              </Text>
              <Text style={s.searchMeta}>Individual Test</Text>
            </View>
            <Text style={s.searchPrice}>NPR {item.amount}</Text>
            <ChevronRight size={16} color={COLORS.grey400} />
          </TouchableOpacity>
        )}
      />
    );
  };

  /* ── Main Content ── */
  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#004e56" />

      {isSearching ? (
        <SafeAreaView style={s.root}>
          {/* Search header */}
          <View style={s.searchHeader}>
            <View style={s.searchBarActive}>
              <Search size={18} color={COLORS.grey400} />
              <TextInput
                style={s.searchInputActive}
                placeholder="Search tests..."
                placeholderTextColor={COLORS.grey400}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setIsSearchActive(false);
                }}
              >
                <X size={18} color={COLORS.grey500} />
              </TouchableOpacity>
            </View>
          </View>
          {renderSearchResults()}
        </SafeAreaView>
      ) : (
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {/* ═══ Hero Header ═══ */}
          <LinearGradient
            colors={['#004e56', COLORS.primary, '#00888a']}
            locations={[0, 0.5, 1]}
            style={s.hero}
          >
            {/* Decorative circles - pointerEvents="none" to prevent interaction blocking */}
            <View style={s.deco1} pointerEvents="none" />
            <View style={s.deco2} pointerEvents="none" />

            <SafeAreaView edges={['top']}>
              {/* Top row */}
              <View style={s.heroTop}>
                <TouchableOpacity
                  style={s.heroLeft}
                  activeOpacity={0.7}
                  onPress={() => router.push('/profile')}
                >
                  <View style={s.avatarRing}>
                    <View style={s.avatarInitials}>
                      <Text style={s.avatarInitialsText}>{getInitials()}</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={s.greeting}>{getGreeting()} 👋</Text>
                    <Text style={s.userName}>{firstName}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.notifBtn, { zIndex: 20 }]}
                  onPress={() => router.push('/profile/notifications' as any)}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                  <Bell size={20} color="#fff" />
                  {notificationCount > 0 && (
                    <View style={s.notifBadge}>
                      <Text style={s.notifBadgeText}>{notificationCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Search bar */}
              <TouchableOpacity
                style={s.searchBarHero}
                activeOpacity={0.9}
                onPress={() => {
                  setSearchQuery('');
                  setIsSearchActive(true);
                }}
              >
                <Search size={18} color="rgba(255,255,255,0.6)" />
                <Text style={s.searchPlaceholder}>
                  Search for tests & packages...
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </LinearGradient>

          {/* ═══ Quick Actions ═══ */}
          <View style={s.quickSection}>
            <View style={s.quickGrid}>
              {quickActions.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={s.quickCard}
                  activeOpacity={0.7}
                  onPress={() => router.push(item.route as any)}
                >
                  <View style={[s.quickIcon, { backgroundColor: item.bg }]}>
                    <item.icon size={24} color={item.iconColor} />
                  </View>
                  <Text style={s.quickLabel}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ═══ Promo Banner ═══ */}
          <View style={s.promoWrap}>
            <LinearGradient
              colors={[COLORS.secondary, '#d97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.promo}
            >
              <View style={{ flex: 1 }}>
                <View style={s.promoTag}>
                  <Sparkles size={12} color={COLORS.secondary} />
                  <Text style={s.promoTagText}>SPECIAL OFFER</Text>
                </View>
                <Text style={s.promoTitle}>Full Body Checkup</Text>
                <Text style={s.promoDesc}>
                  70+ tests including CBC, Thyroid, Liver & more
                </Text>
                <TouchableOpacity
                  style={s.promoBtn}
                  onPress={() => router.push('/tests/packages' as any)}
                >
                  <Text style={s.promoBtnText}>Book Now</Text>
                  <ArrowRight size={14} color={COLORS.secondary} />
                </TouchableOpacity>
              </View>
              <View style={s.promoGraphic}>
                <Stethoscope size={52} color="rgba(255,255,255,0.25)" />
              </View>
            </LinearGradient>
          </View>

          {/* ═══ Why Choose Us ═══ */}
          <View style={s.whySection}>
            <Text style={s.sectionTitle}>Why Choose Us</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
            >
              {features.map((f, i) => (
                <View key={i} style={s.featureCard}>
                  <View
                    style={[s.featureIcon, { backgroundColor: f.color + '15' }]}
                  >
                    <f.icon size={22} color={f.color} />
                  </View>
                  <Text style={s.featureTitle}>{f.title}</Text>
                  <Text style={s.featureDesc}>{f.desc}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* ═══ Featured Packages ═══ */}
          <View style={s.pkgSection}>
            <View style={s.sectionRow}>
              <Text style={s.sectionTitle}>Popular Packages</Text>
              <TouchableOpacity
                onPress={() => router.push('/tests/packages' as any)}
              >
                <Text style={s.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {packagesLoading ? (
              <ActivityIndicator
                size="small"
                color={COLORS.primary}
                style={{ marginTop: 20 }}
              />
            ) : (
              <FlatList
                horizontal
                data={featuredPackages}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={s.pkgCard}
                    activeOpacity={0.8}
                    onPress={() =>
                      router.push({
                        pathname: '/tests/package-details',
                        params: { id: item.id, type: 'package' },
                      })
                    }
                  >
                    <Image
                      source={{ uri: DEFAULT_PACKAGE_IMAGE }}
                      style={s.pkgImg}
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.7)']}
                      style={s.pkgOverlay}
                    />
                    <View style={s.pkgContent}>
                      <Text style={s.pkgName} numberOfLines={2}>
                        {item.name}
                      </Text>
                      <View style={s.pkgBottom}>
                        <Text style={s.pkgPrice}>NPR {item.price}</Text>
                        <View style={s.pkgArrow}>
                          <ArrowRight size={14} color="#fff" />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>

          {/* ═══ CTA Banner ═══ */}
          <View style={s.ctaWrap}>
            <View style={s.ctaBanner}>
              <View>
                <Text style={s.ctaTitle}>Need Help Choosing?</Text>
                <Text style={s.ctaDesc}>
                  Our experts can recommend the{'\n'}right tests for you
                </Text>
              </View>
              <TouchableOpacity
                style={s.ctaBtn}
                onPress={() => router.push('/tests' as any)}
              >
                <Text style={s.ctaBtnText}>Browse</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.ScrollView>
      )}
    </View>
  );
}

/* ═══════════════════════════════════════
   S T Y L E S
   ═══════════════════════════════════════ */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F7FA' },

  /* ── Hero ── */
  hero: {
    paddingBottom: 30,
    overflow: 'hidden',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    zIndex: 10,
  },
  heroLeft: { flexDirection: 'row', alignItems: 'center' },
  avatarRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarInitials: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitialsText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  greeting: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#004e56',
  },
  notifBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchBarHero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 20,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  searchPlaceholder: {
    marginLeft: 10,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
  },
  deco1: {
    position: 'absolute',
    top: -width * 0.2,
    right: -width * 0.15,
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  deco2: {
    position: 'absolute',
    bottom: -width * 0.1,
    left: -width * 0.2,
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: 'rgba(239,142,31,0.08)',
  },

  /* ── Quick Actions ── */
  quickSection: {
    marginTop: -16,
    paddingHorizontal: 20,
  },
  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  quickCard: {
    alignItems: 'center',
    width: (width - 72) / 4,
  },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.grey700,
    textAlign: 'center',
    lineHeight: 16,
  },

  /* ── Promo ── */
  promoWrap: { paddingHorizontal: 20, marginTop: 20 },
  promo: {
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  promoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
    gap: 4,
  },
  promoTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: 0.5,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  promoDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
    marginBottom: 14,
  },
  promoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  promoBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  promoGraphic: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },

  /* ── Why Choose ── */
  whySection: { marginTop: 28 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.grey800,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: 155,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.grey800,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: COLORS.grey500,
    lineHeight: 16,
  },

  /* ── Packages ── */
  pkgSection: { marginTop: 28 },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
    marginBottom: 14,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  pkgCard: {
    width: 200,
    height: 220,
    borderRadius: 18,
    marginRight: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  pkgImg: { width: '100%', height: '100%', position: 'absolute' },
  pkgOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  pkgContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  pkgName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  pkgBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pkgPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  pkgArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ── CTA ── */
  ctaWrap: { paddingHorizontal: 20, marginTop: 28 },
  ctaBanner: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryMuted,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  ctaDesc: {
    fontSize: 12,
    color: COLORS.grey500,
    lineHeight: 18,
  },
  ctaBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  ctaBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  /* ── Search Active ── */
  searchHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100,
  },
  searchBarActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grey50,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.grey200,
  },
  searchInputActive: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.grey800,
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  searchName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.grey800,
  },
  searchMeta: { fontSize: 12, color: COLORS.grey400, marginTop: 2 },
  searchPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: 8,
  },

  /* ── Empty ── */
  emptySearch: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.grey700,
    marginTop: 16,
  },
  emptyDesc: { fontSize: 14, color: COLORS.grey400, marginTop: 4 },
});
