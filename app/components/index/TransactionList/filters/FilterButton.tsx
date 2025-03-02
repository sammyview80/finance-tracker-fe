import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

interface FilterButtonProps {
  activeFiltersCount: number;
  onPress: () => void;
  isHeaderButton?: boolean;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ 
  activeFiltersCount, 
  onPress,
  isHeaderButton = false 
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  if (isHeaderButton) {
    return (
      <TouchableOpacity 
        style={styles.headerButton} 
        onPress={onPress}
      >
        <Ionicons 
          name="filter" 
          size={22} 
          color={isDark ? '#FFFFFF' : '#333333'} 
        />
        {activeFiltersCount > 0 && (
          <View style={[
            styles.headerBadge,
            { backgroundColor: Colors[isDark ? 'dark' : 'light'].tint }
          ]}>
            <ThemedText style={styles.badgeText}>{activeFiltersCount}</ThemedText>
          </View>
        )}
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity 
      style={[
        styles.filterButton, 
        { backgroundColor: isDark ? '#2C2C2C' : '#F0F0F0' }
      ]} 
      onPress={onPress}
    >
      <Ionicons 
        name="filter" 
        size={18} 
        color={isDark ? '#FFFFFF' : '#333333'} 
      />
      <ThemedText style={styles.filterButtonText}>Filter</ThemedText>
      {activeFiltersCount > 0 && (
        <View style={[
          styles.filterBadge,
          { backgroundColor: Colors[isDark ? 'dark' : 'light'].tint }
        ]}>
          <ThemedText style={styles.badgeText}>{activeFiltersCount}</ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  headerButton: {
    padding: 8,
    marginRight: 16,
  },
  headerBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});