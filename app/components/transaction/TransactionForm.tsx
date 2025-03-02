import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Transaction } from '@/types/transaction';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { formatCurrency } from '@/utils/formatters';

interface TransactionFormProps {
  initialData?: Partial<Transaction>;
  onSubmit: (data: Partial<Transaction>) => Promise<void>;
  isSubmitting: boolean;
  mode: 'add' | 'edit';
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  mode,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Form state
  const [formData, setFormData] = useState<Partial<Transaction>>({
    type: 'expense',
    amount: 0,
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    ...initialData,
  });
  
  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    initialData?.date ? new Date(initialData.date) : new Date()
  );
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Category options
  const expenseCategories = [
    'Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 
    'Healthcare', 'Education', 'Shopping', 'Personal Care', 'Travel', 
    'Debt Payments', 'Savings', 'Investments', 'Gifts & Donations', 'Other'
  ];
  
  const incomeCategories = [
    'Salary', 'Freelance', 'Business', 'Investments', 'Rental', 
    'Gifts', 'Refunds', 'Allowance', 'Other'
  ];
  
  // Handle form changes
  const handleChange = (field: keyof Transaction, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // Clear error for this field
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };
  
  // Handle date change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      handleChange('date', selectedDate.toISOString().split('T')[0]);
    }
  };
  
  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return the original string if it can't be parsed
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date for display:', error);
      return dateString; // Return the original string in case of error
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.description) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      await onSubmit(formData);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* Transaction Type */}
      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Transaction Type</ThemedText>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              formData.type === 'expense' && styles.activeTypeButton,
              formData.type === 'expense' && isDark ? styles.activeTypeButtonDark : styles.activeTypeButtonLight,
            ]}
            onPress={() => handleChange('type', 'expense')}
          >
            <ThemedText style={[
              styles.typeButtonText,
              formData.type === 'expense' && styles.activeTypeButtonText,
            ]}>
              Expense
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeButton,
              formData.type === 'income' && styles.activeTypeButton,
              formData.type === 'income' && isDark ? styles.activeTypeButtonDark : styles.activeTypeButtonLight,
            ]}
            onPress={() => handleChange('type', 'income')}
          >
            <ThemedText style={[
              styles.typeButtonText,
              formData.type === 'income' && styles.activeTypeButtonText,
            ]}>
              Income
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Amount */}
      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Amount</ThemedText>
        <TextInput
          style={[
            styles.input,
            isDark ? styles.inputDark : styles.inputLight,
            errors.amount ? styles.inputError : null,
          ]}
          placeholder="0.00"
          placeholderTextColor={isDark ? '#666' : '#999'}
          keyboardType="decimal-pad"
          value={formData.amount ? formData.amount.toString() : ''}
          onChangeText={(value) => handleChange('amount', parseFloat(value) || 0)}
        />
        {errors.amount ? (
          <ThemedText style={styles.errorText}>{errors.amount}</ThemedText>
        ) : null}
      </View>
      
      {/* Category */}
      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Category</ThemedText>
        <View style={[
          styles.pickerContainer,
          isDark ? styles.pickerContainerDark : styles.pickerContainerLight,
          errors.category ? styles.inputError : null,
        ]}>
          <Picker
            selectedValue={formData.category}
            onValueChange={(value) => handleChange('category', value)}
            style={styles.picker}
            dropdownIconColor={isDark ? '#FFF' : '#000'}
            itemStyle={{ color: isDark ? '#FFF' : '#000' }}
          >
            <Picker.Item label="Select a category" value="" />
            {(formData.type === 'expense' ? expenseCategories : incomeCategories).map((category) => (
              <Picker.Item key={category} label={category} value={category} />
            ))}
          </Picker>
        </View>
        {errors.category ? (
          <ThemedText style={styles.errorText}>{errors.category}</ThemedText>
        ) : null}
      </View>
      
      {/* Description */}
      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Description</ThemedText>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            isDark ? styles.inputDark : styles.inputLight,
            errors.description ? styles.inputError : null,
          ]}
          placeholder="Enter a description"
          placeholderTextColor={isDark ? '#666' : '#999'}
          multiline
          numberOfLines={3}
          value={formData.description}
          onChangeText={(value) => handleChange('description', value)}
        />
        {errors.description ? (
          <ThemedText style={styles.errorText}>{errors.description}</ThemedText>
        ) : null}
      </View>
      
      {/* Date */}
      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Date</ThemedText>
        <TouchableOpacity
          style={[
            styles.input,
            isDark ? styles.inputDark : styles.inputLight,
            errors.date ? styles.inputError : null,
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <ThemedText>
            {formData.date ? formatDateForDisplay(formData.date) : 'Select a date'}
          </ThemedText>
        </TouchableOpacity>
        {errors.date ? (
          <ThemedText style={styles.errorText}>{errors.date}</ThemedText>
        ) : null}
        
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>
      
      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <ThemedText style={styles.submitButtonText}>
            {mode === 'add' ? 'Add Transaction' : 'Update Transaction'}
          </ThemedText>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  inputLight: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    color: '#000',
  },
  inputDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#444',
    color: '#FFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
  typeSelector: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTypeButton: {
    borderColor: '#3700B3',
  },
  activeTypeButtonLight: {
    backgroundColor: '#3700B3',
  },
  activeTypeButtonDark: {
    backgroundColor: '#3700B3',
  },
  activeTypeButtonText: {
    color: '#FFF',
  },
  pickerContainer: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pickerContainerLight: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  pickerContainerDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#444',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#3700B3',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 