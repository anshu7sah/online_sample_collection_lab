import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Package,
  Search,
  FlaskConical,
  Droplets,
  HeartPulse,
  Activity,
  Brain,
  ChevronRight,
  ShieldCheck,
  Clock,
  ThumbsUp,
  ArrowRight,
  Microscope,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { COLORS } from '@/lib/theme';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { icon: Droplets, label: 'Blood', color: '#EF4444', search: 'blood' },
  { icon: HeartPulse, label: 'Heart', color: '#EC4899', search: 'heart' },
  { icon: Activity, label: 'Diabetes', color: '#F59E0B', search: 'diabetes' },
  {
    icon: FlaskConical,
    label: 'Liver',
    color: COLORS.primary,
    search: 'liver',
  },
  { icon: Brain, label: 'Thyroid', color: '#6366F1', search: 'thyroid' },
];

export default function TestsMainScreen() {
  const handleCategoryPress = (category: (typeof CATEGORIES)[0]) => {
    router.push({
      pathname: '/tests/all-tests',
      params: { search: category.search },
    } as any);
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#004e56" />

      {/* ═══ Hero Section ═══ */}
      <View style={s.heroContainer}>
        <LinearGradient
          colors={['#004e56', COLORS.primary, '#00888a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.heroBg}
        >
          {/* Abstract circles */}
          <View style={s.circle1} />
          <View style={s.circle2} />

          <SafeAreaView edges={['top']} style={s.heroSafeArea}>
            <View style={s.heroHeader}>
              <View>
                <Text style={s.heroTitle}>Book Lab Tests</Text>
                <Text style={s.heroSubtitle}>
                  Accurate results from certified labs
                </Text>
              </View>
            </View>

            {/* Glassmorphic Search */}
            <TouchableOpacity
              style={s.searchBar}
              activeOpacity={0.9}
              onPress={() => router.push('/tests/all-tests' as any)}
            >
              <Search size={20} color={COLORS.primary} strokeWidth={2.5} />
              <Text style={s.searchText}>Search for tests or packages...</Text>
              <View style={s.searchAction}>
                <ChevronRight size={16} color="#fff" />
              </View>
            </TouchableOpacity>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* ═══ Main Actions (Grid) ═══ */}
        <View style={s.actionGrid}>
          <TouchableOpacity
            style={[s.actionCard, { backgroundColor: '#F0F9FF' }]}
            activeOpacity={0.7}
            onPress={() => router.push('/tests/packages' as any)}
          >
            <View style={[s.actionIconWrap, { backgroundColor: '#E0F2FE' }]}>
              <Package size={28} color="#0284C7" />
            </View>
            <Text style={s.actionTitle}>Lab Packages</Text>
            <Text style={s.actionDesc}>Comprehensive body checkups</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.actionCard, { backgroundColor: '#FFF7ED' }]}
            activeOpacity={0.7}
            onPress={() => router.push('/tests/all-tests' as any)}
          >
            <View style={[s.actionIconWrap, { backgroundColor: '#FFEDD5' }]}>
              <Microscope size={28} color="#EA580C" />
            </View>
            <Text style={s.actionTitle}>Individual Tests</Text>
            <Text style={s.actionDesc}>Search and book single tests</Text>
          </TouchableOpacity>
        </View>

        {/* ═══ Popular Categories (Horizontal Scroll) ═══ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Shop by Category</Text>
            <TouchableOpacity
              onPress={() => router.push('/tests/all-tests' as any)}
            >
              <Text style={s.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.catScrollList}
          >
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <TouchableOpacity
                  key={i}
                  style={s.catTile}
                  activeOpacity={0.7}
                  onPress={() => handleCategoryPress(cat)}
                >
                  <View
                    style={[
                      s.catIconCircle,
                      { backgroundColor: `${cat.color}15` },
                    ]}
                  >
                    <Icon size={28} color={cat.color} />
                  </View>
                  <Text style={s.catLabel}>{cat.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ═══ Why Choose Us ═══ */}
        <View style={s.featuresWrap}>
          <View style={s.featureItem}>
            <View style={s.featureIcon}>
              <ShieldCheck size={20} color={COLORS.primary} />
            </View>
            <Text style={s.featureText}>NABL Accredited</Text>
          </View>
          <View style={s.featureItem}>
            <View style={s.featureIcon}>
              <Clock size={20} color={COLORS.primary} />
            </View>
            <Text style={s.featureText}>Timely Reports</Text>
          </View>
          <View style={s.featureItem}>
            <View style={s.featureIcon}>
              <ThumbsUp size={20} color={COLORS.primary} />
            </View>
            <Text style={s.featureText}>Safe & Hygienic</Text>
          </View>
        </View>

        {/* ═══ Premium Featured Banner ═══ */}
        <TouchableOpacity
          style={s.featuredBanner}
          activeOpacity={0.9}
          onPress={() => router.push('/tests/packages' as any)}
        >
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop',
            }}
            style={s.bannerBg}
            imageStyle={{ borderRadius: 24 }}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.2)']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={s.bannerGrad}
            >
              <View style={s.bannerContent}>
                <View style={s.tagWrap}>
                  <Text style={s.tagText}>POPULAR</Text>
                </View>
                <Text style={s.bannerTitle}>Complete Body Screening</Text>
                <Text style={s.bannerDesc}>
                  Includes 85+ parameters for a complete health overview
                </Text>

                <View style={s.bannerBtnRow}>
                  <Text style={s.bannerBtnText}>View Package</Text>
                  <ArrowRight size={16} color="#fff" />
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },

  /* Hero */
  heroContainer: {
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
    shadowColor: '#004e56',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 10,
  },
  heroBg: {
    paddingBottom: 20,
  },
  circle1: {
    position: 'absolute',
    top: -50,
    right: -20,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  circle2: {
    position: 'absolute',
    bottom: -80,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(239, 142, 31, 0.12)',
  },
  heroSafeArea: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  heroHeader: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 5,
  },
  searchText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: COLORS.grey500,
    fontWeight: '500',
  },
  searchAction: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    paddingTop: 28,
    paddingBottom: 40,
  },

  /* Action Grid */
  actionGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  actionIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B', // slate-800
    marginBottom: 6,
  },
  actionDesc: {
    fontSize: 13,
    color: '#64748B', // slate-500
    lineHeight: 18,
    fontWeight: '500',
  },

  /* Category List */
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  catScrollList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  catTile: {
    alignItems: 'center',
    width: 76,
  },
  catIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  catLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155', // slate-700
    textAlign: 'center',
  },

  /* Features Wrap */
  featuresWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  /* Banner */
  featuredBanner: {
    marginHorizontal: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
    marginBottom: 10,
  },
  bannerBg: {
    width: '100%',
    height: 220,
  },
  bannerGrad: {
    flex: 1,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'center',
  },
  bannerContent: {
    width: '80%',
  },
  tagWrap: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  tagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  bannerDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
    marginBottom: 16,
  },
  bannerBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bannerBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.secondary,
  },
});
