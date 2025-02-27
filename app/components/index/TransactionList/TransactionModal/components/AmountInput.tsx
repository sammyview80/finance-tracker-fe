import React from 'react';
import { TextInput, ScrollView, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { styles } from '../styles';

// Common amount suggestions
const AMOUNT_SUGGESTIONS = ['500', '1000', '2000', '5000', '10000', '20000'];

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  error
}) => {
  return (
    <>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholder="Enter amount"
        placeholderTextColor="#666"
      />
      {error && (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      )}
      
      {/* Amount suggestions */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
        {AMOUNT_SUGGESTIONS.map((suggestion) => (
          <Pressable
            key={suggestion}
            style={[
              styles.suggestionChip,
              value === suggestion && styles.activeSuggestion
            ]}
            onPress={() => onChange(suggestion)}
          >
            <ThemedText style={styles.suggestionText}>₹{suggestion}</ThemedText>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
};