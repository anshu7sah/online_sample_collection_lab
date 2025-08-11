import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye } from 'lucide-react-native';
import { router } from 'expo-router';

export default function PackagesScreen() {
  const packages = [
    {
      id: 1,
      name: 'Full Body Checkup',
      price: 'NPR 2,500',
      originalPrice: 'NPR 3,200',
      description: 'Complete health assessment with 40+ parameters',
      image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400',
      tests: 42,
    },
    {
      id: 2,
      name: 'Diabetes Panel',
      price: 'NPR 800',
      originalPrice: 'NPR 1,200',
      description: 'Comprehensive diabetes screening package',
      image: 'https://images.pexels.com/photos/6823568/pexels-photo-6823568.jpeg?auto=compress&cs=tinysrgb&w=400',
      tests: 8,
    },
    {
      id: 3,
      name: 'Heart Health Package',
      price: 'NPR 1,200',
      originalPrice: 'NPR 1,800',
      description: 'Complete cardiovascular health assessment',
      image: 'https://images.pexels.com/photos/4386477/pexels-photo-4386477.jpeg?auto=compress&cs=tinysrgb&w=400',
      tests: 15,
    },
    {
      id: 4,
      name: 'Liver Function Test',
      price: 'NPR 600',
      originalPrice: 'NPR 900',
      description: 'Comprehensive liver health evaluation',
      image: 'https://images.pexels.com/photos/5207262/pexels-photo-5207262.jpeg?auto=compress&cs=tinysrgb&w=400',
      tests: 12,
    },
    {
      id: 5,
      name: 'Women\'s Health Panel',
      price: 'NPR 1,800',
      originalPrice: 'NPR 2,400',
      description: 'Specialized health checkup for women',
      image: 'https://images.pexels.com/photos/4386447/pexels-photo-4386447.jpeg?auto=compress&cs=tinysrgb&w=400',
      tests: 25,
    },
    {
      id: 6,
      name: 'Senior Citizen Package',
      price: 'NPR 2,200',
      originalPrice: 'NPR 3,000',
      description: 'Comprehensive health package for seniors',
      image: 'https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=400',
      tests: 35,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {packages.map((pkg) => (
            <TouchableOpacity 
              key={pkg.id} 
              style={styles.packageCard}
              onPress={() => router.push({ pathname: '/tests/test-details', params: { id: pkg.id, type: 'package' } })}
            >
              <Image source={{ uri: pkg.image }} style={styles.packageImage} />
              <View style={styles.packageContent}>
                <View style={styles.packageHeader}>
                  <Text style={styles.packageName}>{pkg.name}</Text>
                  <Text style={styles.testCount}>{pkg.tests} tests</Text>
                </View>
                <Text style={styles.packageDescription}>{pkg.description}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{pkg.price}</Text>
                  <Text style={styles.originalPrice}>{pkg.originalPrice}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={() => router.push({ pathname: '/tests/test-details', params: { id: pkg.id, type: 'package' } })}
                >
                  <Eye size={16} color="#2563EB" />
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
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
  content: {
    padding: 16,
  },
  packageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  packageImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  packageContent: {
    padding: 16,
  },
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
    backgroundColor: '#F3F4F6',
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginLeft: 4,
  },
});