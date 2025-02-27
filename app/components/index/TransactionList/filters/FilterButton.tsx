import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

interface FilterButtonProps {
  activeFiltersCount: number;
  onPress: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ activeFiltersCount, onPress }) => {
  return (
    <TouchableOpacity style={styles.filterButton} onPress={onPress}>
      <FontAwesome name="filter" size={18} color="#FFF" />
      <ThemedText style={styles.filterButtonText}>Filter</ThemedText>
      {activeFiltersCount > 0 && (
        <View style={styles.filterBadge}>
          <ThemedText style={styles.filterBadgeText}>{activeFiltersCount}</ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginVertical: 10,
    alignSelf: 'flex-end',
  },
  filterButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  filterBadge: {
    backgroundColor: '#3700B3',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  filterBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});