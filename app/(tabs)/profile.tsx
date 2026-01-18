import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Settings,
  LogOut,
  Bell,
  ArrowRight,
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { useCurrent } from '@/hooks/useCurrent'; // <-- your API hook for current user
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { dispatch } = useApp();
  const { data: user, isLoading } = useCurrent();
  const router=useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          
          dispatch({ type: 'LOGOUT' }) 
          router.replace('/auth/login')

        
        }},
      ]
    );
  };

  const profileItems = [
    { icon: Bell, title: 'Notifications', subtitle: 'Manage notification preferences' },
    { icon: Calendar, title: 'My Bookings', subtitle: 'View booking history' },
    { icon: MapPin, title: 'Saved Addresses', subtitle: 'Manage delivery addresses' },
    { icon: Settings, title: 'Settings', subtitle: 'App preferences and privacy' },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ----- HEADER ----- */}
        <View style={styles.header}>
          <View style={styles.profileIcon}>
            <User size={36} color="#16A34A" />
          </View>
          <Text style={styles.userName}>{user?.name || 'Unnamed User'}</Text>
          <Text style={styles.userEmail}>{user?.email || user?.mobile}</Text>
        </View>

        {/* ----- INFO CARD ----- */}
        <View style={styles.infoCard}>
          {user?.mobile && (
            <View style={styles.infoItem}>
              <Phone size={20} color="#6B7280" />
              <Text style={styles.infoText}>{user.mobile}</Text>
            </View>
          )}
          {user?.email && (
            <View style={styles.infoItem}>
              <Mail size={20} color="#6B7280" />
              <Text style={styles.infoText}>{user.email}</Text>
            </View>
          )}
          {user?.dob && (
            <View style={styles.infoItem}>
              <Calendar size={20} color="#6B7280" />
              <Text style={styles.infoText}>{new Date(user.dob).toDateString()}</Text>
            </View>
          )}
        </View>

        {/* ----- MENU ----- */}
        <View style={styles.section}>
          {profileItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <item.icon size={20} color="#16A34A" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <ArrowRight size={18} color="#6B7280" />
            </TouchableOpacity>
          ))}
        </View>

        {/* ----- LOGOUT ----- */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* ----- FOOTER ----- */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>Sukra Polyclinic v1.0.0</Text>
          <Text style={styles.footerText}>Your health, our priority</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4', // light green background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#16A34A',
  },
  header: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  },
  profileIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#DCFCE7',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#4B5563',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#065F46',
    marginLeft: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    justifyContent: 'space-between',
  },
  menuIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
    marginLeft: 8,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#4B5563',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  versionText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#4B5563',
    fontStyle: 'italic',
  },
});
