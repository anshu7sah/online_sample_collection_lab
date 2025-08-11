import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { useApp } from '@/contexts/AppContext';

export default function AllTestsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { dispatch } = useApp();

  const tests = [
    { id: 1, name: 'Complete Blood Count (CBC)', price: 'NPR 200', category: 'Blood Test' },
    { id: 2, name: 'Blood Sugar (Fasting)', price: 'NPR 150', category: 'Diabetes' },
    { id: 3, name: 'Blood Sugar (Random)', price: 'NPR 150', category: 'Diabetes' },
    { id: 4, name: 'HbA1c', price: 'NPR 400', category: 'Diabetes' },
    { id: 5, name: 'Lipid Profile', price: 'NPR 300', category: 'Heart Health' },
    { id: 6, name: 'Liver Function Test', price: 'NPR 350', category: 'Liver' },
    { id: 7, name: 'Kidney Function Test', price: 'NPR 300', category: 'Kidney' },
    { id: 8, name: 'Thyroid Profile', price: 'NPR 500', category: 'Hormones' },
    { id: 9, name: 'Vitamin D', price: 'NPR 800', category: 'Vitamins' },
    { id: 10, name: 'Vitamin B12', price: 'NPR 600', category: 'Vitamins' },
  ];

  const filteredTests = tests.filter(test =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (test: any) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: test.id,
        name: test.name,
        price: test.price,
        type: 'test',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tests..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredTests.map((test) => (
          <TouchableOpacity
            key={test.id}
            style={styles.testCard}
            onPress={() => router.push({ pathname: '/tests/test-details', params: { id: test.id, type: 'test' } })}
          >
            <View style={styles.testInfo}>
              <Text style={styles.testName}>{test.name}</Text>
              <Text style={styles.testCategory}>{test.category}</Text>
              <Text style={styles.testPrice}>{test.price}</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(test)}
            >
              <Plus size={16} color="#2563EB" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
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
  filterButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  testCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  testInfo: {
    flex: 1,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  testCategory: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 8,
  },
  testPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
  },
  addButton: {
    width: 32,
    height: 32,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});