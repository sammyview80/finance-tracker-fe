import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemedText } from '@/components/ThemedText';
import { useDrawer } from '@/app/components/common/Drawer/DrawerProvider';

export default function Tab() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const insets = useSafeAreaInsets();
  const [isReady, setIsReady] = useState(false);
  
  // Use try/catch to handle the case when the drawer context is not available
  let drawerContext;
  try {
    drawerContext = useDrawer();
  } catch (error) {
    console.warn('Drawer context not available:', error);
    drawerContext = { openDrawer: () => console.warn('Drawer not available') };
  }
  
  const { openDrawer } = drawerContext;

  // Add a small delay to ensure everything is loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: isDark ? '#121212' : '#FFFFFF' 
      }}>
        <ActivityIndicator size="large" color={Colors[isDark ? 'dark' : 'light'].tint} />
        <ThemedText style={{ marginTop: 10 }}>Loading dashboard...</ThemedText>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[isDark ? 'dark' : 'light'].tint,
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity
            onPress={openDrawer}
            style={{ marginLeft: 16 }}
          >
            <FontAwesome 
              name="bars" 
              size={24} 
              color={isDark ? '#FFFFFF' : '#000000'} 
            />
          </TouchableOpacity>
        ),
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 85,
            backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
            borderTopWidth: 0.5,
            borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
          }} />
        ),
        tabBarStyle: Platform.select({
          ios: {
            paddingTop: 7,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            borderLeftWidth: 0.2,
            borderRightWidth: 0.2,
            overflow: 'hidden',
            position: 'absolute',
            height: 85,
            backgroundColor: 'transparent',
          },
          android: {
            paddingTop: 7,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            borderLeftWidth: 0.2,
            borderRightWidth: 0.2,
            overflow: 'hidden',
            position: 'absolute',
            height: 85,
            backgroundColor: 'transparent',
          },
          default: {},
        }),
        tabBarItemStyle: {
          paddingBottom: insets.bottom > 0 ? 0 : 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color} />,
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: 'Budget',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.pie.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
