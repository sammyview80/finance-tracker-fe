import React, { useState } from 'react';
import { StyleSheet, View, Animated, Platform } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';

export default function ContactsScreen() {
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied'>('pending');

  const requestPermission = async () => {
    if (Platform.OS === 'web') {
      router.push('/onboarding/camera');
      return;
    }

    const { status } = await Contacts.requestPermissionsAsync();
    setPermissionStatus(status === 'granted' ? 'granted' : 'denied');
    
    // Proceed to next screen regardless of permission status
    router.push('/onboarding/camera');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FontAwesome name="address-book" size={64} color="#4CAF50" />
        </View>
        
        <ThemedText style={styles.title}>Sync Contacts</ThemedText>
        <ThemedText style={styles.subtitle}>
          Connect with your contacts to easily split bills, track shared expenses, and manage group finances together.
        </ThemedText>
      </View>
      
      <Animated.View style={styles.buttonContainer}>
        <Animated.View 
          style={styles.button}
          onTouchEnd={requestPermission}
        >
          <ThemedText style={styles.buttonText}>Enable Contacts</ThemedText>
        </Animated.View>
        <Animated.View 
          style={styles.skipButton}
          onTouchEnd={() => router.push('/onboarding/camera')}
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