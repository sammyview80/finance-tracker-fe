# Finance Tracker App

A comprehensive mobile application for tracking personal finances, built with React Native and Expo.

## Features

- **Dashboard**: View financial summaries, recent transactions, and budget progress
- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Pagination**: Infinite scrolling with pull-to-refresh for transaction lists
- **Filtering Options**: Filter transactions by date, amount, category, and type
- **Budget Tracking**: Set and monitor budgets for different expense categories
- **Savings Goals**: Track progress towards savings goals
- **Dark Mode Support**: Fully themed UI for both light and dark modes

## Technical Stack

- **React Native with Expo**: For cross-platform mobile development
- **Expo Router**: For navigation between screens
- **React Query**: For server state management and data fetching
- **Zustand**: For client state management
- **Custom Themed UI Components**: For consistent design across the app

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/finance-tracker.git
cd finance-tracker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

## Project Structure

- **app/**: Main application screens and components
  - **(tabs)/**: Tab-based navigation screens
  - **components/**: Reusable UI components
  - **transaction/**: Transaction-related screens
- **services/**: API services and data fetching logic
  - **transaction/**: Transaction-specific API services
  - **dashboard/**: Dashboard data services
  - **auth/**: Authentication services
- **types/**: TypeScript type definitions
- **utils/**: Utility functions and helpers
- **store/**: State management with Zustand
- **config/**: Configuration files

## API Integration

The app integrates with a RESTful API for data management. Key endpoints include:

- **/api/v1/transactions**: For transaction management
- **/api/v1/statistics**: For dashboard data
- **/api/v1/auth**: For authentication

## Recent Updates

### Frontend Updates
- Added pagination support with infinite scrolling
- Implemented pull-to-refresh functionality
- Enhanced error handling with proper error messages
- Updated API client to handle token expiration and rate limiting
- Improved transaction management with detailed transaction views

### Backend Updates
- Added pagination and filtering to transaction endpoints
- Implemented rate limiting to prevent API abuse
- Enhanced error responses with error codes and detailed messages
- Updated transaction controller to support advanced filtering options

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Console Logging in Production

This app uses a custom logger utility to handle console logging in a production-safe manner. The logger automatically disables most console logs in production environments to improve performance and security.

### How it works

The logger utility (`utils/logger.ts`) checks if the app is running in production mode and conditionally logs based on that environment:

```typescript
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
```

### Usage

Instead of using `console.log()`, `console.warn()`, etc. directly, use the corresponding methods from the logger:

```typescript
import logger from '@/utils/logger';

// Instead of console.log()
logger.log('This will only show in development');

// Instead of console.warn()
logger.warn('This warning will only show in development');

// Instead of console.error()
logger.error('This error will show in both development and production');

// Force a log to appear even in production
logger.force('This will always show, even in production');
```

### Environment Configuration

The production environment is determined by:

1. The `NODE_ENV` environment variable being set to 'production'
2. The `isProduction` flag in the Expo config

This is configured in `app.config.js`:

```javascript
const isProduction = IS_PROD || process.env.NODE_ENV === 'production';

module.exports = {
  expo: {
    // ...
    extra: {
      isProduction,
      // ...
    },
  }
};
```

### Benefits

- Improved performance in production by eliminating unnecessary console operations
- Prevents sensitive information from being exposed in browser consoles
- Maintains helpful logging during development
- Errors are still logged in production for debugging critical issues
