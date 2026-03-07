import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search,
  ChevronDown,
  Eye,
  ChevronRight,
  ChevronLeft,
  FlaskConical,
  Inbox,
  Filter,
  X,
} from 'lucide-react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

import { useApp } from '@/contexts/AppContext';

import { useDebounce } from '@/hooks/useDebounce';
import { usePackages } from '@/hooks/usePackages';
import { COLORS } from '@/lib/theme';

const { width } = Dimensions.get('window');

const DEFAULT_PACKAGE_IMAGE =
  'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400';

export default function PackagesScreen() {
  const [packageSearch, setPackageSearch] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'testName'>('name');
  const [page, setPage] = useState(1);
  const [addingItems, setAddingItems] = useState<Set<number>>(new Set());

  const { dispatch, state } = useApp();

  const debouncedPackageSearch = useDebounce(packageSearch, 400);

  const { data, isLoading, isFetching } = usePackages({
    page,
    limit: 10,
    filters: {
      [searchType]: debouncedPackageSearch || undefined,
    },
  });

  const packages = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const totalPkgs = data?.pagination?.total || 0;

  const isInCart = (pkgId: number) => {
    return state.cart.some(
      (item: any) => item.id === pkgId && item.type === 'package',
    );
  };

  const addToCart = async (pkg: any) => {
    if (isInCart(pkg.id)) return;

    setAddingItems((prev) => new Set(prev).add(pkg.id));

    // Simulate delay for feedback
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

    setAddingItems((prev) => {
      const next = new Set(prev);
      next.delete(pkg.id);
      return next;
    });

    Toast.show({
      type: 'success',
      text1: 'Added to cart',
      text2: pkg.name,
      visibilityTime: 1800,
    });
  };

  const handleLoadMore = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  React.useEffect(() => {
    setPage(1);
  }, [debouncedPackageSearch, searchType]);

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
              <Text style={s.headerTitle}>Lab Packages</Text>
              <View style={{ width: 40 }} />
            </View>
            <View style={s.searchBar}>
              <Search size={18} color={COLORS.primary} strokeWidth={2} />
              <TextInput
                style={s.searchInput}
                placeholder={
                  searchType === 'name'
                    ? 'Search packages by name...'
                    : 'Search packages by test...'
                }
                placeholderTextColor={COLORS.grey500}
                value={packageSearch}
                onChangeText={(text) => {
                  setPackageSearch(text);
                  setPage(1);
                }}
              />
              {packageSearch.length > 0 && (
                <TouchableOpacity
                  style={{ padding: 4 }}
                  onPress={() => setPackageSearch('')}
                >
                  <X size={18} color={COLORS.grey400} />
                </TouchableOpacity>
              )}
            </View>

            <View style={s.searchTypeTabs}>
              <TouchableOpacity
                style={[
                  s.searchTypeBtn,
                  searchType === 'name' && s.searchTypeBtnActive,
                ]}
                onPress={() => setSearchType('name')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    s.searchTypeText,
                    searchType === 'name' && s.searchTypeTextActive,
                  ]}
                >
                  By Package
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  s.searchTypeBtn,
                  searchType === 'testName' && s.searchTypeBtnActive,
                ]}
                onPress={() => setSearchType('testName')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    s.searchTypeText,
                    searchType === 'testName' && s.searchTypeTextActive,
                  ]}
                >
                  By Test
                </Text>
              </TouchableOpacity>
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
          <Text style={s.loaderText}>Loading packages...</Text>
        </View>
      ) : packages.length === 0 ? (
        <View style={s.emptyWrap}>
          <View style={s.emptyCircle}>
            <Inbox size={40} color={COLORS.grey300} />
          </View>
          <Text style={s.emptyTitle}>No packages found</Text>
          <Text style={s.emptyDesc}>
            {packageSearch
              ? `No results for "${packageSearch}"`
              : 'Try a different search term'}
          </Text>
          {packageSearch.length > 0 && (
            <TouchableOpacity
              style={s.clearSearchBtn}
              onPress={() => setPackageSearch('')}
            >
              <Text style={s.clearSearchText}>Clear Search</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {/* Results count */}
          <View style={s.resultsMeta}>
            <Text style={s.resultsCount}>
              Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, totalPkgs)} of{' '}
              {totalPkgs}
            </Text>
          </View>

          {packages.map((pkg: any) => (
            <TouchableOpacity
              key={pkg.id}
              style={s.card}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: '/tests/package-details',
                  params: { id: pkg.id, type: 'package' },
                })
              }
            >
              <Image
                source={{ uri: DEFAULT_PACKAGE_IMAGE }}
                style={s.cardImage}
              />

              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                style={s.cardOverlay}
              />

              <View style={s.cardBody}>
                <View style={s.cardTopRow}>
                  {pkg.tests?.length ? (
                    <View style={s.testCountBadge}>
                      <FlaskConical size={12} color={COLORS.primary} />
                      <Text style={s.testCountText}>
                        {pkg.tests.length} tests included
                      </Text>
                    </View>
                  ) : (
                    <View />
                  )}
                </View>

                <View style={s.cardInfo}>
                  <Text style={s.cardTitle} numberOfLines={2}>
                    {pkg.name}
                  </Text>

                  {pkg.description ? (
                    <Text style={s.cardDesc} numberOfLines={2}>
                      {pkg.description}
                    </Text>
                  ) : null}

                  <View style={s.cardFooter}>
                    <Text style={s.cardPrice}>NPR {pkg.price}</Text>
                    <View style={s.btnRow}>
                      <TouchableOpacity
                        style={s.viewBtn}
                        onPress={() =>
                          router.push({
                            pathname: '/tests/package-details',
                            params: { id: pkg.id, type: 'package' },
                          })
                        }
                      >
                        <Text style={s.viewBtnText}>View</Text>
                        <ChevronRight size={14} color="#fff" />
                      </TouchableOpacity>

                      {(() => {
                        const inCart = isInCart(pkg.id);
                        const isAdding = addingItems.has(pkg.id);
                        return (
                          <TouchableOpacity
                            style={[
                              s.addBtnSmall,
                              inCart && s.addBtnSmallActive,
                            ]}
                            onPress={(e) => {
                              e.stopPropagation();
                              if (!inCart && !isAdding) addToCart(pkg);
                            }}
                            disabled={inCart || isAdding}
                          >
                            {isAdding ? (
                              <ActivityIndicator size="small" color="#fff" />
                            ) : inCart ? (
                              <Text style={s.addBtnSmallActiveText}>
                                In Cart
                              </Text>
                            ) : (
                              <Text style={s.addBtnSmallText}>Add</Text>
                            )}
                          </TouchableOpacity>
                        );
                      })()}
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* Load More */}
          {!isLoading && page < totalPages && (
            <TouchableOpacity
              style={s.loadMoreBtn}
              activeOpacity={0.8}
              onPress={handleLoadMore}
            >
              {isFetching ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                >
                  <Text style={s.loadMoreText}>Load More</Text>
                  <ChevronDown size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
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
  searchTypeTabs: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  searchTypeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchTypeBtnActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  searchTypeText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  searchTypeTextActive: {
    color: COLORS.primary,
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
    marginTop: 60,
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
  resultsMeta: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 6,
  },
  resultsCount: {
    fontSize: 13,
    color: COLORS.grey400,
    fontWeight: '500',
  },

  /* ── Card ── */
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 20,
    marginTop: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 180,
    position: 'absolute',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
  },
  cardBody: {
    minHeight: 180,
    padding: 18,
    justifyContent: 'space-between',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  testCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  testCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.2,
  },
  cardInfo: {
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
    marginBottom: 16,
    maxWidth: '90%',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  viewBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addBtnSmall: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnSmallActive: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  addBtnSmallText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  addBtnSmallActiveText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondary,
  },

  /* ── Load More ── */
  loadMoreBtn: {
    backgroundColor: COLORS.primaryLight,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryMuted,
  },
  loadMoreText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});
