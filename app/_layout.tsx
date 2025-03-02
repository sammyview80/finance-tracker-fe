import 'react-native-reanimated';

import React, { useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
// Import Reanimated first
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useOnboarding } from '@/hooks/useOnboarding';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerProvider } from '@/app/components/common/Drawer/DrawerProvider';
import { ToastProvider } from '@/app/components/common/Toast';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Add your custom fonts here
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <RootLayoutNav />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isOnboardingComplete } = useOnboarding();
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <ToastProvider>
          <DrawerProvider>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack screenOptions={{ headerShown: false }}>
              {!isOnboardingComplete ? (
                <Stack.Screen name="onboarding" />
              ) : !isAuthenticated ? (
                <Stack.Screen name="onboarding/auth" />
              ) : (
                <>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="transaction/add" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="transaction/[id]" options={{ presentation: 'card' }} />
                  <Stack.Screen name="budget/create" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="budget/[id]" options={{ presentation: 'card' }} />
                  <Stack.Screen name="savings/create" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="savings/[id]" options={{ presentation: 'card' }} />
                  <Stack.Screen name="profile/edit" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="settings/about" options={{ presentation: 'card' }} />
                  <Stack.Screen name="settings/language" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="settings/currency" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="settings/backup" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="settings/restore" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="settings/sync" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="settings/help" options={{ presentation: 'card' }} />
                </>
              )}
            </Stack>
          </DrawerProvider>
        </ToastProvider>
      </NavigationThemeProvider>
    </SafeAreaProvider>
  );
}
