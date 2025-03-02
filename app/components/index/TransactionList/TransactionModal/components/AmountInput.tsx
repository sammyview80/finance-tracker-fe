import React from 'react';
import { TextInput, View, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { styles } from '../styles';

// Common amount suggestions
const AMOUNT_SUGGESTIONS = ['500', '1000', '2000', '5000', '10000'];

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
        selectionColor="#4CAF50"
      />
      {error && (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      )}
      
      {/* Amount suggestions */}
      <View style={amountStyles.suggestionsGrid}>
        {AMOUNT_SUGGESTIONS.map((suggestion) => (
          <Pressable
            key={suggestion}
            style={[
              amountStyles.suggestionChip,
              value === suggestion && amountStyles.activeSuggestion
            ]}
            onPress={() => onChange(suggestion)}
          >
            <ThemedText style={amountStyles.suggestionText}>₹{suggestion}</ThemedText>
          </Pressable>
        ))}
      </View>
    </>
  );
};

export default AmountInput;

const amountStyles = StyleSheet.create({
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10,
  },
  suggestionChip: {
    backgroundColor: '#2C2C2C',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#444',
    minWidth: '18%',
    alignItems: 'center',
  },
  activeSuggestion: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  suggestionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
});