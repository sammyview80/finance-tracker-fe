import { useCallback } from 'react';
import { AxiosError } from 'axios';
import logger from '@/utils/logger';
import { showSuccess, handleApiError } from '@/utils/toast';

const useHandleResponse = () => {
  const onSuccess = useCallback((message: string) => {
    showSuccess(message);
  }, []);

  const onError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      logger.error('Error message:', error.message);
    }
    
    logger.error('Error details:', JSON.stringify(error, null, 2));
    
    handleApiError(error);
  }, []);

  return { onSuccess, onError };
};

export { useHandleResponse };

export const extractErrorMessage = (msg?: string | Array<string> | any) => {
  if (Array.isArray(msg)) {
    return msg?.join(', ');
  }

  if (typeof msg === 'string') {
    return msg;
  }

  if (typeof msg === 'object' && msg !== null && 'message' in msg) {
    return msg.message;
  }

  return 'Network Error';
};

const isCustomError = (
  obj: unknown
): obj is AxiosError<{
  error: string | Array<string> | { 
    message?: string;
    title?: string;
    code?: string | number;
    [key: string]: any;
  };
  status: number;
}> => {
  if (obj instanceof AxiosError) {
    return (
      typeof obj.response?.data?.error === 'string' ||
      Array.isArray(obj.response?.data?.error) ||
      typeof obj.response?.data?.error === 'object'
    );
  } else {
    return false;
  }
};

export { isCustomError };
