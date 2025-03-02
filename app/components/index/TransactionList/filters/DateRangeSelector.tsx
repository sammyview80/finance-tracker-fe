import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { DynamicDatePicker } from '@/app/components/common/DynamicDatePicker';

interface DateRangeSelectorProps {
  fromDate: Date | null;
  toDate: Date | null;
  showFromDatePicker: boolean;
  showToDatePicker: boolean;
  onFromDatePress: () => void;
  onToDatePress: () => void;
  onFromDateChange: (event: any, selectedDate?: Date) => void;
  onToDateChange: (event: any, selectedDate?: Date) => void;
  onClearFromDate: () => void;
  onClearToDate: () => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  fromDate,
  toDate,
  showFromDatePicker,
  showToDatePicker,
  onFromDatePress,
  onToDatePress,
  onFromDateChange,
  onToDateChange,
  onClearFromDate,
  onClearToDate
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Select Date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Date Range</ThemedText>
      
      <View style={styles.dateContainer}>
        <View style={styles.dateField}>
          <ThemedText style={styles.dateLabel}>From</ThemedText>
          <View style={styles.dateInputContainer}>
            <TouchableOpacity 
              style={[styles.dateInput, isDark ? styles.dateInputDark : styles.dateInputLight]} 
              onPress={onFromDatePress}
            >
              <ThemedText style={styles.dateText}>{formatDate(fromDate)}</ThemedText>
            </TouchableOpacity>
            {fromDate && (
              <TouchableOpacity style={styles.clearButton} onPress={onClearFromDate}>
                <Ionicons name="close-circle" size={18} color={isDark ? "#999" : "#666"} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.dateField}>
          <ThemedText style={styles.dateLabel}>To</ThemedText>
          <View style={styles.dateInputContainer}>
            <TouchableOpacity 
              style={[styles.dateInput, isDark ? styles.dateInputDark : styles.dateInputLight]} 
              onPress={onToDatePress}
            >
              <ThemedText style={styles.dateText}>{formatDate(toDate)}</ThemedText>
            </TouchableOpacity>
            {toDate && (
              <TouchableOpacity style={styles.clearButton} onPress={onClearToDate}>
                <Ionicons name="close-circle" size={18} color={isDark ? "#999" : "#666"} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      
      {/* Date Pickers */}
      {showFromDatePicker && (
        <DynamicDatePicker
          visible={showFromDatePicker}
          onClose={() => onFromDateChange(null)}
          date={fromDate || new Date()}
          onDateChange={(date) => onFromDateChange(null, date)}
        />
      )}
      
      {showToDatePicker && (
        <DynamicDatePicker
          visible={showToDatePicker}
          onClose={() => onToDateChange(null)}
          date={toDate || new Date()}
          onDateChange={(date) => onToDateChange(null, date)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateField: {
    flex: 1,
    marginHorizontal: 4,
  },
  dateLabel: {
    fontSize: 14,
    marginBottom: 6,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  dateInputDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dateInputLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  dateText: {
    fontSize: 14,
  },
  clearButton: {
    position: 'absolute',
    right: 8,
    padding: 4,
  },
});