import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, CalendarX } from 'lucide-react-native';
import { COLORS } from '@/lib/theme';
import { useRouter } from 'expo-router';
import { useMyBookings } from '@/hooks/useMyBookings';
import { format } from 'date-fns';

export default function MyBookingsScreen() {
  const router = useRouter();
  const { data, isLoading, error } = useMyBookings({ page: 1, limit: 10 });

  const renderBooking = (booking: any) => {
    const isCompleted = booking.status.toLowerCase() === 'completed';
    const isCancelled = booking.status.toLowerCase() === 'cancelled';

    return (
      <View key={booking.id} style={s.bookingCard}>
        <View style={s.cardHeader}>
          <Text style={s.bookingId}>ID: #{booking.id}</Text>
          <View
            style={[
              s.statusBadge,
              isCompleted && s.statusCompleted,
              isCancelled && s.statusCancelled,
            ]}
          >
            <Text
              style={[
                s.statusText,
                isCompleted && s.statusTextCompleted,
                isCancelled && s.statusTextCancelled,
              ]}
            >
              {booking.status}
            </Text>
          </View>
        </View>

        <View style={s.cardItems}>
          {booking.items?.map((item: any) => (
            <Text key={item.id} style={s.itemName}>
              • {item.name}
            </Text>
          ))}
          {(!booking.items || booking.items.length === 0) && (
            <Text style={s.itemName}>Custom Test Selection</Text>
          )}
        </View>

        <View style={s.cardFooter}>
          <View>
            <Text style={s.footerLabel}>Date</Text>
            <Text style={s.footerValue}>
              {booking.date
                ? format(new Date(booking.date), 'MMM dd, yyyy')
                : 'N/A'}
            </Text>
          </View>
          <View>
            <Text style={s.footerLabel}>Time</Text>
            <Text style={s.footerValue}>{booking.timeSlot || 'N/A'}</Text>
          </View>
          <View>
            <Text style={s.footerLabel}>Price</Text>
            <Text style={[s.footerValue, { color: COLORS.primary }]}>
              Rs.{' '}
              {booking.items?.reduce(
                (acc: number, item: any) => acc + item.price,
                0,
              ) || '0'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ChevronLeft size={24} color={COLORS.grey800} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>My Bookings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={s.content}>
        {isLoading ? (
          <View style={s.centerAll}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={s.loadingText}>Fetching bookings...</Text>
          </View>
        ) : error ? (
          <View style={s.centerAll}>
            <Text style={[s.loadingText, { color: COLORS.error }]}>
              Failed to load bookings
            </Text>
          </View>
        ) : !data?.data || data.data.length === 0 ? (
          <View style={s.centerAll}>
            <View style={s.iconWrap}>
              <CalendarX size={48} color={COLORS.grey300} />
            </View>
            <Text style={s.emptyTitle}>No Bookings Found</Text>
            <Text style={s.emptySub}>
              Looks like you haven't made any bookings yet.
            </Text>
            <TouchableOpacity
              style={s.browseBtn}
              onPress={() => router.navigate('/(tabs)/tests')}
            >
              <Text style={s.browseBtnText}>Browse Tests</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={s.scrollContent}
          >
            {data.data.map(renderBooking)}
          </ScrollView>
        )}
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
  },
  centerAll: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '500',
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
  browseBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  browseBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingId: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.grey800,
  },
  statusBadge: {
    backgroundColor: '#fffbeb',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusCompleted: {
    backgroundColor: '#f0fdf4',
  },
  statusCancelled: {
    backgroundColor: '#fef2f2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f59e0b',
    textTransform: 'uppercase',
  },
  statusTextCompleted: {
    color: '#22c55e',
  },
  statusTextCancelled: {
    color: '#ef4444',
  },
  cardItems: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey50,
  },
  itemName: {
    fontSize: 15,
    color: COLORS.grey500,
    lineHeight: 22,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerLabel: {
    fontSize: 11,
    color: COLORS.grey400,
    marginBottom: 4,
    fontWeight: '600',
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.grey800,
  },
});
