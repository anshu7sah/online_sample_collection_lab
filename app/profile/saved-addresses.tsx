import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MapPinOff } from 'lucide-react-native';
import { COLORS } from '@/lib/theme';
import { useRouter } from 'expo-router';

export default function SavedAddressesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ChevronLeft size={24} color={COLORS.grey800} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Saved Addresses</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      {/* Content */}
      <View style={s.content}>
        <View style={s.emptyState}>
          <View style={s.iconWrap}>
            <MapPinOff size={48} color={COLORS.grey300} />
          </View>
          <Text style={s.emptyTitle}>No Addresses Found</Text>
          <Text style={s.emptySub}>
            You haven't saved any addresses yet. Saved addresses will appear
            here.
          </Text>

          <TouchableOpacity style={s.addBtn}>
            <Text style={s.addBtnText}>Add New Address</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey50,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.grey50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.grey800,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyState: {
    alignItems: 'center',
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.grey800,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 15,
    color: COLORS.grey400,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
