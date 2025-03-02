import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  title: string;
}

interface ToastContextType {
  showToast: (title: string, message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
    title: '',
  });
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const showToast = useCallback((title: string, message: string, type: ToastType = 'info', duration: number = 3000) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Update toast state
    setToast({
      visible: true,
      message,
      type,
      title,
    });

    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Set timeout to hide toast
    timeoutRef.current = setTimeout(() => {
      hideToast();
    }, duration);
  }, [fadeAnim]);

  const hideToast = useCallback(() => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setToast(prev => ({ ...prev, visible: false }));
    });
  }, [fadeAnim]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return isDark ? '#0F5132' : '#D1E7DD';
      case 'error':
        return isDark ? '#842029' : '#F8D7DA';
      case 'warning':
        return isDark ? '#664D03' : '#FFF3CD';
      case 'info':
      default:
        return isDark ? '#055160' : '#CFF4FC';
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return isDark ? '#D1E7DD' : '#0F5132';
      case 'error':
        return isDark ? '#F8D7DA' : '#842029';
      case 'warning':
        return isDark ? '#FFF3CD' : '#664D03';
      case 'info':
      default:
        return isDark ? '#CFF4FC' : '#055160';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      
      {toast.visible && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              opacity: fadeAnim,
              backgroundColor: getBackgroundColor(),
              borderColor: getTextColor(),
            },
          ]}
        >
          <View style={styles.toastContent}>
            <View style={styles.textContainer}>
              {toast.title && (
                <Text style={[styles.title, { color: getTextColor() }]}>
                  {toast.title}
                </Text>
              )}
              <Text style={[styles.message, { color: getTextColor() }]}>
                {toast.message}
              </Text>
            </View>
            <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
              <Text style={[styles.closeText, { color: getTextColor() }]}>×</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 9999,
  },
  toastContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 