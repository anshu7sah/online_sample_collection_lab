import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  ShoppingCart,
  Check,
  AlertCircle,
  FlaskConical,
} from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { useSinglePackage } from '@/hooks/useSinglePackage';
import { COLORS } from '@/lib/theme';
import Toast from 'react-native-toast-message';

export default function PackageDetailsScreen() {
  const { id } = useLocalSearchParams();
  const packageId = Number(id);

  const { dispatch, state } = useApp();
  const [isAdding, setIsAdding] = React.useState(false);
  const { data: pkg, isLoading, isError } = useSinglePackage({ id: packageId });

  const isInCart = state.cart.some(
    (item: any) => item.id === packageId && item.type === 'package',
  );

  const addToCart = async () => {
    if (!pkg || isInCart || isAdding) return;

    setIsAdding(true);
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: pkg.id,
        name: pkg.name,
        price: pkg.price,
        type: 'package',
      },
    });

    setIsAdding(false);

    Toast.show({
      type: 'success',
      text1: 'Added to cart',
      text2: pkg.name,
      visibilityTime: 1800,
    });
  };

  if (isLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={s.loadingText}>Loading package details...</Text>
      </View>
    );
  }

  if (isError || !pkg) {
    return (
      <View style={s.center}>
        <AlertCircle size={48} color={COLORS.error} />
        <Text style={s.errorText}>Package not found.</Text>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ═══ Header Card ═══ */}
        <View style={s.headerCard}>
          <View style={s.headerBadge}>
            <FlaskConical size={12} color={COLORS.primary} />
            <Text style={s.headerBadgeText}>
              {pkg.tests?.length || 0} tests included
            </Text>
          </View>
          <Text style={s.packageName}>{pkg.name}</Text>
          <Text style={s.price}>NPR {pkg.price}</Text>
        </View>

        {/* ═══ Description ═══ */}
        {pkg.description && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Description</Text>
            <View style={s.descCard}>
              <Text style={s.descText}>{pkg.description}</Text>
            </View>
          </View>
        )}

        {/* ═══ Included Tests ═══ */}
        {pkg.tests?.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>
              Included Tests ({pkg.tests.length})
            </Text>
            <View style={s.testsCard}>
              {pkg.tests.map((item: any, i: number) => (
                <View
                  key={item.id}
                  style={[
                    s.testItem,
                    i === pkg.tests.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <View style={s.checkWrap}>
                    <Check size={14} color="#fff" />
                  </View>
                  <Text style={s.testItemText}>{item.testName}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* ═══ Footer ═══ */}
      <View style={s.footer}>
        <View>
          <Text style={s.footerLabel}>Total Amount</Text>
          <Text style={s.footerPrice}>NPR {pkg.price}</Text>
        </View>
        <TouchableOpacity
          style={[s.addBtn, (isInCart || isAdding) && s.addBtnDisabled]}
          activeOpacity={0.8}
          onPress={addToCart}
          disabled={isInCart || isAdding}
        >
          {isAdding ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={s.addBtnText}>Adding...</Text>
            </>
          ) : isInCart ? (
            <>
              <Check size={18} color="#fff" />
              <Text style={s.addBtnText}>In Cart</Text>
            </>
          ) : (
            <>
              <ShoppingCart size={18} color="#fff" />
              <Text style={s.addBtnText}>Add to Cart</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F7FA' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.grey400,
    marginTop: 12,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    marginTop: 12,
    fontWeight: '600',
  },

  /* Header Card */
  headerCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  headerBadgeText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  packageName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.grey800,
    marginBottom: 8,
  },
  price: { fontSize: 22, fontWeight: '800', color: COLORS.secondary },

  /* Section */
  section: { marginHorizontal: 20, marginBottom: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.grey800,
    marginBottom: 14,
  },

  descCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  descText: { fontSize: 14, color: COLORS.grey500, lineHeight: 22 },

  testsCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  testItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100,
  },
  checkWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  testItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.grey800,
    flex: 1,
  },

  /* Footer */
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.grey100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  footerLabel: { fontSize: 12, color: COLORS.grey400, marginBottom: 2 },
  footerPrice: { fontSize: 20, fontWeight: '800', color: COLORS.secondary },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  addBtnDisabled: {
    backgroundColor: COLORS.primaryMuted,
    shadowOpacity: 0.1,
  },
});
