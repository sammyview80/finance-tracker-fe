import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome } from '@expo/vector-icons';
import { TransactionForm } from '@/app/components/transaction/TransactionForm';
import { Transaction } from '@/types/transaction';
import { transactionService } from '@/services/transaction/service';
import Toast from 'react-native-toast-message';

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch transaction details
  useEffect(() => {
    const fetchTransaction = async () => {
      setIsLoading(true);
      try {
        const response = await transactionService.getTransaction(id);
        if (response.data) {
          setTransaction(response.data);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Transaction not found',
            position: 'bottom'
          });
        }
      } catch (error) {
        console.error('Error fetching transaction:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load transaction details',
          position: 'bottom'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchTransaction();
    }
  }, [id]);
  
  // Handle form submission
  const handleSubmit = async (data: Partial<Transaction>) => {
    if (!transaction) return;
    
    setIsSubmitting(true);
    try {
      await transactionService.updateTransaction(transaction.id, data);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Transaction updated successfully',
        position: 'bottom'
      });
      router.back();
    } catch (error) {
      console.error('Error updating transaction:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update transaction',
        position: 'bottom'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color={colorScheme === 'dark' ? '#FFF' : '#000'} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Edit Transaction</ThemedText>
        <View style={styles.headerRight} />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3700B3" />
          <ThemedText style={styles.loadingText}>Loading transaction details...</ThemedText>
        </View>
      ) : !transaction ? (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Transaction not found</ThemedText>
          <TouchableOpacity onPress={() => router.back()} style={styles.backToListButton}>
            <ThemedText style={styles.backToListText}>Back to Transactions</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <TransactionForm
          initialData={transaction}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          mode="edit"
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    width: 36,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#CCC',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  backToListButton: {
    backgroundColor: '#3700B3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  backToListText: {
    color: '#FFF',
    fontWeight: '500',
  },
}); 