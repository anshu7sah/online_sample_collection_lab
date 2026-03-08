import { useCurrent } from '@/hooks/useCurrent';
import { useApp } from '@/contexts/AppContext';
import { COLORS } from '@/lib/theme';
import { Tabs, useRouter } from 'expo-router';
import {
  Home,
  FlaskConical,
  ShoppingCart,
  ClipboardList,
  UserCircle,
} from 'lucide-react-native';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const router = useRouter();
  const { data, isLoading } = useCurrent();
  const { state } = useApp();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!isLoading && !data) {
      router.replace('/auth/login');
    } else if (!isLoading && data?.isNew) {
      router.replace('/auth/signup');
    }
  }, [data, isLoading, router]);

  if (isLoading || !data) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#ef8e1f',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.55)',
        tabBarStyle: {
          backgroundColor: COLORS.primary,
          borderTopWidth: 0,
          height: 60 + Math.max(0, insets.bottom),
          paddingTop: 8,
          paddingBottom: 8 + Math.max(0, insets.bottom),
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tests"
        options={{
          title: 'Tests',
          tabBarIcon: ({ size, color }) => (
            <FlaskConical size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ size, color }) => (
            <ShoppingCart size={24} color={color} />
          ),
          tabBarBadge: state.cart.length > 0 ? state.cart.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#ef8e1f',
            fontSize: 10,
            color: 'white',
          },
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ size, color }) => (
            <ClipboardList size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <UserCircle size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
