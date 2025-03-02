import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { styles } from '../styles';

interface DatePickerProps {
  date: Date;
  showPicker: boolean;
  togglePicker: () => void;
  onDateChange: (event: any, selectedDate?: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  date,
  showPicker,
  togglePicker,
  onDateChange
}) => {
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <>
      <TouchableOpacity 
        onPress={togglePicker} 
        style={styles.dateButton}
        accessibilityRole="button"
        accessibilityLabel="Select date"
      >
        <ThemedText style={styles.dateText}>
          {formatDate(date)}
        </ThemedText>
        <Ionicons 
          name={showPicker ? "chevron-up" : "calendar-outline"} 
          size={20} 
          color="#FFF" 
        />
      </TouchableOpacity>
    </>
  );
};

export default DatePicker;