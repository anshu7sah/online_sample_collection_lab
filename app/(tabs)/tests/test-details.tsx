import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {
  ShoppingCart,
  Check,
  Beaker,
  Clock,
  Tag,
  FileText,
  AlertCircle,
  Droplets,
} from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { useSingleTest } from '@/hooks/useSingleTest';
import { COLORS } from '@/lib/theme';
import Toast from 'react-native-toast-message';

export default function TestDetailsScreen() {
  const { id } = useLocalSearchParams();
  const testId = Number(id);

  const { dispatch, state } = useApp();
  const [isAdding, setIsAdding] = React.useState(false);
  const { data: test, isLoading, isError } = useSingleTest(testId);

  const isInCart = state.cart.some(
    (item: any) => item.id === testId && item.type === 'test',
  );

  const addToCart = async () => {
    if (!test || isInCart || isAdding) return;

    setIsAdding(true);
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: test.id,
        name: test.testName,
        price: test.amount,
        type: 'test',
      },
    });

    setIsAdding(false);

    Toast.show({
      type: 'success',
      text1: 'Added to cart',
      text2: test.testName,
      visibilityTime: 1800,
    });
  };

  if (isLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={s.loadingText}>Loading test details...</Text>
      </View>
    );
  }

  if (isError || !test) {
    return (
      <View style={s.center}>
        <AlertCircle size={48} color={COLORS.error} />
        <Text style={s.errorText}>Test details not found.</Text>
      </View>
    );
  }

  const details = [
    {
      icon: Tag,
      label: 'Test Code',
      value: test.testCode,
      color: COLORS.primary,
      bg: COLORS.primaryLight,
    },
    {
      icon: Beaker,
      label: 'Method',
      value: test.methodName,
      color: '#6366F1',
      bg: '#E0E7FF',
    },
    {
      icon: Droplets,
      label: 'Specimen',
      value: `${test.specimen} (${test.specimenVolume}, ${test.container})`,
      color: '#DC2626',
      bg: '#FEE2E2',
    },
    {
      icon: Clock,
      label: 'Reported',
      value: test.reported,
      color: '#F59E0B',
      bg: '#FEF3C7',
    },
  ];

  return (
    <View style={s.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ═══ Header Card ═══ */}
        <View style={s.headerCard}>
          <View style={s.deptBadge}>
            <Text style={s.deptBadgeText}>{test.department}</Text>
          </View>
          <Text style={s.testName}>{test.testName}</Text>
          <Text style={s.price}>NPR {test.amount}</Text>
        </View>

        {/* ═══ Details ═══ */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Test Information</Text>
          {details.map((d, i) => {
            const Icon = d.icon;
            return (
              <View key={i} style={s.detailRow}>
                <View style={[s.detailIcon, { backgroundColor: d.bg }]}>
                  <Icon size={16} color={d.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.detailLabel}>{d.label}</Text>
                  <Text style={s.detailValue}>{d.value}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ═══ Special Instructions ═══ */}
        {test.specialInstruction && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Special Instructions</Text>
            <View style={s.instructionBox}>
              <AlertCircle size={16} color={COLORS.secondary} />
              <Text style={s.instructionText}>{test.specialInstruction}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ═══ Footer ═══ */}
      <View style={s.footer}>
        <View>
          <Text style={s.footerLabel}>Price</Text>
          <Text style={s.footerPrice}>NPR {test.amount}</Text>
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
  deptBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  deptBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  testName: {
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.grey400,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  detailValue: { fontSize: 14, fontWeight: '600', color: COLORS.grey800 },

  /* Instructions */
  instructionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FEF3C7',
    padding: 14,
    borderRadius: 14,
  },
  instructionText: { flex: 1, fontSize: 14, color: '#92400E', lineHeight: 20 },

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
