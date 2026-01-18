import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TestTube,
  FileText,
  Activity as ActivityIcon,
  Calendar,
  Heart,
  Search,
} from 'lucide-react-native';
import { router } from 'expo-router';

import { useDebounce } from '@/hooks/useDebounce';
import { useTests } from '@/hooks/useTests';
import { usePackages } from '@/hooks/usePackages';

const DEFAULT_PACKAGE_IMAGE =
  'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);

  const isSearching = debouncedSearch.trim().length > 0;

  /* ---------------- TEST SEARCH ---------------- */
  const { data: testData, isLoading: testsLoading } = useTests({
    page: 1,
    limit: 50,
    filters: { testName: debouncedSearch },
  });

  const tests = testData?.tests || [];

  /* ---------------- FEATURED PACKAGES ---------------- */
  const { data: packageData, isLoading: packagesLoading } = usePackages({
    page: 1,
    limit: 10,
    filters: {},
  });

  const featuredPackages = packageData?.data || [];

  const quickLinks = [
    { title: 'Lab Packages', icon: TestTube, color: '#007E7C', route: '/tests/packages' },
    { title: 'All Tests', icon: ActivityIcon, color: '#FF9900', route: '/tests/all-tests' },
    { title: 'My Reports', icon: FileText, color: '#007E7C', route: '/reports' },
    { title: 'Book Test', icon: Calendar, color: '#FF9900', route: '/tests' },
  ];

  /* ---------------- SEARCH RESULTS ---------------- */
  const renderSearchResults = () => {
    if (testsLoading) {
      return (
        <ActivityIndicator
          size="large"
          color="#007E7C"
          style={{ marginTop: 50 }}
        />
      );
    }

    if (tests.length === 0) {
      return <Text style={styles.noResultsText}>No tests found.</Text>;
    }

    return (
      <FlatList
        data={tests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.testCard}
            onPress={() =>
              router.push({
                pathname: '/tests/test-details',
                params: { id: item.id, type: 'test' },
              })
            }
          >
            <Text style={styles.testName}>{item.testName}</Text>
            <Text style={styles.testPrice}>NPR {item.amount}</Text>
          </TouchableOpacity>
        )}
      />
    );
  };

  /* ---------------- HOME CONTENT ---------------- */
  const renderHomeContent = () => (
    <>
      {/* Quick Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Links</Text>
        <View style={styles.quickLinksGrid}>
          {quickLinks.map((link, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickLinkCard, { borderLeftColor: link.color }]}
              onPress={() => router.push(link.route as any)}
            >
              <link.icon size={24} color={link.color} />
              <Text style={styles.quickLinkText}>{link.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Packages */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Packages</Text>

        {packagesLoading ? (
          <ActivityIndicator size="small" color="#007E7C" />
        ) : (
          <FlatList
            horizontal
            data={featuredPackages}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.packageCard}
                onPress={() =>
                  router.push({
                    pathname: '/tests/package-details',
                    params: { id: item.id, type: 'package' },
                  })
                }
              >
                <Image
                  source={{ uri: DEFAULT_PACKAGE_IMAGE }}
                  style={styles.packageImage}
                />
                <View style={styles.packageInfo}>
                  <Text style={styles.packageName}>{item.name}</Text>
                  <Text style={styles.packagePrice}>
                    NPR {item.price}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
          />
          <View>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.clinicName}>Sukra Polyclinic</Text>
          </View>
        </View>
        <Heart size={32} color="#007E7C" />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" />
        <TextInput
          placeholder="Search for tests..."
          style={styles.searchInput}
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Body */}
      {isSearching ? renderSearchResults() : renderHomeContent()}
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDFD' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 4,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 40, height: 40, resizeMode: 'contain', marginRight: 10 },
  welcomeText: { fontSize: 14, color: '#6B7280' },
  clinicName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007E7C',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 1,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },

  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 20,
  },

  quickLinksGrid: { paddingHorizontal: 20 },
  quickLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
  },
  quickLinkText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 16,
  },

  packageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 16,
    width: 200,
    elevation: 2,
  },
  packageImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  packageInfo: { padding: 16 },
  packageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007E7C',
  },

  testCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  testPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007E7C',
  },

  noResultsText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#6B7280',
  },
});
