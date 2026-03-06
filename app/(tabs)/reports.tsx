import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  FileText,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  ClipboardList,
  ArrowRight,
  Inbox,
  X,
  Info,
  ShieldCheck,
  CreditCard,
  MapPin,
} from 'lucide-react-native';
import * as Linking from 'expo-linking';
import { useMyBookings } from '@/hooks/useMyBookings';
import { useCancelBooking } from '@/hooks/useCancelBooking';
import { COLORS } from '@/lib/theme';

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  const [activeTab, setActiveTab] = useState<'completed' | 'upcoming'>(
    'completed',
  );
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading, isFetching, refetch } = useMyBookings({
    page: 1,
    limit: 50,
  });

  const cancelMutation = useCancelBooking();

  const bookings = data?.data ?? [];
  const completed = bookings.filter((b: any) => b.status === 'COMPLETED');
  const upcoming = bookings.filter(
    (b: any) =>
      b.status === 'SCHEDULED' ||
      b.status === 'SAMPLE_COLLECTED' ||
      b.status === 'PENDING',
  );

  const handleOpenDetails = (booking: any) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCancelClick = (id: number) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        { text: 'No, Keep it', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            cancelMutation.mutate(id, {
              onSuccess: () => {
                setShowModal(false);
                setSelectedBooking(null);
                Alert.alert('Success', 'Booking cancelled successfully.');
              },
              onError: (error: any) => {
                const msg =
                  error.response?.data?.message || 'Failed to cancel booking';
                Alert.alert('Error', msg);
              },
            });
          },
        },
      ],
    );
  };

  /* ── Empty State ── */
  const renderEmpty = (title: string, desc: string, icon: any) => {
    const Icon = icon;
    return (
      <View style={s.emptyWrap}>
        <View style={s.emptyCircle}>
          <Icon size={40} color={COLORS.grey300} />
        </View>
        <Text style={s.emptyTitle}>{title}</Text>
        <Text style={s.emptyDesc}>{desc}</Text>
      </View>
    );
  };

  /* ── Status helpers ── */
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'SAMPLE_COLLECTED':
        return { label: 'Sample Taken', color: '#3B82F6', bg: '#DBEAFE' };
      case 'SCHEDULED':
        return {
          label: 'Scheduled',
          color: COLORS.secondary,
          bg: COLORS.secondaryLight,
        };
      default:
        return {
          label: 'Ready',
          color: COLORS.success,
          bg: COLORS.successLight,
        };
    }
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#004e56" />

      {/* ═══ Hero Header ═══ */}
      <LinearGradient
        colors={['#004e56', COLORS.primary, '#00888a']}
        locations={[0, 0.5, 1]}
        style={s.hero}
      >
        <SafeAreaView edges={['top']}>
          <View style={s.heroContent}>
            <View style={s.heroRow}>
              <View>
                <Text style={s.heroTitle}>My Reports</Text>
                <Text style={s.heroSub}>
                  {bookings.length} total booking
                  {bookings.length !== 1 ? 's' : ''}
                </Text>
              </View>
              <View style={s.heroIcon}>
                <ClipboardList size={22} color="#fff" />
              </View>
            </View>

            {/* Stats */}
            <View style={s.statsRow}>
              <View style={s.statCard}>
                <View
                  style={[s.statDot, { backgroundColor: COLORS.success }]}
                />
                <Text style={s.statNum}>{completed.length}</Text>
                <Text style={s.statLabel}>Completed</Text>
              </View>
              <View style={s.statCard}>
                <View
                  style={[s.statDot, { backgroundColor: COLORS.secondary }]}
                />
                <Text style={s.statNum}>{upcoming.length}</Text>
                <Text style={s.statLabel}>Upcoming</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>

        {/* Decorative */}
        <View style={s.deco1} />
        <View style={s.deco2} />
      </LinearGradient>

      {/* ═══ Tab Switcher ═══ */}
      <View style={s.tabWrap}>
        <View style={s.tabContainer}>
          <TouchableOpacity
            style={[s.tab, activeTab === 'completed' && s.activeTab]}
            onPress={() => setActiveTab('completed')}
            activeOpacity={0.7}
          >
            <CheckCircle
              size={16}
              color={activeTab === 'completed' ? '#fff' : COLORS.grey400}
            />
            <Text
              style={[s.tabText, activeTab === 'completed' && s.activeTabText]}
            >
              Completed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.tab, activeTab === 'upcoming' && s.activeTab]}
            onPress={() => setActiveTab('upcoming')}
            activeOpacity={0.7}
          >
            <Clock
              size={16}
              color={activeTab === 'upcoming' ? '#fff' : COLORS.grey400}
            />
            <Text
              style={[s.tabText, activeTab === 'upcoming' && s.activeTabText]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ═══ Content ═══ */}
      {isLoading ? (
        <View style={s.loaderWrap}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={s.loaderText}>Loading reports...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.content}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        >
          {/* Completed */}
          {activeTab === 'completed' &&
            (completed.length === 0
              ? renderEmpty(
                  'No reports yet',
                  'Your completed test reports will appear here',
                  Inbox,
                )
              : completed.map((booking: any) => (
                  <TouchableOpacity
                    key={booking.id}
                    style={s.card}
                    onPress={() => handleOpenDetails(booking)}
                    activeOpacity={0.9}
                  >
                    {/* Left accent */}
                    <View
                      style={[
                        s.cardAccent,
                        { backgroundColor: COLORS.success },
                      ]}
                    />

                    <View style={s.cardBody}>
                      <View style={s.cardRow}>
                        <View style={s.cardIconWrap}>
                          <FileText size={20} color={COLORS.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={s.cardTitle} numberOfLines={2}>
                            {booking.items.map((i: any) => i.name).join(', ')}
                          </Text>
                          <View style={s.cardMeta}>
                            <Calendar size={12} color={COLORS.grey400} />
                            <Text style={s.cardMetaText}>
                              {new Date(booking.date).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                },
                              )}
                            </Text>
                          </View>
                        </View>
                        <View style={s.readyBadge}>
                          <CheckCircle size={12} color={COLORS.success} />
                          <Text style={s.readyText}>Ready</Text>
                        </View>
                      </View>

                      {booking.reportUrl && (
                        <TouchableOpacity
                          style={s.downloadBtn}
                          activeOpacity={0.7}
                          onPress={() => Linking.openURL(booking.reportUrl)}
                        >
                          <Download size={16} color="#fff" />
                          <Text style={s.downloadText}>Download Report</Text>
                          <ArrowRight size={14} color="#fff" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                )))}

          {/* Upcoming */}
          {activeTab === 'upcoming' &&
            (upcoming.length === 0
              ? renderEmpty(
                  'No upcoming tests',
                  'Schedule a test to see it here',
                  Calendar,
                )
              : upcoming.map((booking: any) => {
                  const status = getStatusInfo(booking.status);
                  return (
                    <TouchableOpacity
                      key={booking.id}
                      style={s.card}
                      onPress={() => handleOpenDetails(booking)}
                      activeOpacity={0.9}
                    >
                      <View
                        style={[
                          s.cardAccent,
                          { backgroundColor: status.color },
                        ]}
                      />
                      <View style={s.cardBody}>
                        <View style={s.cardRow}>
                          <View
                            style={[
                              s.cardIconWrap,
                              { backgroundColor: COLORS.secondaryLight },
                            ]}
                          >
                            <Clock size={20} color={COLORS.secondary} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={s.cardTitle} numberOfLines={2}>
                              {booking.items.map((i: any) => i.name).join(', ')}
                            </Text>
                            <View style={s.cardMeta}>
                              <Calendar size={12} color={COLORS.grey400} />
                              <Text style={s.cardMetaText}>
                                {new Date(booking.date).toLocaleDateString(
                                  'en-US',
                                  {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  },
                                )}
                                {booking.timeSlot && ` • ${booking.timeSlot}`}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={[
                              s.statusBadge,
                              { backgroundColor: status.bg },
                            ]}
                          >
                            <Text
                              style={[s.statusText, { color: status.color }]}
                            >
                              {status.label}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }))}
        </ScrollView>
      )}

      {/* ═══ Booking Details Modal ═══ */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            {/* Header */}
            <View style={s.modalHeader}>
              <View>
                <Text style={s.modalTitle}>Booking Details</Text>
                <Text style={s.modalID}>Order ID: #{selectedBooking?.id}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={s.closeBtn}
              >
                <X size={24} color={COLORS.grey800} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Status Section */}
              <View style={s.detailSection}>
                <View style={[s.sectionIcon, { backgroundColor: '#E0F2FE' }]}>
                  <Info size={20} color="#0284C7" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.sectionTitle}>Booking Status</Text>
                  <View style={s.detailRow}>
                    <Text style={s.detailLabel}>Status:</Text>
                    <View
                      style={[
                        s.statusBadge,
                        selectedBooking?.status === 'COMPLETED'
                          ? { backgroundColor: COLORS.successLight }
                          : { backgroundColor: COLORS.secondaryLight },
                      ]}
                    >
                      <Text
                        style={[
                          s.statusText,
                          selectedBooking?.status === 'COMPLETED'
                            ? { color: COLORS.success }
                            : { color: COLORS.secondary },
                        ]}
                      >
                        {selectedBooking?.status}
                      </Text>
                    </View>
                  </View>
                  <View style={s.detailRow}>
                    <Text style={s.detailLabel}>Payment:</Text>
                    <Text style={s.paymentStatusText}>
                      {selectedBooking?.paymentStatus}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Items Section */}
              <View style={s.detailSection}>
                <View style={[s.sectionIcon, { backgroundColor: '#F0FDF4' }]}>
                  <ShieldCheck size={20} color="#16A34A" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.sectionTitle}>Tests Booked</Text>
                  {selectedBooking?.items.map((item: any, idx: number) => (
                    <View key={idx} style={s.itemRow}>
                      <Text style={s.itemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={s.itemPrice}>₹{item.price}</Text>
                    </View>
                  ))}
                  <View style={s.totalDivider} />
                  <View style={s.itemRow}>
                    <Text style={s.totalLabel}>Total Amount</Text>
                    <Text style={s.totalValue}>
                      ₹
                      {selectedBooking?.items.reduce(
                        (acc: number, curr: any) => acc + curr.price,
                        0,
                      )}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Appointment Section */}
              <View style={s.detailSection}>
                <View style={[s.sectionIcon, { backgroundColor: '#FFF7ED' }]}>
                  <Calendar size={20} color="#EA580C" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.sectionTitle}>Appointment Info</Text>
                  <View style={s.appointmentRow}>
                    <Calendar size={16} color={COLORS.grey400} />
                    <Text style={s.appointmentText}>
                      {selectedBooking &&
                        new Date(selectedBooking.date).toLocaleDateString(
                          'en-US',
                          {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          },
                        )}
                    </Text>
                  </View>
                  <View style={[s.appointmentRow, { marginTop: 6 }]}>
                    <Clock size={16} color={COLORS.grey400} />
                    <Text style={s.appointmentText}>
                      {selectedBooking?.timeSlot || 'Morning Session'}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Actions */}
            <View style={s.modalFooter}>
              {selectedBooking?.status !== 'COMPLETED' &&
                selectedBooking?.status !== 'CANCELLED' && (
                  <TouchableOpacity
                    style={s.cancelBookingBtn}
                    onPress={() => handleCancelClick(selectedBooking.id)}
                    disabled={cancelMutation.isPending}
                  >
                    {cancelMutation.isPending ? (
                      <ActivityIndicator size="small" color={COLORS.error} />
                    ) : (
                      <>
                        <X size={18} color={COLORS.error} />
                        <Text style={s.cancelBookingText}>Cancel Booking</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}

              {selectedBooking?.status === 'COMPLETED' &&
                selectedBooking?.reportUrl && (
                  <TouchableOpacity
                    style={s.modalDownloadBtn}
                    onPress={() => Linking.openURL(selectedBooking.reportUrl)}
                  >
                    <Download size={18} color="#fff" />
                    <Text style={s.modalDownloadText}>Download Report</Text>
                  </TouchableOpacity>
                )}

              <TouchableOpacity
                style={s.doneBtn}
                onPress={() => setShowModal(false)}
              >
                <Text style={s.doneBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ═══════════════════════════════════════
   S T Y L E S
   ═══════════════════════════════════════ */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F7FA' },

  /* ── Hero ── */
  hero: { overflow: 'hidden', paddingBottom: 24 },
  heroContent: { paddingHorizontal: 20, paddingTop: 12 },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '500',
    marginTop: 2,
  },
  heroIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statNum: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  deco1: {
    position: 'absolute',
    top: -width * 0.15,
    right: -width * 0.1,
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  deco2: {
    position: 'absolute',
    bottom: -width * 0.08,
    left: -width * 0.15,
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: 'rgba(239,142,31,0.08)',
  },

  /* ── Tabs ── */
  tabWrap: { paddingHorizontal: 20, marginTop: -12 },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  activeTab: { backgroundColor: COLORS.primary },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.grey400,
  },
  activeTabText: { color: '#fff' },

  /* ── Content ── */
  content: { padding: 20, paddingBottom: 30 },
  loaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  loaderText: {
    fontSize: 14,
    color: COLORS.grey400,
    marginTop: 12,
    fontWeight: '500',
  },

  /* ── Card ── */
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardAccent: {
    width: 4,
  },
  cardBody: {
    flex: 1,
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.grey800,
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardMetaText: {
    fontSize: 12,
    color: COLORS.grey400,
    fontWeight: '500',
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  readyText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.success,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  /* ── Download ── */
  downloadBtn: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: 12,
    gap: 8,
  },
  downloadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },

  /* ── Empty ── */
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.grey100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.grey700,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 14,
    color: COLORS.grey400,
    textAlign: 'center',
    lineHeight: 20,
  },

  /* ── Modal ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.grey900,
  },
  modalID: {
    fontSize: 12,
    color: COLORS.grey400,
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailSection: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 16,
  },
  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.grey800,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.grey400,
    fontWeight: '500',
  },
  paymentStatusText: {
    fontSize: 14,
    color: COLORS.grey900,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    color: COLORS.grey700,
    fontWeight: '500',
    flex: 1,
    paddingRight: 10,
  },
  itemPrice: {
    fontSize: 14,
    color: COLORS.grey900,
    fontWeight: '700',
  },
  totalDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.grey900,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appointmentText: {
    fontSize: 14,
    color: COLORS.grey700,
    fontWeight: '600',
  },
  modalFooter: {
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 10,
  },
  cancelBookingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 8,
    marginBottom: 12,
  },
  cancelBookingText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.error,
  },
  modalDownloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    gap: 10,
    marginBottom: 12,
  },
  modalDownloadText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  doneBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.grey700,
  },
});
