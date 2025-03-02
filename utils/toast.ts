import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
  position?: 'top' | 'bottom';
}

/**
 * Show a toast notification
 * @param options Toast options
 */
export const showToast = ({
  title,
  message,
  type = 'info',
  duration,
  position = 'bottom'
}: ToastOptions) => {
  const defaultTitles = {
    success: 'Success',
    error: 'Error',
    info: 'Information'
  };

  Toast.show({
    type,
    text1: title || defaultTitles[type],
    text2: message,
    position,
    visibilityTime: duration || (type === 'error' ? 4000 : 3000),
  });
};

/**
 * Show a success toast
 * @param message The message to display
 * @param title Optional title (defaults to "Success")
 */
export const showSuccess = (message: string, title?: string) => {
  showToast({
    title,
    message,
    type: 'success'
  });
};

/**
 * Show an error toast
 * @param message The error message to display
 * @param title Optional title (defaults to "Error")
 */
export const showError = (message: string, title?: string) => {
  showToast({
    title,
    message,
    type: 'error'
  });
};

/**
 * Show an info toast
 * @param message The info message to display
 * @param title Optional title (defaults to "Information")
 */
export const showInfo = (message: string, title?: string) => {
  showToast({
    title,
    message,
    type: 'info'
  });
};

/**
 * Handle API error and show appropriate toast
 * @param error The error object from API
 */
export const handleApiError = (error: any) => {
  let message = 'An unexpected error occurred';
  let title = 'Error';

  // Handle different error formats
  if (error?.response?.data?.error) {
    const errorData = error.response.data.error;
    
    if (typeof errorData === 'object' && errorData !== null) {
      // If error is an object with message and title properties
      if ('message' in errorData && typeof errorData.message === 'string') {
        message = errorData.message;
      }
      if ('title' in errorData && typeof errorData.title === 'string') {
        title = errorData.title;
      }
      // If error has a code, add it to the title
      if ('code' in errorData && (typeof errorData.code === 'string' || typeof errorData.code === 'number')) {
        title = `${title} (${errorData.code})`;
      }
    } else if (typeof errorData === 'string') {
      message = errorData;
    } else if (Array.isArray(errorData)) {
      message = errorData.join(', ');
    }
  } else if (error?.response?.status) {
    // Handle HTTP status codes
    const status = error.response.status;
    
    if (status === 401) {
      title = 'Authentication Error';
      message = 'Your session has expired. Please log in again.';
    } else if (status === 403) {
      title = 'Access Denied';
      message = 'You do not have permission to perform this action.';
    } else if (status === 404) {
      title = 'Not Found';
      message = 'The requested resource was not found.';
    } else if (status === 500) {
      title = 'Server Error';
      message = 'An unexpected error occurred on the server.';
    }
  } else if (error?.message) {
    message = error.message;
  }

  showToast({
    title,
    message,
    type: 'error',
    duration: 4000
  });
}; 