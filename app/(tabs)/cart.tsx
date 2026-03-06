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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShoppingCart,
  FlaskConical,
  Activity,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { router } from 'expo-router';
import { COLORS } from '@/lib/theme';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function CartScreen() {
  const { state, dispatch } = useApp();
  const { cart } = state;

  // Remove item from cart
  const removeFromCart = (id: number) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => dispatch({ type: 'REMOVE_FROM_CART', payload: id }),
        },
      ],
    );
  };

  // Calculate total amount safely
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      let price = 0;
      if (typeof item.price === 'string') {
        price = parseInt(item.price.replace(/[^0-9]/g, ''));
      } else if (typeof item.price === 'number') {
        price = item.price;
      }
      return total + price;
    }, 0);
  };

  const totalAmount = calculateTotal();

  // Proceed to booking
  const proceedToBooking = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart before proceeding.');
      return;
    }
    router.push('/booking/step1' as any);
  };

  /* ─── EMPTY STATE ─── */
  if (cart.length === 0) {
    return (
      <View style={s.root}>
        <StatusBar barStyle="light-content" backgroundColor="#004e56" />

        {/* Dynamic Header */}
        <LinearGradient
          colors={['#004e56', COLORS.primary, '#00888a']}
          locations={[0, 0.6, 1]}
          style={s.heroSmall}
        >
          <SafeAreaView edges={['top']}>
            <View style={s.headerRow}>
              <View>
                <Text style={s.heroTitle}>My Cart</Text>
                <Text style={s.heroSub}>0 items</Text>
              </View>
              <View style={s.iconWrapper}>
                <ShoppingCart size={24} color="#fff" />
              </View>
            </View>
          </SafeAreaView>
          <View style={s.decorativeCircle1} />
        </LinearGradient>

        {/* Empty Content Segment */}
        <View style={s.emptyWrap}>
          <Animated.View entering={FadeInDown.duration(600).springify()}>
            <View style={s.emptyIconContainer}>
              <ShoppingBag size={56} color={COLORS.primaryLight} />
              <View style={s.emptyIconInner}>
                <ShoppingCart size={28} color={COLORS.primary} />
              </View>
            </View>
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.delay(100).duration(600).springify()}
            style={s.emptyTitle}
          >
            Your cart is empty
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(200).duration(600).springify()}
            style={s.emptyDesc}
          >
            Looks like you haven't added any tests or packages to your cart yet.
          </Animated.Text>

          <Animated.View
            entering={FadeInDown.delay(300).duration(600).springify()}
          >
            <TouchableOpacity
              style={s.browseBtn}
              activeOpacity={0.8}
              onPress={() => router.push('/tests' as any)}
            >
              <LinearGradient
                colors={[COLORS.primary, '#00888a']}
                style={s.browseBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={s.browseBtnText}>Browse Tests</Text>
                <ArrowRight size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }

  /* ─── ACTIVE CART ─── */
  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#004e56" />

      {/* ═══ Header Section ═══ */}
      <LinearGradient
        colors={['#004e56', COLORS.primary, '#00888a']}
        locations={[0, 0.5, 1]}
        style={s.heroSmall}
      >
        <SafeAreaView edges={['top']}>
          <View style={s.headerRow}>
            <View>
              <Text style={s.heroTitle}>My Cart</Text>
              <Text style={s.heroSub}>
                {cart.length} item{cart.length !== 1 ? 's' : ''} added
              </Text>
            </View>
            <View style={s.iconWrapper}>
              <ShoppingCart size={24} color="#fff" />
              <View style={s.badge}>
                <Text style={s.badgeText}>{cart.length}</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>

        {/* Decorative Elements */}
        <View style={s.decorativeCircle1} />
        <View style={s.decorativeCircle2} />
      </LinearGradient>

      {/* ═══ Main Content ═══ */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* Trust/Benefit Banner */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={s.trustBanner}
        >
          <View style={s.trustIconBox}>
            <ShieldCheck size={20} color={COLORS.success} />
          </View>
          <Text style={s.trustText}>
            100% Secure Checkout & Free Home Sample Collection
          </Text>
        </Animated.View>

        {/* Cart Items */}
        <View style={s.itemsContainer}>
          {cart.map((item, index) => {
            const isPackage = item.type === 'package';
            const Icon = isPackage ? FlaskConical : Activity;
            const iconColor = isPackage ? COLORS.primary : COLORS.secondary;
            const bgLight = isPackage
              ? COLORS.primaryLight
              : COLORS.secondaryLight;

            return (
              <Animated.View
                key={`${item.type}-${item.id}`}
                entering={FadeInDown.delay(index * 100)
                  .duration(500)
                  .springify()}
                style={s.itemCard}
              >
                {/* Left accent border */}
                <View
                  style={[s.cardAccentLine, { backgroundColor: iconColor }]}
                />

                <View style={s.cardInner}>
                  <View style={s.cardTopRow}>
                    <View
                      style={[
                        s.itemIconContainer,
                        { backgroundColor: bgLight },
                      ]}
                    >
                      <Icon size={22} color={iconColor} strokeWidth={2.5} />
                    </View>

                    <View style={s.itemDetails}>
                      <View style={s.itemTagWrap}>
                        <View style={[s.itemTag, { backgroundColor: bgLight }]}>
                          <Text style={[s.itemTagText, { color: iconColor }]}>
                            {isPackage ? 'LAB PACKAGE' : 'LAB TEST'}
                          </Text>
                        </View>
                      </View>
                      <Text style={s.itemName} numberOfLines={2}>
                        {item.name}
                      </Text>
                      <View style={s.priceRow}>
                        <Text style={s.itemCurrency}>NPR</Text>
                        <Text style={s.itemPriceLabel}>
                          {typeof item.price === 'number'
                            ? item.price.toLocaleString()
                            : item.price}
                        </Text>
                      </View>
                    </View>

                    <View style={s.deleteBtnWrap}>
                      <TouchableOpacity
                        style={s.deleteBtn}
                        activeOpacity={0.6}
                        onPress={() => removeFromCart(item.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Trash2 size={18} color={COLORS.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      {/* ═══ Floating Bottom Checkout ═══ */}
      <Animated.View
        entering={FadeInUp.duration(500).delay(200)}
        style={s.bottomBar}
      >
        <View style={s.totalRow}>
          <View>
            <Text style={s.totalLabel}>Total Payable</Text>
            <Text style={s.totalValue}>
              <Text style={s.totalCurrency}>NPR</Text>{' '}
              {totalAmount.toLocaleString()}
            </Text>
          </View>

          <TouchableOpacity
            style={s.checkoutBtnWrap}
            activeOpacity={0.8}
            onPress={proceedToBooking}
          >
            <LinearGradient
              colors={[COLORS.primary, '#005a62']}
              style={s.checkoutBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={s.checkoutBtnText}>Checkout</Text>
              <ChevronRight size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },

  /* ── Header Area ── */
  heroSmall: {
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 8,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSub: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.secondary,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -width * 0.2,
    right: -width * 0.1,
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -width * 0.1,
    left: -width * 0.2,
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: 'rgba(239,142,31,0.08)',
  },

  /* ── Main List Area ── */
  scrollContent: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, // Make room for floating bottom bar
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    padding: 14,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(22, 163, 74, 0.15)',
  },
  trustIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  trustText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.success,
    lineHeight: 20,
  },

  /* ── Item Cards ── */
  itemsContainer: {
    gap: 16,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.4)',
  },
  itemCardPremium: {
    borderColor: 'rgba(239, 142, 31, 0.25)',
    backgroundColor: '#FFFCF8',
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cardAccentLine: {
    width: 6,
  },
  cardInner: {
    flex: 1,
    padding: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
  },
  itemIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  itemDetails: {
    flex: 1,
    paddingRight: 10,
    justifyContent: 'center',
  },
  itemTagWrap: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  itemTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  itemTagText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
    gap: 4,
  },
  itemPriceLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.secondaryDark,
  },
  itemCurrency: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '700',
  },
  deleteBtnWrap: {
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },

  /* ── Floating Bottom Bar ── */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.grey500,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  totalCurrency: {
    fontSize: 14,
    fontWeight: '600',
  },
  checkoutBtnWrap: {
    borderRadius: 100,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    gap: 8,
  },
  checkoutBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  /* ── Empty State ── */
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginTop: -40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: 'rgba(0, 109, 119, 0.15)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  emptyIconInner: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.grey900,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.grey500,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  browseBtn: {
    borderRadius: 100,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  browseBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingVertical: 18,
    borderRadius: 100,
    gap: 10,
  },
  browseBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
});
