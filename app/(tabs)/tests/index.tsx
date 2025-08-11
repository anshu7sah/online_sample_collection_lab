import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, List, Search, Star } from 'lucide-react-native';
import { router } from 'expo-router';

export default function TestsMainScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lab Tests</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.mainCard}
            onPress={() => router.push('/tests/packages')}
          >
            <View style={styles.cardIcon}>
              <Package size={32} color="#2563EB" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Lab Test Packages</Text>
              <Text style={styles.cardDescription}>
                Comprehensive health checkup packages at discounted prices
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.mainCard}
            onPress={() => router.push('/tests/all-tests')}
          >
            <View style={styles.cardIcon}>
              <List size={32} color="#059669" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Individual Tests</Text>
              <Text style={styles.cardDescription}>
                Browse and book individual lab tests as per your needs
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <View style={styles.categoriesGrid}>
            <TouchableOpacity style={styles.categoryCard}>
              <Star size={24} color="#F59E0B" />
              <Text style={styles.categoryText}>Blood Tests</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <Star size={24} color="#F59E0B" />
              <Text style={styles.categoryText}>Diabetes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <Star size={24} color="#F59E0B" />
              <Text style={styles.categoryText}>Heart Health</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <Star size={24} color="#F59E0B" />
              <Text style={styles.categoryText}>Liver Function</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  searchButton: {
    padding: 8,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  mainCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#EFF6FF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
    textAlign: 'center',
  },
});