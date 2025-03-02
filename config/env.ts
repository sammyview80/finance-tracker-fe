import { Platform } from 'react-native';

// Get the development machine's IP address for mobile development
// Replace this with your actual machine's IP address when testing on physical devices
const DEV_MACHINE_IP = '192.168.1.117'; // CHANGE THIS to your computer's IP address

// API base URL from documentation
const API_BASE_URL = 'http://localhost:8001';
const MOBILE_API_BASE_URL = Platform.OS === 'web' ? API_BASE_URL : `http://${DEV_MACHINE_IP}:8001`;

export const ENV = {
  development: {
    // For web, use localhost
    // For mobile, use the dev machine IP
    API_URL: Platform.OS === 'web' ? API_BASE_URL : MOBILE_API_BASE_URL,
    AUTH_API_URL: Platform.OS === 'web' ? API_BASE_URL : MOBILE_API_BASE_URL,
  },
  staging: {
    API_URL: API_BASE_URL,
    AUTH_API_URL: API_BASE_URL,
  },
  production: {
    API_URL: API_BASE_URL,
    AUTH_API_URL: API_BASE_URL,
  },
};

const getEnvironment = () => {
  if (__DEV__) return 'development';
  // You can add more environment detection logic here
  return 'production';
};

export const getConfig = () => {
  const env = getEnvironment();
  return ENV[env];
};