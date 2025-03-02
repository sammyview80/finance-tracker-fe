import React, { useEffect } from 'react';
import Tab from '../components/common/Tabs';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useDrawer } from '@/app/components/common/Drawer/DrawerProvider';
import SwipeGestureHandler from '@/app/components/common/Drawer/SwipeGestureHandler';
import { Platform } from 'react-native';

export default function TabsLayout() {
  // Use try/catch to handle the case when the drawer context is not available
  let openDrawer = () => console.warn('Drawer not available');
  try {
    const drawerContext = useDrawer();
    openDrawer = drawerContext.openDrawer;
  } catch (error) {
    console.warn('Drawer context not available:', error);
  }

  // Log when the component mounts to verify it's working
  useEffect(() => {
    console.log('TabsLayout mounted, drawer handler ready');
  }, []);

  // On web, we don't need the gesture handler
  if (Platform.OS === 'web') {
    return (
      <ProtectedRoute>
        <Tab />
      </ProtectedRoute>
    );
  }

  // For mobile platforms, wrap the Tab component with SwipeGestureHandler
  return (
    <ProtectedRoute>
      <SwipeGestureHandler onSwipeRight={openDrawer}>
        <Tab />
      </SwipeGestureHandler>
    </ProtectedRoute>
  );
}
