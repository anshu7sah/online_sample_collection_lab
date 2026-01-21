import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { router } from 'expo-router';

export default function CartScreen() {
  const { state, dispatch } = useApp();
  const { cart } = state;

  // Remove item from cart
  const removeFromCart = (id: number) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => dispatch({ type: 'REMOVE_FROM_CART', payload: id }) },
      ]
    );
  };

  // Calculate total amount safely
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      let price = 0;
      if (typeof item.price === 'string') {
        price = parseInt(item.price.replace(/[^0-9]/g, ''));
      } else if (typeof item.price === 'number') {
        price = item.price;
      }
      return total + price;
    }, 0);
  };

  // Proceed to booking
  const proceedToBooking = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart before proceeding.');
      return;
    }
    router.push('/booking/step1');
  };

  // ---------------- EMPTY CART ----------------
  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>
        <View style={styles.emptyContainer}>
          <ShoppingBag size={64} color="#16A34A" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some tests or packages to get started
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/tests')}
          >
            <Text style={styles.browseButtonText}>Browse Tests</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart ({cart.length})</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {cart.map((item) => (
          <View key={`${item.type}-${item.id}`} style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={[styles.itemType, item.type === 'package' ? styles.packageLabel : styles.testLabel]}>
                {item.type === 'package' ? 'Lab Package' : 'Individual Test'}
              </Text>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => removeFromCart(item.id)}
            >
              <Trash2 size={20} color="#DC2626" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>NPR {calculateTotal().toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.proceedButton} onPress={proceedToBooking}>
          <Text style={styles.proceedButtonText}>Proceed to Booking</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#D1FAE5',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#166534' },

  content: { flex: 1, padding: 16 },

  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#166534', marginBottom: 4 },
  itemType: {
    fontSize: 12,
    color: '#ffffff',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 8,
    fontWeight: '600',
  },
  packageLabel: { backgroundColor: '#D1FAE5', color: '#065F46' },
  testLabel: { backgroundColor: '#BBF7D0', color: '#065F46' },
  itemPrice: { fontSize: 16, fontWeight: '700', color: '#065F46' },
  removeButton: { padding: 8, justifyContent: 'center' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#166534', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#4B5563', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  browseButton: { backgroundColor: '#16A34A', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  browseButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },

  footer: { backgroundColor: '#FFFFFF', padding: 20, borderTopWidth: 1, borderTopColor: '#D1FAE5' },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  totalLabel: { fontSize: 16, fontWeight: '600', color: '#166534' },
  totalAmount: { fontSize: 20, fontWeight: '700', color: '#16A34A' },
  proceedButton: {
    backgroundColor: '#16A34A',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  proceedButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginRight: 8 },
});
