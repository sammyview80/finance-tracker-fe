import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface AmountRangeSelectorProps {
  minAmount: string;
  maxAmount: string;
  onMinAmountChange: (value: string) => void;
  onMaxAmountChange: (value: string) => void;
}

export const AmountRangeSelector: React.FC<AmountRangeSelectorProps> = ({
  minAmount,
  maxAmount,
  onMinAmountChange,
  onMaxAmountChange,
}) => {
  return (
    <View style={styles.filterSection}>
      <ThemedText style={styles.filterSectionTitle}>Amount Range</ThemedText>
      <View style={styles.amountRangeContainer}>
        <View style={styles.amountInputContainer}>
          <ThemedText style={styles.amountInputLabel}>Min</ThemedText>
          <View style={[
            styles.amountInput,
            minAmount && minAmount.trim() !== '' && styles.activeAmountInput
          ]}>
            <ThemedText style={[
              styles.currencySymbol,
              minAmount && minAmount.trim() !== '' && styles.activeCurrencySymbol
            ]}>₹</ThemedText>
            <TextInput
              style={styles.amountInputField}
              value={minAmount}
              onChangeText={onMinAmountChange}
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
          </View>
        </View>

        <View style={styles.amountInputContainer}>
          <ThemedText style={styles.amountInputLabel}>Max</ThemedText>
          <View style={[
            styles.amountInput,
            maxAmount && maxAmount.trim() !== '' && styles.activeAmountInput
          ]}>
            <ThemedText style={[
              styles.currencySymbol,
              maxAmount && maxAmount.trim() !== '' && styles.activeCurrencySymbol
            ]}>₹</ThemedText>
            <TextInput
              style={styles.amountInputField}
              value={maxAmount}
              onChangeText={onMaxAmountChange}
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: '#CCC',
  },
  amountRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountInputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  amountInputLabel: {
    fontSize: 14,
    color: '#AAA',
    marginBottom: 6,
  },
  amountInput: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  activeAmountInput: {
    backgroundColor: '#3700B3',
    borderColor: '#3700B3',
  },
  currencySymbol: {
    fontSize: 16,
    color: '#CCC',
    marginRight: 4,
  },
  activeCurrencySymbol: {
    color: '#FFF',
  },
  amountInputField: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#FFF',
  },
});