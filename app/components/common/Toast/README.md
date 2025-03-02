# Toast Component

A modern, aesthetic toast notification system that supports both dark and light themes and displays errors based on API responses.

## Features

- Modern, aesthetic design with smooth animations
- Dark and light theme support (automatically follows system theme)
- Different toast types (success, error, info)
- Customizable duration and position
- Handles API error responses intelligently
- Close button for dismissing toasts manually

## Usage

### Basic Usage

```typescript
import { showToast, showSuccess, showError, showInfo } from '@/utils/toast';

// Show a success toast
showSuccess('Your changes have been saved');

// Show an error toast
showError('Failed to save changes');

// Show an info toast
showInfo('New version available');

// Show a custom toast
showToast({
  title: 'Custom Title',
  message: 'Custom message',
  type: 'success', // 'success' | 'error' | 'info'
  duration: 5000, // milliseconds
  position: 'top', // 'top' | 'bottom'
});
```

### Handling API Errors

```typescript
import { handleApiError } from '@/utils/toast';

try {
  // API call
  const response = await api.post('/endpoint', data);
  // Handle success
} catch (error) {
  // This will automatically extract error messages from the API response
  handleApiError(error);
}
```

## Implementation Details

The toast system consists of:

1. **ToastConfig.tsx** - Custom toast components for different toast types
2. **index.tsx** - Toast provider component that wraps the app
3. **utils/toast.ts** - Utility functions for showing toasts and handling errors

The toast system automatically adapts to the app's theme (dark/light) and displays appropriate colors and styles.

## Error Handling

The toast system can handle various error formats:

- String errors: `{ error: "Error message" }`
- Array errors: `{ error: ["Error 1", "Error 2"] }`
- Object errors: `{ error: { message: "Error message", code: 400 } }`
- HTTP status codes: Provides friendly messages for common status codes (401, 403, 404, 500) 