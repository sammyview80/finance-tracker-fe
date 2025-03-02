import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import logger from '@/utils/logger';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Helper function to check token directly
const checkTokenDirectly = async (): Promise<boolean> => {
  try {
    let token = null;
    if (Platform.OS === 'web') {
      token = localStorage.getItem('@finance_tracker:auth_token');
    } else {
      token = await AsyncStorage.getItem('@finance_tracker:auth_token');
    }
    return !!token;
  } catch (error) {
    logger.error('Error checking token directly:', error);
    return false;
  }
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [hasToken, setHasToken] = useState(false);
  const { checkTokenExists, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        logger.log('Verifying authentication...');
        
        // First check directly with AsyncStorage/localStorage
        const tokenExists = await checkTokenDirectly();
        setHasToken(tokenExists);
        
        // Then use the context method as a backup
        if (!tokenExists) {
          const contextToken = await checkTokenExists();
          setHasToken(contextToken);
        }
        
        if (!tokenExists && !isAuthenticated) {
          logger.log('No token found, redirecting to login...');
          // If no token found, redirect to login
          router.replace('/onboarding/auth');
        }
      } catch (error) {
        logger.error('Error verifying authentication:', error);
        router.replace('/onboarding/auth');
      } finally {
        setIsChecking(false);
      }
    };

    if (!isLoading) {
      // Only check if AuthContext has finished its initial loading
      verifyAuth();
    }
  }, [checkTokenExists, isLoading, isAuthenticated]);

  // Show loading indicator while checking
  if (isLoading || isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ color: '#FFFFFF', marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  // If we have a token or the user is authenticated, render children
  if (hasToken || isAuthenticated) {
    return <>{children}</>;
  }

  // Otherwise, render nothing (the redirect should have happened)
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text style={{ color: '#FFFFFF', marginTop: 10 }}>Redirecting...</Text>
    </View>
  );
}