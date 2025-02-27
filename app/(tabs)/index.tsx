import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { BalanceCard } from '@/app/components/index/BalanceCard/BalanceCard';
import { SummaryGrid } from '@/app/components/index/SummaryGrid/SummaryGrid';
import { QuickActions } from '@/app/components/index/QuickActions/QuickActions';
import { TransactionList } from '@/app/components/index/TransactionList/TransactionList';

// Dummy data (will be replaced with API calls)
const dashboardData = {
  totalBalance: 5000.00,
  monthlyIncome: 3000.00,
  monthlyExpenses: 2000.00,
  recentTransactions: [
    {
      id: 't1',
      date: '2024-01-20',
      amount: 50.00,
      category: 'Food',
      description: 'Grocery shopping',
      type: 'expense' as const
    },
    {
      id: 't2',
      date: '2024-01-19',
      amount: 3000.00,
      category: 'Salary',
      description: 'Monthly salary',
      type: 'income' as const
    },
    {
      id: 't3',
      date: '2024-01-18',
      amount: 100.00,
      category: 'Transportation',
      description: 'Fuel',
      type: 'expense' as const
    }
  ]
};

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [showBalance, setShowBalance] = useState(true);

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { 
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 85
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Financial Summary */}
        <View style={styles.summarySection}>
          <BalanceCard
            balance={dashboardData.totalBalance}
            showBalance={showBalance}
            onToggleBalance={() => setShowBalance(!showBalance)}
          />
          <SummaryGrid
            monthlyIncome={dashboardData.monthlyIncome}
            monthlyExpenses={dashboardData.monthlyExpenses}
            showBalance={showBalance}
          />
        </View>

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Recent Transactions</ThemedText>
            <Link href="/(tabs)/transactions" asChild>
              <Pressable>
                <ThemedText style={styles.seeAllButton}>See All</ThemedText>
              </Pressable>
            </Link>
          </View>
          <TransactionList transactions={dashboardData.recentTransactions} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 20,
  },
  summarySection: {
    marginBottom: 24,
  },
  transactionsSection: {
    flex: 1,
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
    color: '#FFFFFF',
  },
  seeAllButton: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
});