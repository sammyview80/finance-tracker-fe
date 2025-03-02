import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
  success: ({ text1, text2, props, ...rest }) => {
    const { currentTheme } = useTheme();
    const isDark = currentTheme === 'dark';
    
    return (
      <View 
        style={[
          styles.container, 
          styles.successContainer,
          isDark ? styles.darkContainer : styles.lightContainer,
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons 
            name="checkmark-circle" 
            size={24} 
            color={isDark ? '#4ADE80' : '#22C55E'} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
            {text1}
          </Text>
          {text2 ? (
            <Text style={[styles.message, isDark ? styles.darkSubtext : styles.lightSubtext]}>
              {text2}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => Toast.hide()}
        >
          <Ionicons 
            name="close" 
            size={20} 
            color={isDark ? Colors.dark.icon : Colors.light.icon} 
          />
        </TouchableOpacity>
      </View>
    );
  },
  
  error: ({ text1, text2, props, ...rest }) => {
    const { currentTheme } = useTheme();
    const isDark = currentTheme === 'dark';
    
    return (
      <View 
        style={[
          styles.container, 
          styles.errorContainer,
          isDark ? styles.darkContainer : styles.lightContainer,
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons 
            name="alert-circle" 
            size={24} 
            color={isDark ? '#F87171' : '#EF4444'} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
            {text1}
          </Text>
          {text2 ? (
            <Text style={[styles.message, isDark ? styles.darkSubtext : styles.lightSubtext]}>
              {text2}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => Toast.hide()}
        >
          <Ionicons 
            name="close" 
            size={20} 
            color={isDark ? Colors.dark.icon : Colors.light.icon} 
          />
        </TouchableOpacity>
      </View>
    );
  },
  
  info: ({ text1, text2, props, ...rest }) => {
    const { currentTheme } = useTheme();
    const isDark = currentTheme === 'dark';
    
    return (
      <View 
        style={[
          styles.container, 
          styles.infoContainer,
          isDark ? styles.darkContainer : styles.lightContainer,
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons 
            name="information-circle" 
            size={24} 
            color={isDark ? '#60A5FA' : '#3B82F6'} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
            {text1}
          </Text>
          {text2 ? (
            <Text style={[styles.message, isDark ? styles.darkSubtext : styles.lightSubtext]}>
              {text2}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => Toast.hide()}
        >
          <Ionicons 
            name="close" 
            size={20} 
            color={isDark ? Colors.dark.icon : Colors.light.icon} 
          />
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 500,
    alignSelf: 'center',
    width: '90%',
  },
  darkContainer: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  successContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  errorContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  infoContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
  },
  darkText: {
    color: '#F9FAFB',
  },
  lightText: {
    color: '#111827',
  },
  darkSubtext: {
    color: '#D1D5DB',
  },
  lightSubtext: {
    color: '#4B5563',
  },
  closeButton: {
    padding: 4,
  },
});

export default toastConfig; 