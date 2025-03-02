import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { TransactionForm } from '@/app/components/transaction/TransactionForm';
import { Transaction } from '@/types/transaction';
import { transactionService } from '@/services/transaction/service';
import Toast from 'react-native-toast-message';
import Header from '@/app/components/common/Header';

export default function AddTransactionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const type = params.type as string || 'expense';
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle form submission
  const handleSubmit = async (data: Partial<Transaction>) => {
    setIsSubmitting(true);
    try {
      await transactionService.createTransaction(data);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Transaction added successfully',
        position: 'bottom'
      });
      router.back();
    } catch (error) {
      console.error('Error adding transaction:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add transaction',
        position: 'bottom'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <Header 
        title={`Add ${type.charAt(0).toUpperCase() + type.slice(1)}`} 
        showBackButton={true} 
      />
      
      {/* Transaction Form */}
      <TransactionForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        mode="add"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 