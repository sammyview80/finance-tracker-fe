import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface TypeSelectorProps {
  selectedType: 'all' | 'income' | 'expense';
  onTypeChange: (type: 'all' | 'income' | 'expense') => void;
}

export const TypeSelector: React.FC<TypeSelectorProps> = ({ selectedType, onTypeChange }) => {
  return (
    <View style={styles.filterSection}>
      <ThemedText style={styles.filterSectionTitle}>Transaction Type</ThemedText>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.filterTypeButton,
            selectedType === 'all' && styles.activeButton,
          ]}
          onPress={() => onTypeChange('all')}
        >
          <ThemedText
            style={[
              styles.filterTypeText,
              selectedType === 'all' && styles.activeButtonText,
            ]}
          >
            All
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTypeButton,
            selectedType === 'income' && styles.activeIncomeButton,
          ]}
          onPress={() => onTypeChange('income')}
        >
          <ThemedText
            style={[
              styles.filterTypeText,
              selectedType === 'income' && styles.activeButtonText,
            ]}
          >
            Income
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTypeButton,
            selectedType === 'expense' && styles.activeExpenseButton,
          ]}
          onPress={() => onTypeChange('expense')}
        >
          <ThemedText
            style={[
              styles.filterTypeText,
              selectedType === 'expense' && styles.activeButtonText,
            ]}
          >
            Expense
          </ThemedText>
        </TouchableOpacity>
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
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterTypeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#444',
  },
  filterTypeText: {
    color: '#CCC',
    fontWeight: '500',
  },
  activeButton: {
    backgroundColor: '#3700B3',
    borderColor: '#3700B3',
  },
  activeIncomeButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  activeExpenseButton: {
    backgroundColor: '#FF5252',
    borderColor: '#FF5252',
  },
  activeButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});