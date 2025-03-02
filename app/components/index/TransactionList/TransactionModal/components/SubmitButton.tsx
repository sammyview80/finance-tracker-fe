import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { styles } from '../styles';

interface SubmitButtonProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  label?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  onSubmit,
  isSubmitting,
  label = 'Save'
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        buttonStyles.button,
        isSubmitting && styles.buttonDisabled
      ]} 
      onPress={onSubmit}
      disabled={isSubmitting}
      accessibilityRole="button"
      accessibilityLabel={isSubmitting ? `${label}ing transaction` : `${label} transaction`}
      accessibilityState={{ disabled: isSubmitting }}
    >
      {isSubmitting ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <ThemedText style={[styles.buttonText, buttonStyles.buttonText]}>
          {label}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};

const buttonStyles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  }
});

export default SubmitButton;