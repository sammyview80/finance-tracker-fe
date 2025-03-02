import React, { useState, useCallback, useLayoutEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TransactionList } from '@/app/components/index/TransactionList/TransactionList';
import { TransactionFilter } from '@/app/components/index/TransactionList/TransactionFilter';
import { FilterOptions } from '@/types/transaction';
import { ThemedText } from '@/components/ThemedText';
import { useInfiniteTransactions } from '@/services/transaction/query';
import Toast from 'react-native-toast-message';
import { Transaction } from '@/types/transaction';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import logger from '@/utils/logger';
import { FilterButton } from '@/app/components/index/TransactionList/filters/FilterButton';
import { LinearGradient } from 'expo-linear-gradient';
import { TransactionAnalytics } from '@/app/components/index/TransactionAnalytics';

const { width } = Dimensions.get('window');

export default function TransactionsScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const insets = useSafeAreaInsets();
  
  // Filter state
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    type: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
    fromDate: null,
    toDate: null,
    minAmount: '',
    maxAmount: '',
    category: '',
  });
  
  // Filter modal visibility
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  
  // View mode state (list or analytics)
  const [viewMode, setViewMode] = useState<'list' | 'analytics'>('list');

  // Use infinite query for transactions
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching
  } = useInfiniteTransactions(10, filterOptions);
  logger.log(data, 'data transactions');

  // Flatten the pages of transactions into a single array
  const transactions = data?.pages
    .flatMap(page => page.data || [])
    .filter(Boolean) || [];
  
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
  };

  // Apply filters and reload transactions
  const handleApplyFilters = () => {
    refetch();
  };

  // Handle reaching the end of the list
  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Show error toast if there's an error
  React.useEffect(() => {
    if (isError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load transactions. Please try again.',
        position: 'bottom'
      });
    }
  }, [isError]);

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      (filterOptions.type && filterOptions.type !== 'all') ||
      filterOptions.fromDate !== null ||
      filterOptions.toDate !== null ||
      filterOptions.minAmount !== '' ||
      filterOptions.maxAmount !== '' ||
      filterOptions.category !== ''
    );
  };

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filterOptions.type && filterOptions.type !== 'all') count++;
    if (filterOptions.fromDate) count++;
    if (filterOptions.toDate) count++;
    if (filterOptions.minAmount && filterOptions.minAmount.trim() !== '') count++;
    if (filterOptions.maxAmount && filterOptions.maxAmount.trim() !== '') count++;
    if (filterOptions.category && filterOptions.category.trim() !== '') count++;
    return count;
  };

  // Clear all filters
  const clearAllFilters = () => {
    const resetFilters: FilterOptions = {
      type: 'all',
      sortBy: 'date',
      sortOrder: 'desc',
      fromDate: null,
      toDate: null,
      minAmount: '',
      maxAmount: '',
      category: '',
    };
    setFilterOptions(resetFilters);
    refetch();
  };
  
  // Toggle view mode between list and analytics
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'analytics' : 'list');
  };
  
  // Set up the header right button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity 
            onPress={toggleViewMode}
            style={styles.viewModeButton}
          >
            <Ionicons 
              name={viewMode === 'list' ? 'stats-chart' : 'list'} 
              size={22} 
              color={isDark ? '#FFFFFF' : '#333333'} 
            />
          </TouchableOpacity>
          <FilterButton 
            activeFiltersCount={getActiveFiltersCount()} 
            onPress={() => setIsFilterModalVisible(true)}
            isHeaderButton={true}
          />
        </View>
      ),
    });
  }, [navigation, filterOptions, viewMode]);

  return (
    <ThemedView style={styles.container}>
      {/* Transactions Summary Cards */}
      <View 
        style={[
          styles.summaryContainer,
          { 
            backgroundColor: isDark ? 'rgba(18, 18, 18, 0.5)' : 'rgba(245, 245, 245, 0.5)',
          }
        ]}
      >
        {/* Total Transactions Card */}
        <View style={styles.cardWrapper}>
          <LinearGradient
            colors={isDark ? ['#2C2C2C', '#1E1E1E'] : ['#FFFFFF', '#F5F5F5']}
            style={[styles.summaryCard, styles.totalCard]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardTextContainer}>
              <ThemedText style={styles.cardLabel}>Transactions</ThemedText>
              <ThemedText style={styles.cardValue}>
                {isLoading ? '...' : transactions.length}
              </ThemedText>
            </View>
          </LinearGradient>
        </View>

        {/* Income Card */}
        <View style={styles.cardWrapper}>
          <LinearGradient
            colors={isDark ? ['#1A3D2C', '#0F2D1F'] : ['#E6F4EA', '#D0EAD9']}
            style={[styles.summaryCard, styles.incomeCard]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardTextContainer}>
              <ThemedText style={styles.cardLabel}>Income</ThemedText>
              <ThemedText style={[styles.cardValue, styles.incomeText]}>
                {isLoading ? '...' : formatCurrency(totalIncome)}
              </ThemedText>
            </View>
          </LinearGradient>
        </View>

        {/* Expense Card */}
        <View style={styles.cardWrapper}>
          <LinearGradient
            colors={isDark ? ['#3D1A1A', '#2D0F0F'] : ['#FEECEB', '#FADAD9']}
            style={[styles.summaryCard, styles.expenseCard]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardTextContainer}>
              <ThemedText style={styles.cardLabel}>Expenses</ThemedText>
              <ThemedText style={[styles.cardValue, styles.expenseText]}>
                {isLoading ? '...' : formatCurrency(totalExpenses)}
              </ThemedText>
            </View>
          </LinearGradient>
        </View>
      </View>
      
      {/* View Mode Content */}
      {viewMode === 'analytics' ? (
        /* Analytics View */
        <TransactionAnalytics 
          transactions={transactions}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
        />
      ) : (
        /* List View */
        <>
          {/* Instructions for users */}
          {transactions.length === 0 && !isLoading && (
            <View style={styles.emptyStateContainer}>
              <Ionicons 
                name="receipt-outline" 
                size={48} 
                color={isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'} 
              />
              <ThemedText style={styles.emptyStateTitle}>No Transactions Found</ThemedText>
              <ThemedText style={styles.emptyStateText}>
                {hasActiveFilters() 
                  ? 'Try adjusting your filters to see more results' 
                  : 'Add your first transaction to start tracking your finances'}
              </ThemedText>
            </View>
          )}
          
          {/* Active Filters Display */}
          {hasActiveFilters() && (
            <View 
              style={[
                styles.activeFiltersContainer
              ]}
            >
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersScrollContent}
              >
                {filterOptions.type && filterOptions.type !== 'all' && (
                  <View style={[
                    styles.filterChip,
                    { backgroundColor: isDark ? 'rgba(55, 0, 179, 0.2)' : 'rgba(55, 0, 179, 0.1)' }
                  ]}>
                    <ThemedText style={styles.filterChipText}>
                      Type: {filterOptions.type.charAt(0).toUpperCase() + filterOptions.type.slice(1)}
                    </ThemedText>
                  </View>
                )}
                
                {filterOptions.fromDate && (
                  <View style={[
                    styles.filterChip,
                    { backgroundColor: isDark ? 'rgba(55, 0, 179, 0.2)' : 'rgba(55, 0, 179, 0.1)' }
                  ]}>
                    <ThemedText style={styles.filterChipText}>
                      From: {formatDate(filterOptions.fromDate)}
                    </ThemedText>
                  </View>
                )}
                
                {filterOptions.toDate && (
                  <View style={[
                    styles.filterChip,
                    { backgroundColor: isDark ? 'rgba(55, 0, 179, 0.2)' : 'rgba(55, 0, 179, 0.1)' }
                  ]}>
                    <ThemedText style={styles.filterChipText}>
                      To: {formatDate(filterOptions.toDate)}
                    </ThemedText>
                  </View>
                )}
                
                {filterOptions.minAmount && (
                  <View style={[
                    styles.filterChip,
                    { backgroundColor: isDark ? 'rgba(55, 0, 179, 0.2)' : 'rgba(55, 0, 179, 0.1)' }
                  ]}>
                    <ThemedText style={styles.filterChipText}>
                      Min: ${filterOptions.minAmount}
                    </ThemedText>
                  </View>
                )}
                
                {filterOptions.maxAmount && (
                  <View style={[
                    styles.filterChip,
                    { backgroundColor: isDark ? 'rgba(55, 0, 179, 0.2)' : 'rgba(55, 0, 179, 0.1)' }
                  ]}>
                    <ThemedText style={styles.filterChipText}>
                      Max: ${filterOptions.maxAmount}
                    </ThemedText>
                  </View>
                )}
                
                {filterOptions.category && (
                  <View style={[
                    styles.filterChip,
                    { backgroundColor: isDark ? 'rgba(55, 0, 179, 0.2)' : 'rgba(55, 0, 179, 0.1)' }
                  ]}>
                    <ThemedText style={styles.filterChipText}>
                      Category: {filterOptions.category}
                    </ThemedText>
                  </View>
                )}
                
                <TouchableOpacity 
                  style={[
                    styles.clearFiltersButton,
                    { backgroundColor: isDark ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 59, 48, 0.1)' }
                  ]}
                  onPress={clearAllFilters}
                >
                  <Ionicons 
                    name="close-circle" 
                    size={16} 
                    color={isDark ? "#FFFFFF" : "#F44336"} 
                  />
                  <ThemedText style={[
                    styles.clearFiltersText,
                    { color: isDark ? "#FFFFFF" : "#F44336" }
                  ]}>Clear All</ThemedText>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}
          
          {/* Transaction List */}
          <TransactionList
            transactions={transactions}
            isLoading={isLoading}
            isRefreshing={isRefetching}
            onRefresh={handleRefresh}
            onEndReached={handleEndReached}
            hasMoreData={!!hasNextPage}
            onTransactionEdit={handleRefresh}
          />
        </>
      )}
      
      {/* Filter Modal */}
      <TransactionFilter 
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
      />
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[
          styles.fab
        ]}
        onPress={() => router.push('/transaction/add')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#3700B3', '#6200EE']}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FontAwesome name="plus" size={24} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    paddingHorizontal: 16,
    zIndex: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  cardWrapper: {
    width: '31%',
  },
  summaryCard: {
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  cardLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  totalCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#9C27B0',
  },
  incomeCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  expenseCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#F44336',
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#F44336',
  },
  activeFiltersContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
    zIndex: 5,
  },
  filtersScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(55, 0, 179, 0.3)',
  },
  filterChipText: {
    fontSize: 12,
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  clearFiltersText: {
    fontSize: 12,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    borderRadius: 28,
    width: 56,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewModeButton: {
    padding: 4,
  },
});