import React from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Pressable, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DynamicDatePicker } from '@/app/components/common/DynamicDatePicker';

interface DateRangeSelectorProps {
  fromDate: Date | null;
  toDate: Date | null;
  showFromDatePicker: boolean;
  showToDatePicker: boolean;
  setShowFromDatePicker: (show: boolean) => void;
  setShowToDatePicker: (show: boolean) => void;
  handleFromDateChange: (event: any, selectedDate?: Date) => void;
  handleToDateChange: (event: any, selectedDate?: Date) => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  fromDate,
  toDate,
  showFromDatePicker,
  showToDatePicker,
  setShowFromDatePicker,
  setShowToDatePicker,
  handleFromDateChange,
  handleToDateChange,
}) => {
  const colorScheme = useColorScheme();

  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return 'Select Date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderDatePickerIOS = (
    isFromDate: boolean,
    currentDate: Date | null | undefined,
    onChangeHandler: (event: any, date?: Date) => void
  ) => {
    const currentValue = currentDate || new Date();

    return (
      <Modal
        visible={isFromDate ? showFromDatePicker : showToDatePicker}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          style={styles.datePickerOverlay}
          onPress={() => isFromDate ? setShowFromDatePicker(false) : setShowToDatePicker(false)}
        >
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerHeader}>
              <TouchableOpacity
                onPress={() => isFromDate ? setShowFromDatePicker(false) : setShowToDatePicker(false)}
              >
                <ThemedText style={styles.datePickerCancel}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onChangeHandler({}, currentValue);
                  if (isFromDate) {
                    setShowFromDatePicker(false);
                  } else {
                    setShowToDatePicker(false);
                  }
                }}
              >
                <ThemedText style={styles.datePickerDone}>Done</ThemedText>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={currentValue}
              mode="date"
              display="spinner"
              onChange={(event, date) => {
                if (date) {
                  onChangeHandler(event, date);
                }
              }}
              textColor={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
              accentColor="#3700B3"
              style={styles.datePickerIOS}
            />
          </View>
        </Pressable>
      </Modal>
    );
  };

  return (
    <View style={styles.filterSection}>
      <ThemedText style={styles.filterSectionTitle}>Date Range</ThemedText>
      <View style={styles.dateRangeContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowFromDatePicker(true)}
        >
          <ThemedText style={styles.dateButtonLabel}>From</ThemedText>
          <View style={[styles.dateButtonContent, fromDate && styles.activeDate]}>
            <ThemedText style={styles.dateText}>{formatDate(fromDate)}</ThemedText>
            <Ionicons name="calendar-outline" size={18} color={fromDate ? "#FFF" : "#CCC"} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowToDatePicker(true)}
        >
          <ThemedText style={styles.dateButtonLabel}>To</ThemedText>
          <View style={[styles.dateButtonContent, toDate && styles.activeDate]}>
            <ThemedText style={styles.dateText}>{formatDate(toDate)}</ThemedText>
            <Ionicons name="calendar-outline" size={18} color={toDate ? "#FFF" : "#CCC"} />
          </View>
        </TouchableOpacity>
      </View>

      <DynamicDatePicker
        visible={showFromDatePicker}
        onClose={() => setShowFromDatePicker(false)}
        date={fromDate || new Date()}
        onDateChange={(date) => handleFromDateChange({}, date)}
      />
      <DynamicDatePicker
        visible={showToDatePicker}
        onClose={() => setShowToDatePicker(false)}
        date={toDate || new Date()}
        onDateChange={(date) => handleToDateChange({}, date)}
      />
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
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  dateButtonLabel: {
    fontSize: 14,
    color: '#AAA',
    marginBottom: 6,
  },
  dateButtonContent: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeDate: {
    backgroundColor: '#3700B3',
    borderColor: '#3700B3',
  },
  dateText: {
    fontSize: 14,
    color: '#FFF',
  },
  datePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: '#2C2C2C',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  datePickerCancel: {
    color: '#999',
    fontSize: 16,
  },
  datePickerDone: {
    color: '#3700B3',
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerIOS: {
    height: 200,
    width: '100%',
  },
});