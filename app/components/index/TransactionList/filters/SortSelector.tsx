import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface SortSelectorProps {
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
  onSortByChange: (sortBy: 'date' | 'amount') => void;
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
}

export const SortSelector: React.FC<SortSelectorProps> = ({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}) => {
  return (
    <>
      <View style={styles.filterSection}>
        <ThemedText style={styles.filterSectionTitle}>Sort By</ThemedText>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.filterTypeButton,
              sortBy === 'date' && styles.activeButton,
            ]}
            onPress={() => onSortByChange('date')}
          >
            <ThemedText
              style={[
                styles.filterTypeText,
                sortBy === 'date' && styles.activeButtonText,
              ]}
            >
              Date
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTypeButton,
              sortBy === 'amount' && styles.activeButton,
            ]}
            onPress={() => onSortByChange('amount')}
          >
            <ThemedText
              style={[
                styles.filterTypeText,
                sortBy === 'amount' && styles.activeButtonText,
              ]}
            >
              Amount
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterSection}>
        <ThemedText style={styles.filterSectionTitle}>Sort Order</ThemedText>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.filterTypeButton,
              sortOrder === 'desc' && styles.activeButton,
            ]}
            onPress={() => onSortOrderChange('desc')}
          >
            <ThemedText
              style={[
                styles.filterTypeText,
                sortOrder === 'desc' && styles.activeButtonText,
              ]}
            >
              High to Low
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTypeButton,
              sortOrder === 'asc' && styles.activeButton,
            ]}
            onPress={() => onSortOrderChange('asc')}
          >
            <ThemedText
              style={[
                styles.filterTypeText,
                sortOrder === 'asc' && styles.activeButtonText,
              ]}
            >
              Low to High
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </>
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
  activeButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});