import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBudgetStore } from '@/store/useBudgetStore';
import { TabSelector } from '@/app/components/budget/TabSelector';
import { BudgetTable } from '@/app/components/budget/BudgetTable';
import { SavingsGoalsView } from '@/app/components/budget/SavingsGoalsView';
import { BudgetAnalytics } from '@/app/components/budget/BudgetAnalytics';
import { TransactionModal } from '@/app/components/index/TransactionList/TransactionModal';
import logger from '@/utils/logger';

export default function BudgetScreen() {
  const navigation = useNavigation();
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('expenses');
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Get data and functions from budget store
  const { 
    incomeItems, 
    expenseItems, 
    savingsGoals, 
    isLoading, 
    error, 
    fetchBudgetData 
  } = useBudgetStore();

  // Calculate totals for income
  const totalBudgetedIncome = incomeItems.reduce((sum, item) => sum + item.budgeted, 0);
  const totalActualIncome = incomeItems.reduce((sum, item) => sum + item.actual, 0);
  const totalIncomeDifference = totalActualIncome - totalBudgetedIncome;

  // Calculate totals for expenses
  const totalBudgetedExpenses = expenseItems.reduce((sum, item) => sum + item.budgeted, 0);
  const totalActualExpenses = expenseItems.reduce((sum, item) => sum + item.actual, 0);
  const totalExpenseDifference = totalBudgetedExpenses - totalActualExpenses;

  // Fetch budget data on component mount
  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  // Handle adding a new goal (placeholder for now)
  const handleAddGoal = () => {
    // Implementation will be added later
    logger.log('Add new goal functionality to be implemented');
  };

  return (
    <ThemedView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ThemedText>Loading budget data...</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={fetchBudgetData}>
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 85 // Add padding for tab bar height
          }}
        >
          {/* Budget vs Actual Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Budget Overview</ThemedText>
            
            <TabSelector
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={[
                { id: 'expenses', label: 'Expenses' },
                { id: 'income', label: 'Income' }
              ]}
            />

            {activeTab === 'income' ? (
              <BudgetTable
                items={incomeItems}
                totalBudgeted={totalBudgetedIncome}
                totalActual={totalActualIncome}
                totalDifference={totalIncomeDifference}
                type="income"
              />
            ) : (
              <BudgetTable
                items={expenseItems}
                totalBudgeted={totalBudgetedExpenses}
                totalActual={totalActualExpenses}
                totalDifference={totalExpenseDifference}
                type="expense"
              />
            )}
          </View>

          {/* Analytics Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Analytics</ThemedText>
            <BudgetAnalytics 
              expenseItems={expenseItems} 
              savingsGoals={savingsGoals} 
            />
          </View>

          {/* Savings Goals Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Savings Goals</ThemedText>
            <SavingsGoalsView 
              goals={savingsGoals} 
              onAddGoal={handleAddGoal} 
            />
          </View>
        </ScrollView>
      )}

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, styles.fabExpense]}
          onPress={() => setShowExpenseModal(true)}
        >
          <FontAwesome name="minus" size={20} color="#FFFFFF" />
          <ThemedText style={styles.fabText}>Expense</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.fab, styles.fabIncome]}
          onPress={() => setShowIncomeModal(true)}
        >
          <FontAwesome name="plus" size={20} color="#FFFFFF" />
          <ThemedText style={styles.fabText}>Income</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Transaction Modals */}
      <TransactionModal 
        visible={showIncomeModal} 
        onClose={() => setShowIncomeModal(false)} 
        type="income" 
      />
      
      <TransactionModal
        visible={showExpenseModal} 
        onClose={() => setShowExpenseModal(false)} 
        type="expense" 
      />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  menuButton: {
    marginRight: 16,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  // Floating Action Button styles
  fabContainer: {
    position: 'absolute',
    bottom: 95, // Position above tab bar
    right: 16,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 28,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  fabIncome: {
    backgroundColor: '#4CAF50',
    minWidth: 120,
  },
  fabExpense: {
    backgroundColor: '#FF5252',
    minWidth: 120,
  },
  fabText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});