import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production' || 
  Constants.expoConfig?.extra?.isProduction === true;

// Create a logger object that conditionally logs based on environment
const logger = {
  log: (...args: any[]): void => {
    if (!isProduction) {
      console.log(...args);
    }
  },
  
  warn: (...args: any[]): void => {
    if (!isProduction) {
      console.warn(...args);
    }
  },
  
  error: (...args: any[]): void => {
    // Always log errors, even in production
    console.error(...args);
  },
  
  info: (...args: any[]): void => {
    if (!isProduction) {
      console.info(...args);
    }
  },
  
  debug: (...args: any[]): void => {
    if (!isProduction) {
      console.debug(...args);
    }
  },
  
  // Force logging even in production (use sparingly)
  force: (...args: any[]): void => {
    console.log(...args);
  }
};

export default logger; 