import { useCurrent } from '@/hooks/useCurrent';
import { Tabs, useRouter } from 'expo-router';
import { Chrome as Home, TestTube, ShoppingCart, FileText, User } from 'lucide-react-native';
import { useEffect } from 'react';

export default function TabLayout() {
  const router=useRouter();
  const { data, isLoading } = useCurrent();


  // ✅ Redirect ONLY after render
  useEffect(() => {
      console.log("Current User Data:", data);

    if (!isLoading && !data) {
      router.replace('/auth/login');
    } else if (!isLoading && data?.isNew){
      router.replace("/auth/signup")
    }
  }, [data, isLoading, router]);

  // ✅ Prevent flashing tabs while checking auth
  if (isLoading || !data) {
    return null;
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tests"
        options={{
          title: 'Tests',
          tabBarIcon: ({ size, color }) => (
            <TestTube size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ size, color }) => (
            <ShoppingCart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ size, color }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}