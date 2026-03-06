import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { COLORS } from '@/lib/theme';

export default function NotificationsScreen() {
  const dummyNotifications = [
    {
      id: '1',
      title: 'Booking Confirmed',
      message:
        'Your home sample collection for Full Body Checkup is confirmed for tomorrow at 8:00 AM.',
      time: '10 mins ago',
      read: false,
    },
    {
      id: '2',
      title: 'Report Available',
      message:
        'Your Lipid Profile test report is now available to view and download.',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '3',
      title: 'Special Offer',
      message:
        'Get 20% off on all Diabetes Care packages. Valid till this weekend!',
      time: '1 day ago',
      read: true,
    },
  ];

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={24} color={COLORS.grey800} />
        </TouchableOpacity>
        <Text style={s.title}>Notifications</Text>
        <View style={s.placeholder} />
      </View>

      <FlatList
        data={dummyNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={[s.card, !item.read && s.unreadCard]}>
            <View style={[s.iconBg, !item.read && s.unreadIconBg]}>
              <Bell
                size={20}
                color={!item.read ? COLORS.primary : COLORS.grey500}
              />
            </View>
            <View style={s.content}>
              <View style={s.cardHeader}>
                <Text style={[s.cardTitle, !item.read && s.unreadText]}>
                  {item.title}
                </Text>
                <Text style={s.time}>{item.time}</Text>
              </View>
              <Text style={s.message}>{item.message}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey200,
  },
  backBtn: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.grey800,
  },
  placeholder: {
    width: 32,
  },
  list: {
    padding: 20,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.grey200,
  },
  unreadCard: {
    backgroundColor: '#F4FAFA',
    borderColor: COLORS.primaryLight,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.grey100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  unreadIconBg: {
    backgroundColor: COLORS.primaryLight,
  },
  content: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.grey800,
    flex: 1,
  },
  unreadText: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  time: {
    fontSize: 12,
    color: COLORS.grey500,
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    color: COLORS.grey500,
    lineHeight: 20,
  },
});
