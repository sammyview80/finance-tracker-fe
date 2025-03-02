import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getConfig } from '../config/env';
import { IAPIResponse, IErrorResponse } from './interface';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import logger from '../utils/logger';
import { showError } from '@/utils/toast';

const AUTH_TOKEN_KEY = '@finance_tracker:auth_token';
const REFRESH_TOKEN_KEY = '@finance_tracker:refresh_token';
// Exponential backoff for rate limiting
const RETRY_DELAYS = [1000, 2000, 5000, 10000, 30000]; // Retry delays in milliseconds

interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

interface ApiErrorResponse {
  message?: string;
  code?: string;
  status?: number;
  error?: {
    code?: string;
    message?: string;
  };
}

class ApiClient {
  private instance: AxiosInstance;
  private refreshPromise: Promise<string | null> | null = null;
  private config = getConfig();

  constructor() {
    // Configure axios with platform-specific settings
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        // Add Accept header for better compatibility
        'Accept': 'application/json',
      },
      baseURL: this.config.API_URL,
      timeout: 15000, // Increased timeout to 15 seconds
    };

    // Add mobile-specific configurations
    if (Platform.OS !== 'web') {
      // Disable SSL certificate validation in development (not recommended for production)
      if (__DEV__) {
        // @ts-ignore - validateStatus is a valid config option
        axiosConfig.validateStatus = () => true;
      }
    }

    this.instance = axios.create(axiosConfig);
    this.setupInterceptors();
    
    // Log the API URL being used
    logger.log(`API Client initialized with URL: ${this.config.API_URL}`);
    logger.log(`Platform: ${Platform.OS}`);
  }

  private setupInterceptors() {
    // Request interceptor for API calls
    this.instance.interceptors.request.use(
      async (config) => {
        // Check network connectivity before making request
        // Only check on mobile platforms
        if (Platform.OS !== 'web') {
          const netInfo = await NetInfo.fetch();
          if (!netInfo.isConnected) {
            return Promise.reject(new Error('No internet connection. Please check your network settings.'));
          }
        }

        // Set the appropriate base URL based on the request path
        if (config.url?.startsWith('/auth/')) {
          config.baseURL = this.config.AUTH_API_URL;
        } else {
          config.baseURL = this.config.API_URL;
        }

        // Add auth token for non-auth requests or auth refresh requests
        const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log outgoing requests in development
        if (__DEV__) {
          logger.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        }
        
        return config;
      },
      (error) => {
        logger.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for API calls
    this.instance.interceptors.response.use(
      (response) => {
        // Log successful responses in development
        if (__DEV__) {
          logger.log(`API Response: ${response.status} for ${response.config.url}`);
        }
        
        // Check if the response contains an error with unauthorized status
        // This handles cases where the API returns a 200 OK but with an error object indicating unauthorized
        if (response.data && !response.data.success && response.data.error) {
          const errorCode = response.data.error.code;
          const errorMessage = response.data.error.message || '';
          
          // Check for unauthorized error codes or messages
          const isAuthError = 
            (typeof errorCode === 'string' && errorCode === '401') || 
            (typeof errorCode === 'number' && errorCode === 401) ||
            (errorMessage && (
              errorMessage.toLowerCase().includes('unauthorized') || 
              errorMessage.toLowerCase().includes('invalid user') ||
              errorMessage.toLowerCase().includes('token expired')
            ));
            
          if (isAuthError && !response.config.url?.includes('/auth/')) {
            logger.log('Authentication error detected in successful response. Redirecting to login...');
            
            // Show error message to user
            showError('Your session has expired. Please log in again.', 'Authentication Error');
            
            // Use the centralized logout and redirect function
            this.logoutAndRedirect();
            
            // Create a rejected promise with auth error
            return Promise.reject({
              message: 'Authentication failed. Please log in again.',
              code: '401',
            });
          }
        }
        
        return response;
      },
      async (error: AxiosError<ApiErrorResponse>) => {
        
        console.log('error', error);
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean; retryCount?: number; headers: any };

        // Log detailed error information in development
        if (__DEV__) {
          logger.log(`API Error for ${originalRequest.url}:`, error.message);
          if (error.response) {
            logger.log('Status:', error.response.status);
            logger.log('Data:', error.response.data);
          }
        }

        // Explicitly check for 401 status code first
        if (error.response && error.response.status === 401) {
          logger.log('401 Unauthorized response detected in interceptor');
          
          // Only handle if not an auth request
          if (!originalRequest.url?.includes('/auth/')) {
            logger.log('Non-auth request received 401. Logging out user...');
            
            // Show error message to user
            showError('Your session has expired. Please log in again.', 'Authentication Error');
            
            // Use the centralized logout and redirect function
            this.logoutAndRedirect();
            
            return Promise.reject({
              message: 'Authentication failed. Please log in again.',
              code: '401',
            });
          }
        }

        // Handle network errors specifically
        if (error.message === 'Network Error') {
          logger.log('Network error detected. Checking connectivity...');
          
          // On mobile, check network connectivity
          if (Platform.OS !== 'web') {
            const netInfo = await NetInfo.fetch();
            if (!netInfo.isConnected) {
              return Promise.reject({
                message: 'No internet connection. Please check your network settings.',
                code: 'NETWORK_DISCONNECTED',
              });
            } else {
              logger.log('Network is connected but still getting Network Error. Possible API server issue.');
              // If connected but still getting network error, it might be an API server issue
              return Promise.reject({
                message: 'Unable to reach the server. Please check that your API server is running and accessible.',
                code: 'SERVER_UNREACHABLE',
              });
            }
          } else {
            // On web, it could be a CORS issue
            logger.log('Network error on web. Possible CORS or server issue.');
            return Promise.reject({
              message: 'Unable to connect to the server. This might be due to CORS settings or the server being unavailable.',
              code: 'SERVER_UNREACHABLE',
            });
          }
        }

        // Check for specific error codes from the API
        const errorCode = error.response?.data?.error?.code;
        const status = error.response?.status;
        
        logger.log('errorCode', errorCode);
        logger.log('status', status)
        // Handle token expiration
        if (errorCode === 'TOKEN_EXPIRED' && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh the token
            const newToken = await this.refreshToken();
            if (newToken) {
              // Update the Authorization header with new token
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              // Retry the original request
              return this.instance.request(originalRequest);
            }
          } catch (refreshError) {
            // If refresh fails, clear token and reject
            await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
            await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
            return Promise.reject(refreshError);
          }
        }
        
        // Handle rate limiting with exponential backoff
        if (errorCode === 'RATE_LIMIT_EXCEEDED' && (!originalRequest.retryCount || originalRequest.retryCount < RETRY_DELAYS.length)) {
          originalRequest.retryCount = (originalRequest.retryCount || 0) + 1;
          const delay = RETRY_DELAYS[originalRequest.retryCount - 1];
          
          logger.log(`Rate limit exceeded. Retrying in ${delay}ms (attempt ${originalRequest.retryCount})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.instance.request(originalRequest);
        }

        // Implement retry logic for 5xx errors
        if (status && status >= 500 && (!originalRequest.retryCount || originalRequest.retryCount < RETRY_DELAYS.length)) {
          originalRequest.retryCount = (originalRequest.retryCount || 0) + 1;
          const delay = RETRY_DELAYS[originalRequest.retryCount - 1];
          
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.instance.request(originalRequest);
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private async refreshToken(): Promise<string | null> {
    // Implement singleton pattern for refresh token to prevent multiple refresh attempts
    if (!this.refreshPromise) {
      this.refreshPromise = (async () => {
        try {
          const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
          if (!refreshToken) return null;

          const response = await this.instance.post<IAPIResponse<{ token: string; refreshToken: string }>>(
            '/auth/refresh', 
            { refreshToken },
            { 
              baseURL: this.config.AUTH_API_URL,
              timeout: 10000 // Specific timeout for token refresh
            }
          );
          
          if (response.data.success && response.data.data) {
            const { token, refreshToken: newRefreshToken } = response.data.data;
            
            if (token) {
              await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
              if (newRefreshToken) {
                await AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
              }
              return token;
            }
          }
          return null;
        } catch (error) {
          logger.error('Token refresh failed:', error);
          return null;
        } finally {
          this.refreshPromise = null;
        }
      })();
    }
    return this.refreshPromise;
  }

  private handleError(error: AxiosError<ApiErrorResponse>): ApiError {
    logger.error('API Error type:', error.name);
    logger.error('API Error message:', error.message);

    // Check for 401 Unauthorized responses first
    if (error.response && error.response.status === 401) {
      logger.log('401 Unauthorized error detected in handleError. Logging out user...');
      
      // Show error message to user
      showError('Your session has expired. Please log in again.', 'Authentication Error');
      
      // Use the centralized logout and redirect function
      this.logoutAndRedirect();
      
      return {
        message: 'Authentication failed. Please log in again.',
        code: '401',
      };
    }

    // Mobile-specific error handling
    if (Platform.OS !== 'web' && error.message === 'Network Error') {
      return {
        message: 'Network connection issue. Please check your internet connection and ensure the server is accessible from your device.',
        code: 'MOBILE_NETWORK_ERROR',
      };
    } else if (error.message === 'Network Error') {
      return {
        message: 'Network connection issue. Please check your internet connection and try again.',
        code: 'NETWORK_ERROR',
      };
    } else if (error.code === 'ECONNABORTED') {
      return {
        message: 'Request timed out. The server is taking too long to respond.',
        code: 'TIMEOUT_ERROR',
      };
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      logger.error('Error response data:', error.response.data);
      logger.error('Error response status:', error.response.status);

      // Check for specific error codes from the API
      if (error.response.data?.error?.code) {
        return {
          message: error.response.data.error.message || 'An error occurred',
          status: error.response.status,
          code: error.response.data.error.code,
        };
      }

      return {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        code: error.response.data?.code,
      };
    } else if (error.request) {
      // The request was made but no response was received
      logger.error('No response received. Request details:', error.request);

      // Different message for mobile
      if (Platform.OS !== 'web') {
        return {
          message: 'No response from server. Please check that your API server is running and accessible from your mobile device.',
          code: 'MOBILE_REQUEST_FAILED',
        };
      }

      return {
        message: 'No response received from server. Check if API is running and network connectivity.',
        code: 'NETWORK_ERROR',
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      };
    }
  }

  // Generic request methods with standardized response handling
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<IAPIResponse<T>> {
    try {
      const response = await this.instance.get<IAPIResponse<T>>(url, config);
      
      // Additional check for unauthorized errors in the response data
      if (response.data && !response.data.success && response.data.error) {
        this.checkForAuthError(response.data.error, url);
      }
      
      return response.data;
    } catch (error: any) {
      // Check if this is already a handled error
      if (error && error.code === '401' && error.message) {
        return {
          success: false,
          error: {
            code: '401',
            message: error.message
          }
        } as IAPIResponse<T>;
      }
      
      throw this.handleError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<IAPIResponse<T>> {
    try {
      const response = await this.instance.post<IAPIResponse<T>>(url, data, config);
      
      // Additional check for unauthorized errors in the response data
      if (response.data && !response.data.success && response.data.error) {
        this.checkForAuthError(response.data.error, url);
      }
      
      return response.data;
    } catch (error: any) {
      // Check if this is already a handled error
      if (error && error.code === '401' && error.message) {
        return {
          success: false,
          error: {
            code: '401',
            message: error.message
          }
        } as IAPIResponse<T>;
      }
      
      throw this.handleError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<IAPIResponse<T>> {
    try {
      const response = await this.instance.put<IAPIResponse<T>>(url, data, config);
      
      // Additional check for unauthorized errors in the response data
      if (response.data && !response.data.success && response.data.error) {
        this.checkForAuthError(response.data.error, url);
      }
      
      return response.data;
    } catch (error: any) {
      // Check if this is already a handled error
      if (error && error.code === '401' && error.message) {
        return {
          success: false,
          error: {
            code: '401',
            message: error.message
          }
        } as IAPIResponse<T>;
      }
      
      throw this.handleError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<IAPIResponse<T>> {
    try {
      const response = await this.instance.delete<IAPIResponse<T>>(url, config);
      
      // Additional check for unauthorized errors in the response data
      if (response.data && !response.data.success && response.data.error) {
        this.checkForAuthError(response.data.error, url);
      }
      
      return response.data;
    } catch (error: any) {
      // Check if this is already a handled error
      if (error && error.code === '401' && error.message) {
        return {
          success: false,
          error: {
            code: '401',
            message: error.message
          }
        } as IAPIResponse<T>;
      }
      
      throw this.handleError(error as AxiosError<ApiErrorResponse>);
    }
  }

  // Helper method to check for auth errors
  private checkForAuthError(error: any, url?: string): void {
    if (!url?.includes('/auth/')) {
      const errorCode = error.code;
      const errorMessage = error.message || '';
      
      // Check for unauthorized error codes or messages
      const isAuthError = 
        (typeof errorCode === 'string' && errorCode === '401') || 
        (typeof errorCode === 'number' && errorCode === 401) ||
        (errorMessage && (
          errorMessage.toLowerCase().includes('unauthorized') || 
          errorMessage.toLowerCase().includes('invalid user') ||
          errorMessage.toLowerCase().includes('token expired')
        ));
        
      if (isAuthError) {
        logger.log('Authentication error detected in response. Redirecting to login...');
        
        // Show error message to user
        showError('Your session has expired. Please log in again.', 'Authentication Error');
        
        // Clear auth tokens and redirect to login
        this.logoutAndRedirect();
      }
    }
  }
  
  // Centralized logout and redirect function
  private logoutAndRedirect(): void {
    // Clear auth tokens
    (async () => {
      try {
        logger.log('Clearing auth tokens...');
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
        await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
        
        logger.log('Redirecting to login page...');
        // Use a longer timeout to ensure the toast is visible before navigation
        setTimeout(() => {
          try {
            // Force navigation to the root route
            if (router && router.replace) {
              logger.log('Using Expo Router for navigation');
              router.replace('/');
              logger.log('Navigation completed via router.replace');
            } else {
              logger.error('Router object is not available, trying alternative navigation');
              
              // Try Expo Linking as first fallback
              try {
                logger.log('Attempting navigation via Expo Linking');
                const url = Linking.createURL('/');
                Linking.openURL(url);
                logger.log('Navigation completed via Linking.openURL');
                return;
              } catch (linkingError) {
                logger.error('Expo Linking navigation failed:', linkingError);
              }
              
              // Try window.location as second fallback (web only)
              if (Platform.OS === 'web' && global.window && global.window.location) {
                logger.log('Using window.location for navigation');
                global.window.location.href = '/';
                logger.log('Navigation completed via window.location');
              } else {
                logger.error('No navigation method available');
              }
            }
          } catch (navError) {
            logger.error('Primary navigation error:', navError);
            
            // Try alternative navigation as fallback
            try {
              logger.log('Attempting fallback navigation via Expo Linking');
              const url = Linking.createURL('/');
              Linking.openURL(url);
              logger.log('Fallback navigation completed via Linking.openURL');
            } catch (fallbackError) {
              logger.error('All navigation methods failed:', fallbackError);
              
              // Last resort for web
              if (Platform.OS === 'web' && global.window && global.window.location) {
                logger.log('Last resort: Using window.location');
                global.window.location.href = '/';
              }
            }
          }
        }, 1000); // Increased timeout for more reliability
      } catch (error) {
        logger.error('Error during logout process:', error);
      }
    })();
  }

  // Auth specific methods
  async authPost<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<IAPIResponse<T>> {
    try {
      // Ensure the URL starts with /auth/
      const authUrl = url.startsWith('/auth/') ? url : `/auth${url}`;
      const response = await this.instance.post<IAPIResponse<T>>(authUrl, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ApiErrorResponse>);
    }
  }
}

export const apiClient = new ApiClient();