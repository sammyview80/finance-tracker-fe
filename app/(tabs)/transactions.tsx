import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TransactionList } from '@/app/components/index/TransactionList/TransactionList';
import { TransactionFilter, FilterOptions } from '@/app/components/index/TransactionList/TransactionFilter';
import { transactionService, Transaction } from '@/services/transactionService';
import { ThemedText } from '@/components/ThemedText';

export default function TransactionsScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filter state
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    type: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
    fromDate: null,
    toDate: null,
    minAmount: '',
    maxAmount: '',
  });

  // Fetch transactions with applied filters
  const fetchTransactions = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await transactionService.getTransactions(filterOptions);
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
  };

  // Apply filters and reload transactions
  const handleApplyFilters = () => {
    fetchTransactions();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <ThemedText style={styles.title}>Transactions</ThemedText>
        </View>
        <TransactionFilter 
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onApply={handleApplyFilters}
        />
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 85, // Add padding for tab bar height
          flexGrow: 1, // Allows the scroll view to take up available space
        }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3700B3" />
            <ThemedText style={styles.loadingText}>Loading transactions...</ThemedText>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchTransactions}
            >
              <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
            </TouchableOpacity>
          </View>
        ) : transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No transactions found</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Try changing your filters or add new transactions
            </ThemedText>
          </View>
        ) : (
          <TransactionList transactions={transactions} showHeader={false} />
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
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
    paddingVertical: 30,
  },
  errorText: {
    fontSize: 16,
    color: '#FF5252',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3700B3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});