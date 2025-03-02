import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { transactionService } from '@/services/transaction/service';
import { Transaction } from '@/types/transaction';
import Toast from 'react-native-toast-message';
import { formatCurrency } from '@/utils/formatters';
import { useGetTransaction } from '@/services/transaction/query';
import Header from '@/app/components/common/Header';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  
  // Use the query hook to fetch transaction
  const { data: transaction, isLoading, error } = useGetTransaction(id);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Handle delete transaction
  const handleDelete = async () => {
    if (!transaction) return;
    
    setIsDeleting(true);
    try {
      await transactionService.deleteTransaction(transaction.id);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Transaction deleted successfully',
        position: 'bottom'
      });
      router.back();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete transaction',
        position: 'bottom'
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Handle edit transaction
  const handleEdit = () => {
    router.push(`/transaction/edit/${transaction?.id}`);
  };
  
  // Format date
  const formatDate = (date: string | object | null | undefined) => {
    try {
      // Handle null or undefined
      if (!date) {
        return 'No date';
      }
      
      // Handle string date
      if (typeof date === 'string') {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
        return date; // Return the string if it can't be parsed as a date
      }
      
      // Handle timestamp number
      if (typeof date === 'number') {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
        return 'Invalid date';
      }
      
      // Handle Date object
      if (date instanceof Date) {
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
        return 'Invalid date';
      }
      
      // Handle object with date properties
      if (typeof date === 'object') {
        // Check if it's an empty object
        if (Object.keys(date).length === 0) {
          return 'No date';
        }
        
        // Check if it has year, month, day properties
        const dateLike = date as any;
        if (dateLike.year) {
          try {
            const dateObj = new Date(
              dateLike.year,
              (dateLike.month || 1) - 1,
              dateLike.day || 1
            );
            if (!isNaN(dateObj.getTime())) {
              return dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
            }
          } catch (error) {
            console.error('Error creating date from components:', error);
            return 'Invalid date';
          }
        }
        
        // Try to create a date from the object
        try {
          const dateObj = new Date(date as any);
          if (!isNaN(dateObj.getTime())) {
            return dateObj.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
        } catch (error) {
          console.error('Error creating date from object:', error);
          return 'Invalid date';
        }
      }
      
      return 'Invalid date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };
  
  // Get category name
  const getCategoryName = (category: string | any) => {
    if (typeof category === 'string') {
      return category;
    }
    return category?.name || 'Uncategorized';
  };
  
  // Format amount
  const getFormattedAmount = (amount: number | string) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return formatCurrency(numericAmount);
  };
  
  // If loading, show loading indicator
  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <ThemedText style={{ marginTop: 10 }}>Loading transaction...</ThemedText>
      </ThemedView>
    );
  }
  
  // If error or no transaction found
  if (error || !transaction) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <FontAwesome name="exclamation-circle" size={50} color="#FF6B6B" />
        <ThemedText style={{ marginTop: 10 }}>
          {error ? 'Error loading transaction' : 'Transaction not found'}
        </ThemedText>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.back()}
        >
          <ThemedText style={styles.buttonText}>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }
  
  // Render the transaction details
  return (
    <ThemedView style={styles.container}>
      {/* Header with Edit and Delete options */}
      <Header 
        title="Transaction Details" 
        showBackButton={true}
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={handleEdit} 
              style={styles.headerButton}
              disabled={isDeleting}
            >
              <FontAwesome name="edit" size={20} color={colorScheme === 'dark' ? '#FFF' : '#000'} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleDelete} 
              style={styles.headerButton}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#FF6B6B" />
              ) : (
                <FontAwesome name="trash" size={20} color="#FF6B6B" />
              )}
            </TouchableOpacity>
          </View>
        }
      />
      
      {/* Transaction content */}
      <ScrollView style={styles.content}>
        {/* Transaction Type Badge */}
        <View style={[
          styles.typeBadge,
          transaction.type === 'income' ? styles.incomeBadge : styles.expenseBadge
        ]}>
          <ThemedText style={styles.typeBadgeText}>
            {transaction.type === 'income' ? 'Income' : 'Expense'}
          </ThemedText>
        </View>
        
        {/* Amount */}
        <View style={styles.amountContainer}>
          <ThemedText style={[
            styles.amount,
            transaction.type === 'income' ? styles.incomeText : styles.expenseText
          ]}>
            {transaction.type === 'income' ? '+' : '-'} {getFormattedAmount(transaction.amount)}
          </ThemedText>
        </View>
        
        {/* Transaction Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Date</ThemedText>
            <ThemedText style={styles.detailValue}>{formatDate(transaction.date)}</ThemedText>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Category</ThemedText>
            <ThemedText style={styles.detailValue}>{getCategoryName(transaction.category)}</ThemedText>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Description</ThemedText>
            <ThemedText style={styles.detailValue}>{transaction.description}</ThemedText>
          </View>
          
          {transaction.source && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Source</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {typeof transaction.source === 'object' ? transaction.source.name : transaction.source}
                </ThemedText>
              </View>
            </>
          )}
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
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
  typeBadge: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  incomeBadge: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
  },
  expenseBadge: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
  },
  typeBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  incomeText: {
    color: '#2ecc71',
  },
  expenseText: {
    color: '#e74c3c',
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#CCC',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3700B3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '500',
  },
}); 