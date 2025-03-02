import { useHandleResponse } from "@/hooks/useHandleResponse";
import { apiClient } from "../apiClient";
import { ENDPOINT } from "./endpoint";
import { ILoginRequest, IAuthResponse, IRegisterRequest } from "./interface";
import { useMutation } from "@tanstack/react-query";
import { IAPIResponse } from "../interface";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import logger from '@/utils/logger';
import { showError } from '@/utils/toast';

// Constants
const AUTH_TOKEN_KEY = '@finance_tracker:auth_token';
const USER_DATA_KEY = '@finance_tracker:user_data';

// Helper function to save token
const saveToken = async (token: string) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    }
    return true;
  } catch (error) {
    logger.error('Error saving token:', error);
    return false;
  }
};

// Helper function to save user data
const saveUserData = async (userData: any) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } else {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    }
    return true;
  } catch (error) {
    logger.error('Error saving user data:', error);
    return false;
  }
};

// Helper function to navigate to dashboard
const navigateToDashboard = () => {
  logger.log('Navigating to dashboard...');
  
  // Short delay to allow the toast to be visible and auth state to update
  setTimeout(() => {
    try {
      // First try to reset the navigation state completely
      router.replace('/(tabs)');
      
      // If that doesn't work, try a more specific route
      setTimeout(() => {
        if (router.canGoBack()) {
          router.push('/');
        }
      }, 300);
    } catch (error) {
      logger.error('Navigation error:', error);
      // Fallback navigation
      setTimeout(() => {
        router.push('/');
      }, 500);
    }
  }, 1000);
};

export const login = async (body: ILoginRequest) => {
    return await apiClient.authPost<IAuthResponse>(ENDPOINT.login, body);
}

export const register = async (body: IRegisterRequest) => {
    return await apiClient.authPost<IAuthResponse>(ENDPOINT.register, body);
}

export const useLogin = () => {
    const { onError, onSuccess } = useHandleResponse();
    return useMutation({
        mutationFn: login,
        onSuccess: async (response) => {
            // Save token and user data on successful login
            const token = response.data?.accessToken;
            const userData = response.data?.user;
            
            if (token && userData) {
                const tokenSaved = await saveToken(token);
                const userDataSaved = await saveUserData(userData);
                
                if (tokenSaved && userDataSaved) {
                    // Only show success toast if data was saved successfully
                    onSuccess('Login successful');
                    // Navigate to dashboard
                    navigateToDashboard();
                }
            } else {
                logger.error('No access token or user data received from login');
                showError('Authentication failed. Please try again.', 'Login Error');
            }
        },
        onError: (error) => {
            onError(error);
            logger.error('Login error:', error);
        }
    });
}

export const useRegister = () => {
    const { onError, onSuccess } = useHandleResponse();
    return useMutation({
        mutationFn: register,
        onSuccess: async (response) => {
            // Save token and user data on successful registration
            const token = response.data?.accessToken;
            const userData = response.data?.user;
            
            if (token && userData) {
                const tokenSaved = await saveToken(token);
                const userDataSaved = await saveUserData(userData);
                
                if (tokenSaved && userDataSaved) {
                    // Only show success toast if data was saved successfully
                    onSuccess('Account created successfully');
                    // Navigate to dashboard
                    navigateToDashboard();
                }
            } else {
                logger.error('No access token or user data received from registration');
                showError('Account created but authentication failed. Please try logging in.', 'Registration Error');
            }
        },
        onError: (error) => {
            onError(error);
            logger.error('Registration error:', error);
        }
    });
}