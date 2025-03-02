import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Platform } from 'react-native';

export default function TransactionLayout() {
  // Log when the component mounts to verify it's working
  useEffect(() => {
    console.log('TransactionLayout mounted');
  }, []);

  return (
    <ProtectedRoute>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="add" />
        <Stack.Screen name="[id]" />
        <Stack.Screen name="edit/[id]" />
      </Stack>
    </ProtectedRoute>
  );
} 