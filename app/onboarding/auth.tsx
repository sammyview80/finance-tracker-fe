import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useForm, Controller } from 'react-hook-form';
import { useLogin, useRegister } from '@/services/auth/mutation';
import { IAuthResponse } from '@/services/auth/interface';
import { IAPIResponse } from '@/services/interface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHandleResponse } from '@/hooks/useHandleResponse';

// Define Zod schemas for validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
});

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof loginSchema>;

export default function AuthScreen() {
  const { completeOnboarding } = useOnboarding();
  const [isLogin, setIsLogin] = useState(true);
  const { mutate: login, isPending: isLogging } = useLogin();
  const { mutate: register, isPending: isRegistering } = useRegister();

  // Set up form with react-hook-form and zod validation
  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  // Reset validation when switching between login and register
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    reset(); // Clear form errors when switching modes
  };

  const onSubmit = async (data: FormData) => {
    // Mark onboarding as complete
    try {
      await completeOnboarding();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'There was an error completing the onboarding process.',
        position: 'bottom',
        visibilityTime: 4000,
      });
      return; // Don't proceed with login/register if onboarding completion fails
    }

    // Proceed with authentication
    if (isLogin) {
      login(data);
    } else {
      register({ ...data, name: data.name! });
    }
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
              <Controller
                control={control}
                name="name"
                rules={{
                  required: !isLogin ? 'Name is required' : false
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    placeholder="Full Name"
                    placeholderTextColor="#666666"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!isLogging || !isRegistering}
                  />
                )}
              />
              {errors.name && (
                <ThemedText style={styles.errorText}>{errors.name.message}</ThemedText>
              )}
            </View>
          )}

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Email"
                  placeholderTextColor="#666666"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLogging || !isRegistering}
                />
              )}
            />
            {errors.email && (
              <ThemedText style={styles.errorText}>{errors.email.message}</ThemedText>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="Password"
                  placeholderTextColor="#666666"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  editable={!isLogging || !isRegistering}
                />
              )}
            />
            {errors.password && (
              <ThemedText style={styles.errorText}>{errors.password.message}</ThemedText>
            )}
          </View>

          <TouchableOpacity
            style={[styles.button, isLogging || isRegistering ? styles.buttonDisabled : null]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLogging || isRegistering}
          >
            {isLogging || isRegistering ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <ThemedText style={styles.buttonText}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </ThemedText>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={toggleAuthMode}
            disabled={isLogging || isRegistering}
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
  buttonDisabled: {
    backgroundColor: '#4CAF50',
    opacity: 0.7,
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
  inputError: {
    borderColor: '#FF5252',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
});