import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { styles } from '../styles';

interface SubmitButtonProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  onSubmit,
  isSubmitting
}) => {
  return (
    <TouchableOpacity 
      style={[styles.button, isSubmitting && styles.buttonDisabled]} 
      onPress={onSubmit}
      disabled={isSubmitting}
      accessibilityRole="button"
      accessibilityLabel={isSubmitting ? 'Saving transaction' : 'Save transaction'}
      accessibilityState={{ disabled: isSubmitting }}
    >
      <ThemedText style={styles.buttonText}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </ThemedText>
    </TouchableOpacity>
  );
};