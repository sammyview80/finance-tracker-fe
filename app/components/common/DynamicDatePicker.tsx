import React from 'react';
import { Modal, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/contexts/ThemeContext';

interface DynamicDatePickerProps {
  visible: boolean;
  onClose: () => void;
  date: Date;
  onDateChange: (date: Date) => void;
}

export const DynamicDatePicker: React.FC<DynamicDatePickerProps> = ({
  visible,
  onClose,
  date,
  onDateChange,
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  if (Platform.OS === 'android') {
    if (!visible) return null;
    return (
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          onClose();
          if (selectedDate) {
            onDateChange(selectedDate);
          }
        }}
      />
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.container, { backgroundColor: isDark ? '#2C2C2C' : '#FFFFFF' }]}>
          <View style={[styles.header, { borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }]}>
            <TouchableOpacity onPress={onClose}>
              <ThemedText style={styles.cancelText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onDateChange(date);
                onClose();
              }}
            >
              <ThemedText style={styles.doneText}>Done</ThemedText>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={(_, selectedDate) => {
              if (selectedDate) {
                onDateChange(selectedDate);
              }
            }}
            textColor={isDark ? '#FFFFFF' : '#000000'}
            accentColor="#3700B3"
            style={styles.picker}
          />
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#2C2C2C',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelText: {
    color: '#999',
    fontSize: 16,
  },
  doneText: {
    color: '#3700B3',
    fontSize: 16,
    fontWeight: '600',
  },
  picker: {
    height: 200,
    width: '100%',
  },
});
