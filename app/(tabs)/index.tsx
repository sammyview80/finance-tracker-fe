import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { BalanceCard } from '@/app/components/index/BalanceCard/BalanceCard';
import { SummaryGrid } from '@/app/components/index/SummaryGrid/SummaryGrid';
import { QuickActions } from '@/app/components/index/QuickActions/QuickActions';
import { TransactionList } from '@/app/components/index/TransactionList/TransactionList';
import { TransactionItem } from '@/app/components/index/TransactionList/TransactionItem';
import { DashboardAnalytics } from '@/app/components/budget/DashboardAnalytics';
import { useBudgetStore } from '@/store/useBudgetStore';
import { 
  useGetBalance, 
  useGetTransactions, 
  useGetSpendingByCategory,
  useGetBudgetComparison
} from '@/services/dashboard/query';
import Toast from 'react-native-toast-message';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { SwipeGestureHandler } from '@/app/components/common/Drawer';
import { useDrawer } from '@/app/components/common/Drawer';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [showBalance, setShowBalance] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { openDrawer } = useDrawer();
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Get budget data from store
  const { expenseItems, savingsGoals, fetchBudgetData } = useBudgetStore();
  
  // Fetch data from API
  const { 
    data: balanceData, 
    isLoading: isBalanceLoading, 
    error: balanceError,
    refetch: refetchBalance
  } = useGetBalance();
  
  const { 
    data: transactionsData, 
    isLoading: isTransactionsLoading, 
    error: transactionsError,
    refetch: refetchTransactions
  } = useGetTransactions(5); // Limit to 5 recent transactions
  
  const { 
    data: spendingData, 
    isLoading: isSpendingLoading, 
    error: spendingError,
    refetch: refetchSpending
  } = useGetSpendingByCategory();
  
  const { 
    data: budgetComparisonData, 
    isLoading: isBudgetComparisonLoading, 
    error: budgetComparisonError,
    refetch: refetchBudgetComparison
  } = useGetBudgetComparison();
  
  // Fetch budget data on component mount
  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);
  
  // Show error toast if any API call fails
  useEffect(() => {
    if (balanceError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load financial summary',
        position: 'bottom',
      });
    }
    
    if (transactionsError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load recent transactions',
        position: 'bottom',
      });
    }
    
    if (spendingError || budgetComparisonError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load analytics data',
        position: 'bottom',
      });
    }
  }, [balanceError, transactionsError, spendingError, budgetComparisonError]);
  
  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    try {
      await Promise.all([
        refetchBalance(),
        refetchTransactions(),
        refetchSpending(),
        refetchBudgetComparison(),
        fetchBudgetData()
      ]);
      
      Toast.show({
        type: 'success',
        text1: 'Dashboard refreshed',
        position: 'bottom',
        visibilityTime: 2000,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to refresh dashboard',
        position: 'bottom',
      });
    } finally {
      setRefreshing(false);
    }
  }, [refetchBalance, refetchTransactions, refetchSpending, refetchBudgetComparison, fetchBudgetData]);
  
  // Check if any data is loading
  const isLoading = isBalanceLoading || isTransactionsLoading || isSpendingLoading || isBudgetComparisonLoading;
  
  // Extract data from API responses
  const financialSummary = balanceData?.data;
  const recentTransactions = transactionsData?.data?.data || [];
  const savingsSummary = financialSummary?.savingsSummary;
  const period = financialSummary?.period;
  
  // If all data is loading, show loading indicator
  if (isLoading && !financialSummary && !recentTransactions.length) {
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors[isDark ? 'dark' : 'light'].tint} />
        <ThemedText style={styles.loadingText}>Loading dashboard data...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SwipeGestureHandler onSwipeRight={openDrawer}>
      <ThemedView style={styles.container}>
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent,
            { 
              paddingTop: 10,
              paddingBottom: insets.bottom + 85
            }
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors[isDark ? 'dark' : 'light'].tint}
              colors={[Colors[isDark ? 'dark' : 'light'].tint]}
              progressBackgroundColor={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
            />
          }
        >
          {/* Period Indicator */}
          {period && (
            <View style={[
              styles.periodContainer,
              { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }
            ]}>
              <Ionicons 
                name="calendar-outline" 
                size={16} 
                color={isDark ? '#AAAAAA' : '#666666'} 
              />
              <ThemedText style={styles.periodText}>
                {period.startDate} - {period.endDate}
              </ThemedText>
            </View>
          )}
          
          {/* Financial Summary */}
          <View style={styles.summarySection}>
            <BalanceCard
              balance={financialSummary?.balance || 0}
              showBalance={showBalance}
              onToggleBalance={() => setShowBalance(!showBalance)}
              isLoading={isBalanceLoading}
            />
            <SummaryGrid
              monthlyIncome={financialSummary?.totalIncome || 0}
              monthlyExpenses={financialSummary?.totalExpenses || 0}
              showBalance={showBalance}
              isLoading={isBalanceLoading}
            />
          </View>

          {/* Savings Summary */}
          {savingsSummary && (
            <View style={styles.savingsSection}>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Savings Progress</ThemedText>
                <Link href="/(tabs)/budget" asChild>
                  <Pressable>
                    <ThemedText style={[
                      styles.seeAllButton,
                      { color: Colors[isDark ? 'dark' : 'light'].tint }
                    ]}>Details</ThemedText>
                  </Pressable>
                </Link>
              </View>
              <View style={[
                styles.savingsCard,
                { 
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }
              ]}>
                <View style={styles.savingsRow}>
                  <View style={styles.savingsInfo}>
                    <ThemedText style={styles.savingsLabel}>Target</ThemedText>
                    <ThemedText style={styles.savingsValue}>
                      ${savingsSummary.totalSavingsTarget.toLocaleString()}
                    </ThemedText>
                  </View>
                  <View style={styles.savingsInfo}>
                    <ThemedText style={styles.savingsLabel}>Saved</ThemedText>
                    <ThemedText style={styles.savingsValue}>
                      ${savingsSummary.totalSaved.toLocaleString()}
                    </ThemedText>
                  </View>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={[
                    styles.progressBarBackground,
                    { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }
                  ]}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { 
                          width: `${Math.min(savingsSummary.savingsProgress, 100)}%`,
                          backgroundColor: Colors[isDark ? 'dark' : 'light'].tint
                        }
                      ]} 
                    />
                  </View>
                  <ThemedText style={styles.progressText}>
                    {savingsSummary.savingsProgress.toFixed(1)}% of goal
                  </ThemedText>
                </View>
                
                <View style={styles.savingsFooter}>
                  <Ionicons 
                    name="trending-up" 
                    size={16} 
                    color={Colors[isDark ? 'dark' : 'light'].tint} 
                  />
                  <ThemedText style={styles.remainingText}>
                    ${savingsSummary.remainingToSave.toLocaleString()} remaining to save
                  </ThemedText>
                </View>
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <QuickActions />
          
          {/* Analytics Overview */}
          <View style={styles.analyticsSection}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Spending Insights</ThemedText>
              <Link href="/(tabs)/budget" asChild>
                <Pressable>
                  <ThemedText style={[
                    styles.seeAllButton,
                    { color: Colors[isDark ? 'dark' : 'light'].tint }
                  ]}>See Details</ThemedText>
                </Pressable>
              </Link>
            </View>
            <View style={[
              styles.analyticsCard,
              { 
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              }
            ]}>
              {isSpendingLoading || isBudgetComparisonLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={Colors[isDark ? 'dark' : 'light'].tint} />
                  <ThemedText style={styles.loadingText}>Loading analytics...</ThemedText>
                </View>
              ) : (
                <DashboardAnalytics 
                  expenseItems={expenseItems} 
                  savingsGoals={savingsGoals}
                  compact={true} 
                  spendingData={spendingData?.data}
                  budgetData={budgetComparisonData?.data}
                />
              )}
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={styles.transactionsSection}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Recent Transactions</ThemedText>
              <Link href="/(tabs)/transactions" asChild>
                <Pressable>
                  <ThemedText style={[
                    styles.seeAllButton,
                    { color: Colors[isDark ? 'dark' : 'light'].tint }
                  ]}>See All</ThemedText>
                </Pressable>
              </Link>
            </View>
            {isTransactionsLoading && !recentTransactions.length ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors[isDark ? 'dark' : 'light'].tint} />
                <ThemedText style={styles.loadingText}>Loading transactions...</ThemedText>
              </View>
            ) : (
              <View style={[
                styles.transactionListContainer,
                { 
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }
              ]}>
                {recentTransactions.map(transaction => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onLongPress={() => {}}
                  />
                ))}
                {recentTransactions.length === 0 && (
                  <View style={styles.emptyContainer}>
                    <ThemedText style={styles.emptyText}>No transactions found</ThemedText>
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </ThemedView>
    </SwipeGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  periodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  periodText: {
    fontSize: 12,
  },
  summarySection: {
    marginBottom: 24,
  },
  savingsSection: {
    marginBottom: 24,
  },
  savingsCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  savingsInfo: {
    alignItems: 'flex-start',
  },
  savingsLabel: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.7,
  },
  savingsValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'right',
  },
  savingsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  remainingText: {
    fontSize: 14,
    opacity: 0.7,
  },
  analyticsSection: {
    marginBottom: 24,
  },
  analyticsCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    minHeight: 200, // Add minimum height for better UX during loading
  },
  transactionsSection: {
    flex: 1,
    minHeight: 200, // Add minimum height for better UX during loading
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    opacity: 0.7,
  },
  transactionListContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 100,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  menuButton: {
    padding: 10,
    borderRadius: 20,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});