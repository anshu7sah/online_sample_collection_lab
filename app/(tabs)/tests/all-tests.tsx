import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Activity,
  FlaskConical,
  Inbox,
  X,
  SlidersHorizontal,
  Check,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

import { useApp } from '@/contexts/AppContext';
import { useTests } from '@/hooks/useTests';
import { useDebounce } from '@/hooks/useDebounce';
import { COLORS } from '@/lib/theme';

const { width } = Dimensions.get('window');

export default function AllTestsScreen() {
  const params = useLocalSearchParams<{ search?: string }>();
  const [searchQuery, setSearchQuery] = useState(params.search || '');
  const debouncedSearch = useDebounce(searchQuery, 400);

  const [page, setPage] = useState(1);
  const limit = 10;
  const { dispatch, state } = useApp();
  const [addingItems, setAddingItems] = useState<Set<number>>(new Set());

  const [filters, setFilters] = useState<any>({});

  const { data, isLoading, refetch } = useTests({
    page,
    limit,
    filters: { ...filters, testName: debouncedSearch },
  });

  useEffect(() => {
    refetch();
  }, [page, debouncedSearch]);

  const tests = data?.tests || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const totalTests = data?.pagination?.total || 0;

  const isInCart = (testId: number) => {
    return state.cart.some(
      (item: any) => item.id === testId && item.type === 'test',
    );
  };

  const addToCart = async (test: any) => {
    if (isInCart(test.id)) return;

    setAddingItems((prev) => new Set(prev).add(test.id));

    // Simulate a small delay for "Adding..." feedback
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

    setAddingItems((prev) => {
      const next = new Set(prev);
      next.delete(test.id);
      return next;
    });

    Toast.show({
      type: 'success',
      text1: 'Added to cart',
      text2: test.testName,
      visibilityTime: 1800,
    });
  };

  const goNext = () => page < totalPages && setPage((prev) => prev + 1);
  const goPrev = () => page > 1 && setPage((prev) => prev - 1);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#004e56" />

      {/* ═══ Header Section ═══ */}
      <View style={s.heroContainer}>
        <LinearGradient
          colors={['#004e56', COLORS.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.heroBg}
        >
          <SafeAreaView edges={['top']} style={s.heroSafeArea}>
            <View style={s.headerRow}>
              <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
                <ChevronLeft size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={s.headerTitle}>All Tests</Text>
              <View style={{ width: 40 }} />
            </View>
            <View style={s.searchBar}>
              <Search size={18} color={COLORS.primary} strokeWidth={2} />
              <TextInput
                style={s.searchInput}
                placeholder="Search tests by name..."
                placeholderTextColor={COLORS.grey500}
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setPage(1);
                }}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={18} color={COLORS.grey400} />
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      {/* ═══ Content ═══ */}
      {isLoading ? (
        <View style={s.loaderWrap}>
          <View style={s.loaderCircle}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
          <Text style={s.loaderText}>Finding tests for you...</Text>
        </View>
      ) : tests.length === 0 ? (
        <View style={s.emptyWrap}>
          <View style={s.emptyCircle}>
            <Inbox size={40} color={COLORS.grey300} />
          </View>
          <Text style={s.emptyTitle}>No tests found</Text>
          <Text style={s.emptyDesc}>
            {searchQuery
              ? `No results for "${searchQuery}"`
              : 'Try searching for a specific test'}
          </Text>
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={s.clearSearchBtn}
              onPress={() => setSearchQuery('')}
            >
              <Text style={s.clearSearchText}>Clear Search</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Results count */}
          <View style={s.resultsMeta}>
            <Text style={s.resultsCount}>
              Showing {(page - 1) * limit + 1}–
              {Math.min(page * limit, totalTests)} of {totalTests}
            </Text>
          </View>

          {tests.map((test: any, index: number) => {
            const inCart = isInCart(test.id);
            return (
              <TouchableOpacity
                key={test.id}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: '/tests/test-details',
                    params: { id: test.id, type: 'test' },
                  })
                }
              >
                <View style={s.card}>
                  {/* Left color accent */}
                  <LinearGradient
                    colors={[COLORS.primary, '#00888a']}
                    style={s.cardAccent}
                  />
                  <View style={s.cardBody}>
                    <View style={s.cardRow}>
                      <View style={s.cardIconWrap}>
                        <FlaskConical size={20} color={COLORS.primary} />
                      </View>
                      <View style={s.cardInfo}>
                        <Text style={s.cardTitle} numberOfLines={2}>
                          {test.testName}
                        </Text>
                        {test.department && (
                          <View style={s.deptTag}>
                            <Text style={s.deptTagText}>{test.department}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={s.cardFooter}>
                      <View style={s.priceWrap}>
                        <Text style={s.priceLabel}>Price</Text>
                        <Text style={s.cardPrice}>NPR {test.amount}</Text>
                      </View>
                      <TouchableOpacity
                        style={[s.addBtn, inCart && s.addBtnActive]}
                        activeOpacity={0.7}
                        disabled={inCart || addingItems.has(test.id)}
                        onPress={(e) => {
                          e.stopPropagation();
                          if (!inCart && !addingItems.has(test.id))
                            addToCart(test);
                        }}
                      >
                        {addingItems.has(test.id) ? (
                          <>
                            <ActivityIndicator size="small" color="#fff" />
                            <Text style={s.addBtnText}>Adding...</Text>
                          </>
                        ) : inCart ? (
                          <>
                            <Check size={14} color={COLORS.primary} />
                            <Text style={s.addBtnActiveText}>In Cart</Text>
                          </>
                        ) : (
                          <>
                            <Plus size={14} color="#fff" />
                            <Text style={s.addBtnText}>Add</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* ═══ Pagination ═══ */}
          {totalPages > 1 && (
            <View style={s.pagination}>
              <TouchableOpacity
                style={[s.pageBtn, page === 1 && s.pageBtnDisabled]}
                onPress={goPrev}
                disabled={page === 1}
                activeOpacity={0.7}
              >
                <ChevronLeft
                  size={16}
                  color={page === 1 ? COLORS.grey300 : '#fff'}
                />
                <Text
                  style={[s.pageBtnText, page === 1 && s.pageBtnTextDisabled]}
                >
                  Prev
                </Text>
              </TouchableOpacity>

              <View style={s.pageIndicator}>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[s.pageDot, pageNum === page && s.pageDotActive]}
                      onPress={() => setPage(pageNum)}
                    >
                      <Text
                        style={[
                          s.pageDotText,
                          pageNum === page && s.pageDotTextActive,
                        ]}
                      >
                        {pageNum}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {totalPages > 5 && <Text style={s.pageEllipsis}>...</Text>}
              </View>

              <TouchableOpacity
                style={[
                  s.pageBtn,
                  s.pageBtnNext,
                  page === totalPages && s.pageBtnDisabled,
                ]}
                onPress={goNext}
                disabled={page === totalPages}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    s.pageBtnText,
                    s.pageBtnNextText,
                    page === totalPages && s.pageBtnTextDisabled,
                  ]}
                >
                  Next
                </Text>
                <ChevronRight
                  size={16}
                  color={page === totalPages ? COLORS.grey300 : '#fff'}
                />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F7FA' },

  /* ── Hero ── */
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
    paddingBottom: 16,
  },
  heroSafeArea: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  deco1: {
    position: 'absolute',
    top: -50,
    right: -20,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  deco2: {
    position: 'absolute',
    bottom: -80,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(239, 142, 31, 0.12)',
  },

  /* ── Search ── */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.grey800,
    fontWeight: '500',
    marginLeft: 10,
  },

  /* ── Loader ── */
  loaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loaderText: {
    fontSize: 15,
    color: COLORS.grey500,
    fontWeight: '500',
  },

  /* ── Empty ── */
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.grey100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.grey700,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 14,
    color: COLORS.grey400,
    textAlign: 'center',
    lineHeight: 20,
  },
  clearSearchBtn: {
    marginTop: 16,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  clearSearchText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  /* ── Content ── */
  content: { padding: 20, paddingBottom: 30 },

  /* ── Results meta ── */
  resultsMeta: {
    marginBottom: 14,
  },
  resultsCount: {
    fontSize: 13,
    color: COLORS.grey400,
    fontWeight: '500',
  },

  /* ── Card ── */
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardAccent: { width: 5, borderTopLeftRadius: 18, borderBottomLeftRadius: 18 },
  cardBody: { flex: 1, padding: 16 },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start' },
  cardIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardInfo: { flex: 1, paddingRight: 10 },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.grey800,
    marginBottom: 6,
    lineHeight: 22,
  },
  deptTag: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  deptTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.grey100,
  },
  priceWrap: {},
  priceLabel: {
    fontSize: 11,
    color: COLORS.grey400,
    fontWeight: '500',
    marginBottom: 2,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  addBtnActive: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1.5,
    borderColor: COLORS.primaryMuted,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  addBtnActiveText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },

  /* ── Pagination ── */
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 4,
  },
  pageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },
  pageBtnNext: {},
  pageBtnDisabled: {
    backgroundColor: COLORS.grey100,
  },
  pageBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  pageBtnNextText: {},
  pageBtnTextDisabled: { color: COLORS.grey300 },
  pageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pageDot: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  pageDotActive: {
    backgroundColor: COLORS.secondary,
  },
  pageDotText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.grey500,
  },
  pageDotTextActive: {
    color: '#fff',
  },
  pageEllipsis: {
    fontSize: 14,
    color: COLORS.grey400,
    fontWeight: '600',
    marginLeft: 2,
  },
});
