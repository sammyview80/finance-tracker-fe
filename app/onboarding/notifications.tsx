import React, { useState } from 'react';
import { StyleSheet, View, Animated, Platform } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

export default function NotificationsScreen() {
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied'>('pending');

  const requestPermission = async () => {
    if (Platform.OS === 'web') {
      router.push('/onboarding/location');
      return;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionStatus(status === 'granted' ? 'granted' : 'denied');
    
    // Proceed to next screen regardless of permission status
    router.push('/onboarding/location');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FontAwesome name="bell" size={64} color="#4CAF50" />
        </View>
        
        <ThemedText style={styles.title}>Stay Updated</ThemedText>
        <ThemedText style={styles.subtitle}>
          Enable notifications to get updates about your spending habits, budget alerts, and financial insights.
        </ThemedText>
      </View>
      
      <Animated.View style={styles.buttonContainer}>
        <Animated.View 
          style={styles.button}
          onTouchEnd={requestPermission}
        >
          <ThemedText style={styles.buttonText}>Enable Notifications</ThemedText>
        </Animated.View>
        <Animated.View 
          style={styles.skipButton}
          onTouchEnd={() => router.push('/onboarding/location')}
        >
          <ThemedText style={styles.skipButtonText}>Skip for now</ThemedText>
        </Animated.View>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    padding: 24,
    width: '100%',
  },
  button: {
    backgroundColor: '#4CAF50',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    color: '#999999',
    fontSize: 16,
  },
});