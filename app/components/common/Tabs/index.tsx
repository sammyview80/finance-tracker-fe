import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function Tab() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={{ marginLeft: 16 }}
          >
            <FontAwesome 
              name="bars" 
              size={24} 
              color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'} 
            />
          </TouchableOpacity>
        ),
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
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
            backgroundColor: Colors[colorScheme ?? 'light'].background,
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
            backgroundColor: Colors[colorScheme ?? 'light'].background,
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
