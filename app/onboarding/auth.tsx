import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import { useOnboarding } from '@/hooks/useOnboarding';

export default function AuthScreen() {
  const { completeOnboarding } = useOnboarding();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    // TODO: Implement actual authentication
    // Mark onboarding as complete and navigate to main app
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.content}>
          <View style={styles.iconContainer}>
            <FontAwesome name="user" size={64} color="#4CAF50" />
          </View>
          
          <ThemedText style={styles.title}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {isLogin 
              ? 'Sign in to access your financial dashboard'
              : 'Join us to start tracking your finances'}
          </ThemedText>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#666666"
                value={name}
                onChangeText={setName}
              />
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={handleSubmit}
          >
            <ThemedText style={styles.buttonText}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <ThemedText style={styles.switchButtonText}>
              {isLogin 
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
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
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 28,
    paddingHorizontal: 24,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  button: {
    backgroundColor: '#4CAF50',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 24,
    padding: 8,
  },
  switchButtonText: {
    color: '#4CAF50',
    fontSize: 16,
  },
});