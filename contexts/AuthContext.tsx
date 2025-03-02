import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../services/api';
import { Platform } from 'react-native';

const AUTH_TOKEN_KEY = '@finance_tracker:auth_token';
const USER_DATA_KEY = '@finance_tracker:user_data';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkTokenExists: () => Promise<boolean>;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true
};

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  checkTokenExists: async () => false
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to handle storage operations across platforms
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    // Check if the user is already logged in
    const loadUserFromStorage = async () => {
      try {
        const token = await storage.getItem(AUTH_TOKEN_KEY);
        const userData = await storage.getItem(USER_DATA_KEY);
        
        if (token && userData) {
          setState({
            isAuthenticated: true,
            user: JSON.parse(userData),
            token,
            isLoading: false
          });
        } else {
          setState({
            ...initialState,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Failed to load auth state', error);
        setState({
          ...initialState,
          isLoading: false
        });
      }
    };

    loadUserFromStorage();
  }, []);

  const checkTokenExists = async (): Promise<boolean> => {
    try {
      const token = await storage.getItem(AUTH_TOKEN_KEY);
      return !!token;
    } catch (error) {
      console.error('Error checking token:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.register({ name, email, password });
      
      // Store the authentication data
      await storage.setItem(AUTH_TOKEN_KEY, response.data.token);
      await storage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
      
      // Update state
      setState({
        isAuthenticated: true,
        user: response.data.user,
        token: response.data.token,
        isLoading: false
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      
      // Store the authentication data
      await storage.setItem(AUTH_TOKEN_KEY, response.data.token);
      await storage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
      
      // Update state
      setState({
        isAuthenticated: true,
        user: response.data.user,
        token: response.data.token,
        isLoading: false
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear stored data
      await storage.removeItem(AUTH_TOKEN_KEY);
      await storage.removeItem(USER_DATA_KEY);
      
      // Reset state
      setState({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        checkTokenExists
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};