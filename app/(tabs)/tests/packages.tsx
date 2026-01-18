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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, Search, ChevronDown } from 'lucide-react-native';
import { router } from 'expo-router';

import { useDebounce } from '@/hooks/useDebounce';
import { usePackages } from '@/hooks/usePackages';

const DEFAULT_PACKAGE_IMAGE =
  'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400';

export default function PackagesScreen() {
  const [packageSearch, setPackageSearch] = useState('');
  const [testSearch, setTestSearch] = useState('');
  const [page, setPage] = useState(1);

  const debouncedPackageSearch = useDebounce(packageSearch, 400);
  const debouncedTestSearch = useDebounce(testSearch, 400);

  const { data, isLoading, isFetching } = usePackages({
    page,
    limit: 10,
    filters: {
      name: debouncedPackageSearch || undefined,
      testName: debouncedTestSearch || undefined,
    },
  });

  const packages = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  // Reset page to 1 when search changes
  React.useEffect(() => {
    setPage(1);
  }, [debouncedPackageSearch, debouncedTestSearch]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        
        {/* -------- SEARCH CARD -------- */}
        <View style={styles.searchCard}>
          <Text style={styles.searchCardTitle}>Find Packages</Text>

          <View style={styles.searchBox}>
            <Search size={18} color="#6B7280" />
            <TextInput
              placeholder="Search packages..."
              value={packageSearch}
              onChangeText={setPackageSearch}
              style={styles.searchInput}
              placeholderTextColor="#6B7280"
            />
          </View>

          <View style={styles.searchBox}>
            <Search size={18} color="#6B7280" />
            <TextInput
              placeholder="Search by test name..."
              value={testSearch}
              onChangeText={setTestSearch}
              style={styles.searchInput}
              placeholderTextColor="#6B7280"
            />
          </View>
        </View>

        {/* -------- Loading -------- */}
        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#2563EB"
            style={{ marginTop: 40 }}
          />
        )}

        {/* -------- Packages List -------- */}
        {packages.map((pkg: any) => (
          <TouchableOpacity
            key={pkg.id}
            style={styles.packageCard}
            onPress={() =>
              router.push({
                pathname: '/tests/test-details',
                params: { id: pkg.id, type: 'package' },
              })
            }
          >
            <Image
              source={{ uri: DEFAULT_PACKAGE_IMAGE }}
              style={styles.packageImage}
            />

            <View style={styles.packageContent}>
              <View style={styles.packageHeader}>
                <Text style={styles.packageName}>{pkg.name}</Text>
                {pkg.tests?.length ? (
                  <Text style={styles.testCount}>{pkg.tests.length} tests</Text>
                ) : null}
              </View>

              {pkg.description ? (
                <Text style={styles.packageDescription}>{pkg.description}</Text>
              ) : null}

              <View style={styles.priceContainer}>
                <Text style={styles.price}>NPR {pkg.price}</Text>
              </View>

              <View style={styles.viewButton}>
                <Eye size={16} color="#2563EB" />
                <Text style={styles.viewButtonText}>View Details</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {!isLoading && packages.length === 0 && (
          <Text style={styles.noDataText}>No packages found.</Text>
        )}

        {/* -------- Load More Button -------- */}
        {!isLoading && page < totalPages && (
          <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
            {isFetching ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.loadMoreText}>Load More</Text>
                <ChevronDown size={16} color="#fff" style={{ marginLeft: 6 }} />
              </View>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDFD' },

  searchCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  searchCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: {
    marginLeft: 8,
    fontSize: 16,
    flex: 1,
    color: '#1F2937',
  },

  packageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  packageImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  packageContent: { padding: 16 },

  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  testCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  packageDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },

  priceContainer: { marginBottom: 16 },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563EB',
  },

  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    borderRadius: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginLeft: 4,
  },

  noDataText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#6B7280',
  },

  loadMoreButton: {
    backgroundColor: '#2563EB',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
