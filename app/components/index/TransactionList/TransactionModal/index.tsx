import React, { useState, useEffect  } from 'react';
import {
  Modal,
  View,
  ToastAndroid,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useCategoryStore } from '@/app/stores/categoryStore';
import { useForm, Controller } from 'react-hook-form';
import { DynamicDatePicker } from '@/app/components/common/DynamicDatePicker';
import logger from '@/utils/logger';
import { useCreateTransaction } from '@/services/transaction/query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import our components
import AmountInput from './components/AmountInput';
import CategorySelector from './components/CategorySelector';
import DatePicker from './components/DatePicker';
import RemarksInput from './components/RemarksInput';
import SubmitButton from './components/SubmitButton';

// Import styles
import styles from './styles';
import BaseModal from '../../../common/Modal/BaseModal';

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
  onSuccess?: () => void; // Add callback for successful submission
  initialData?: FormData; // Add initial data for editing
  isEditing?: boolean; // Flag to indicate if we're editing
}

type FormData = {
  amount: string;
  category: string;
  date: Date;
  remarks: string;
};

export const TransactionModal: React.FC<TransactionModalProps> = ({ 
  visible, 
  onClose, 
  type, 
  onSuccess,
  initialData,
  isEditing = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { categories, fetchCategories } = useCategoryStore();
  const createTransaction = useCreateTransaction();
  const insets = useSafeAreaInsets();
  
  const { control, handleSubmit, reset, setValue, watch } = useForm<FormData>({
    defaultValues: initialData || {
      amount: '',
      category: '',
      date: new Date(),
      remarks: ''
    }
  });

  useEffect(() => {
    if (visible) {
      fetchCategories();
      
      // If we have initial data and we're editing, set the form values
      if (initialData && isEditing) {
        reset(initialData);
      } else if (!isEditing) {
        // Only reset if we're not editing
        reset({
          amount: '',
          category: '',
          date: new Date(),
          remarks: ''
        });
      }
    }
  }, [visible, reset, initialData, isEditing, fetchCategories]);

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
      // Convert amount to number
      const amount = parseFloat(data.amount);
      
      // Create transaction payload
      const transactionData = {
        amount,
        category: data.category,
        date: data.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        remarks: data.remarks,
        type: type // 'income' or 'expense'
      };
      
      logger.log('Creating transaction:', transactionData);
      
      // Call the API to create the transaction
      const result = await createTransaction.mutateAsync(transactionData);
      
      logger.log('Transaction created:', result);

      // Show success message
      const actionText = isEditing ? 'updated' : 'added';
      showToast(`${type === 'income' ? 'Income' : 'Expense'} ${actionText} successfully!`);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      logger.error('Error submitting transaction:', error);
      showToast(`Failed to ${isEditing ? 'update' : 'add'} transaction. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={modalStyles.container}
      >
        <ThemedText style={styles.title}>
          {isEditing ? 'Edit' : 'Add'} {type === 'income' ? 'Income' : 'Expense'}
        </ThemedText>

        <ScrollView 
          style={modalStyles.scrollView}
          contentContainerStyle={modalStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
          
          {/* Add extra space at the bottom to ensure content is not hidden behind the fixed button */}
          <View style={modalStyles.bottomPadding} />
        </ScrollView>
        
        {/* Fixed button container at the bottom */}
        <View 
          style={[
            modalStyles.buttonContainer, 
            { paddingBottom: Math.max(insets.bottom, 16) }
          ]}
        >
          <SubmitButton
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            label={isEditing ? 'Update' : 'Add'}
          />
        </View>
      </KeyboardAvoidingView>
    </BaseModal>
  );
};

export default TransactionModal;

// Additional styles for the modal layout
const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bottomPadding: {
    height: 80, // Extra space to ensure content is not hidden behind the fixed button
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E1E1E',
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
  },
});