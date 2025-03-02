const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PROD = process.env.APP_VARIANT === 'production';

// Get the base config from app.json
const baseConfig = require('./app.json');

// Determine if we're in production based on environment variables
// This will be used by our logger utility
const isProduction = IS_PROD || process.env.NODE_ENV === 'production';

// Extend the base config with environment-specific settings
module.exports = {
  ...baseConfig,
  expo: {
    ...baseConfig.expo,
    // Add extra configuration for our app
    extra: {
      isProduction,
      apiUrl: isProduction 
        ? 'https://api.finance-tracker.com' 
        : 'http://192.168.1.81:8001',
    },
    // Set different names for development vs production
    name: isProduction ? 'Finance Tracker' : 'Finance Tracker (Dev)',
    // You can add other environment-specific configurations here
  }
}; 