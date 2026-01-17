import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { useTests } from '@/hooks/useTests';
import { useDebounce } from '@/hooks/useDebounce';

export default function AllTestsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);

  const [page, setPage] = useState(1);
  const limit = 10;
  const { dispatch } = useApp();

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

  const addToCart = (test: any) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: test.id,
        name: test.testName,
        price: test.amount,
        type: 'test',
      },
    });
  };

  const goNext = () => page < totalPages && setPage((prev) => prev + 1);
  const goPrev = () => page > 1 && setPage((prev) => prev - 1);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tests..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007E7C" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {tests.map((test) => (
            <View key={test.id} style={styles.testCard}>
              <View style={styles.testInfo}>
                <Text style={styles.testName}>{test.testName}</Text>
                {test.department && <Text style={styles.testCategory}>{test.department}</Text>}
                <Text style={styles.testPrice}>NPR {test.amount}</Text>
              </View>
              <TouchableOpacity style={styles.addButton} onPress={() => addToCart(test)}>
                <Plus size={16} color="#007E7C" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Pagination */}
          <View style={styles.pagination}>
            <TouchableOpacity
              style={[styles.pageButton, page === 1 && styles.disabled]}
              onPress={goPrev}
              disabled={page === 1}
            >
              <ChevronLeft size={20} color={page === 1 ? '#A1A1AA' : '#007E7C'} />
              <Text style={[styles.pageText, page === 1 && styles.disabledText]}>Prev</Text>
            </TouchableOpacity>
            <Text style={styles.pageCounter}>
              Page {page} / {totalPages}
            </Text>
            <TouchableOpacity
              style={[styles.pageButton, page === totalPages && styles.disabled]}
              onPress={goNext}
              disabled={page === totalPages}
            >
              <Text style={[styles.pageText, page === totalPages && styles.disabledText]}>Next</Text>
              <ChevronRight size={20} color={page === totalPages ? '#A1A1AA' : '#007E7C'} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDFD' }, // Home screen background color
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
  },
  filterButton: { padding: 8, backgroundColor: '#FFFFFF', borderRadius: 12 },
  content: { padding: 16, paddingBottom: 100 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  testCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  testInfo: { flex: 1 },
  testName: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  testCategory: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#E0F2F1', // soft turquoise like home
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 8,
  },
  testPrice: { fontSize: 16, fontWeight: '700', color: '#007E7C' },
  addButton: {
    width: 32,
    height: 32,
    backgroundColor: '#DCFDFB', // soft turquoise accent
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingBottom: 16,
  },
  pageButton: { flexDirection: 'row', alignItems: 'center' },
  pageText: { color: '#007E7C', fontWeight: '600', marginHorizontal: 4 },
  disabled: { opacity: 0.5 },
  disabledText: { color: '#A1A1AA' },
  pageCounter: { fontWeight: '600', color: '#1F2937' },
});
