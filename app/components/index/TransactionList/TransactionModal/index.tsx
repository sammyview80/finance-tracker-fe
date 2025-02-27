import React, { useState, useEffect  } from 'react';
import {
  Modal,
  View,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useCategoryStore } from '@/app/stores/categoryStore';
import { useForm, Controller } from 'react-hook-form';
import { DynamicDatePicker } from '@/app/components/common/DynamicDatePicker';

// Import our components
import { AmountInput } from './components/AmountInput';
import { CategorySelector } from './components/CategorySelector';
import { DatePicker } from './components/DatePicker';
import { RemarksInput } from './components/RemarksInput';
import { SubmitButton } from './components/SubmitButton';

// Import styles
import { styles } from './styles';
import { BaseModal } from '../../../common/Modal/BaseModal';

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
}

type FormData = {
  amount: string;
  category: string;
  date: Date;
  remarks: string;
};

export const TransactionModal: React.FC<TransactionModalProps> = ({ visible, onClose, type }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { categories, fetchCategories } = useCategoryStore();
  const { control, handleSubmit, reset, setValue, watch } = useForm<FormData>({
    defaultValues: {
      amount: '',
      category: '',
      date: new Date(),
      remarks: ''
    }
  });

  useEffect(() => {
    if (visible) {
      fetchCategories();
      reset(); // Reset form when modal opens
    }
  }, [visible, reset]);

  const handleDateChange = (selectedDate: Date) => {
    setValue('date', selectedDate);
  };

  // Show toast message based on platform
  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', message);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Transaction submitted:', data);

      // Show success message
      showToast(`${type === 'income' ? 'Income' : 'Expense'} added successfully!`);

      onClose();
    } catch (error) {
      console.error('Error submitting transaction:', error);
      showToast('Failed to add transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <ThemedText style={styles.title}>
        Add {type === 'income' ? 'Income' : 'Expense'}
      </ThemedText>

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Amount</ThemedText>
        <Controller
          control={control}
          name="amount"
          rules={{ required: 'Amount is required' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AmountInput
              value={value}
              onChange={onChange}
              error={error?.message}
            />
          )}
        />
      </View>

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Category</ThemedText>
        <Controller
          control={control}
          name="category"
          rules={{ required: 'Category is required' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CategorySelector
              categories={categories}
              selectedCategory={value}
              onSelectCategory={onChange}
              type={type}
              error={error?.message}
            />
          )}
        />
      </View>

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Date</ThemedText>
        <Controller
          control={control}
          name="date"
          render={({ field: { value } }) => (
            <>
              <DatePicker
                date={value}
                showPicker={showDatePicker}
                togglePicker={toggleDatePicker}
                onDateChange={handleDateChange}
              />
              <DynamicDatePicker
                visible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                date={value}
                onDateChange={handleDateChange}
              />
            </>
          )}
        />
      </View>

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Remarks</ThemedText>
        <Controller
          control={control}
          name="remarks"
          render={({ field: { onChange, value } }) => (
            <RemarksInput
              value={value}
              onChange={onChange}
            />
          )}
        />
      </View>

      <SubmitButton
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
      />
    </BaseModal>
  );
};