import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingCart, Check } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { useApp } from '@/contexts/AppContext';

export default function TestDetailsScreen() {
  const { id, type } = useLocalSearchParams();
  const { dispatch } = useApp();

  // Mock data - in real app, fetch based on id and type
  const testDetails = {
    name: type === 'package' ? 'Full Body Checkup' : 'Complete Blood Count (CBC)',
    price: type === 'package' ? 'NPR 2,500' : 'NPR 200',
    originalPrice: type === 'package' ? 'NPR 3,200' : null,
    description: type === 'package' 
      ? 'A comprehensive health screening package that includes over 40 essential tests to evaluate your overall health status.'
      : 'A complete blood count test that measures different components of your blood including red blood cells, white blood cells, and platelets.',
    parameters: type === 'package' 
      ? [
          'Complete Blood Count (CBC)',
          'Blood Sugar (Fasting & Random)',
          'Lipid Profile',
          'Liver Function Test',
          'Kidney Function Test',
          'Thyroid Profile',
          'Vitamin D',
          'Vitamin B12',
          'HbA1c',
          'Urine Analysis',
        ]
      : [
          'Red Blood Cell Count',
          'White Blood Cell Count',
          'Platelet Count',
          'Hemoglobin Level',
          'Hematocrit',
        ],
    preparation: type === 'package'
      ? 'Fasting for 10-12 hours required. Drink plenty of water.'
      : 'No special preparation required.',
  };

  const addToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: parseInt(id as string),
        name: testDetails.name,
        price: testDetails.price,
        type: type as 'test' | 'package',
      },
    });
    
    Alert.alert(
      'Added to Cart',
      `${testDetails.name} has been added to your cart.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.testName}>{testDetails.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{testDetails.price}</Text>
            {testDetails.originalPrice && (
              <Text style={styles.originalPrice}>{testDetails.originalPrice}</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{testDetails.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {type === 'package' ? 'Included Tests' : 'Parameters Measured'}
          </Text>
          {testDetails.parameters.map((parameter, index) => (
            <View key={index} style={styles.parameterItem}>
              <Check size={16} color="#16A34A" />
              <Text style={styles.parameterText}>{parameter}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preparation Instructions</Text>
          <Text style={styles.preparation}>{testDetails.preparation}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerPricing}>
          <Text style={styles.footerPriceLabel}>Total Amount</Text>
          <Text style={styles.footerPrice}>{testDetails.price}</Text>
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
          <ShoppingCart size={20} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  testName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 16,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  parameterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  parameterText: {
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 8,
  },
  preparation: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerPricing: {
    flex: 1,
  },
  footerPriceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  footerPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
  },
  addToCartButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});