import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HelloWave } from '@/components/HelloWave';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  
  const handleNext = () => {
    router.push('/onboarding/notifications');
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <HelloWave />
        <ThemedText style={styles.title}>Welcome to Finance Tracker</ThemedText>
        <ThemedText style={styles.subtitle}>
          Your personal finance journey starts here. Let's get you set up with a few quick steps.
        </ThemedText>
      </View>
      
      <Animated.View style={[styles.buttonContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <Animated.View 
          style={styles.button}
          onTouchEnd={handleNext}
        >
          <ThemedText style={styles.buttonText}>Get Started</ThemedText>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 16,
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
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});