import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { BudgetItem, SavingsGoal } from '@/store/useBudgetStore';
import { IBudgetComparison, ISpendingByCategory } from '@/services/dashboard/interface';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

export interface DashboardAnalyticsProps {
  expenseItems: BudgetItem[];
  savingsGoals: SavingsGoal[];
  compact?: boolean;
  spendingData?: ISpendingByCategory;
  budgetData?: IBudgetComparison;
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ 
  expenseItems, 
  savingsGoals,
  compact = false,
  spendingData,
  budgetData
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Use API data if available, otherwise use store data
  const useApiData = spendingData && budgetData;
  
  // Calculate total expense amount and percentage for each category
  let totalExpenses = 0;
  let expenseCategories: { category: string; amount: number; percentage: number }[] = [];
  
  if (useApiData && spendingData) {
    // Use API data
    totalExpenses = spendingData.totalSpending;
    expenseCategories = spendingData.categories.map(cat => ({
      category: cat.categoryName,
      amount: cat.amount,
      percentage: cat.percentage
    }));
  } else {
    // Use store data
    totalExpenses = expenseItems.reduce((sum, item) => sum + item.actual, 0);
    expenseCategories = expenseItems.map(item => ({
      category: item.category || '',
      amount: item.actual,
      percentage: (item.actual / totalExpenses) * 100
    }));
  }
  
  // Sort categories by amount (highest first) and limit to top categories if compact
  expenseCategories.sort((a, b) => b.amount - a.amount);
  const displayCategories = compact ? expenseCategories.slice(0, 3) : expenseCategories;

  // Calculate total savings target and progress
  let totalSavingsTarget = 0;
  let totalSaved = 0;
  let overallSavingsProgress = 0;
  
  if (useApiData && budgetData) {
    // Use budget comparison data for savings if available
    const savingsData = budgetData.summary;
    totalSavingsTarget = savingsData.expenses.budgeted;
    totalSaved = savingsData.expenses.actual;
    overallSavingsProgress = savingsData.expenses.performance;
  } else {
    // Use store data
    totalSavingsTarget = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);
    totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.saved, 0);
    overallSavingsProgress = totalSavingsTarget > 0 ? (totalSaved / totalSavingsTarget) * 100 : 0;
  }

  return (
    <View style={styles.container}>
      {/* Spending by Category Section */}
      <View style={styles.analyticsSection}>
        <ThemedText style={styles.sectionTitle}>Top Spending Categories</ThemedText>
        
        {displayCategories.length > 0 ? (
          <>
            {/* Category bars */}
            {displayCategories.map((cat, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <ThemedText style={styles.categoryName}>{cat.category}</ThemedText>
                  <ThemedText style={styles.categoryAmount}>${cat.amount.toFixed(0)}</ThemedText>
                </View>
                
                <View style={[
                  styles.categoryBarContainer,
                  { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }
                ]}>
                  <View 
                    style={[
                      styles.categoryBar, 
                      { width: `${Math.min(cat.percentage, 100)}%` },
                      getBarColor(index, isDark)
                    ]} 
                  />
                </View>
              </View>
            ))}
            
            {compact && expenseCategories.length > 3 && (
              <ThemedText style={styles.seeMoreText}>+ {expenseCategories.length - 3} more categories</ThemedText>
            )}
          </>
        ) : (
          <ThemedText style={styles.noDataText}>No spending data available</ThemedText>
        )}
      </View>

      {/* Savings Progress */}
      {!compact && (
        <View style={styles.analyticsSection}>
          <ThemedText style={styles.sectionTitle}>Savings Progress</ThemedText>
          <View style={styles.savingsSummary}>
            <ThemedText style={styles.savingsSummaryText}>
              Overall: ${totalSaved.toFixed(0)} / ${totalSavingsTarget.toFixed(0)}
            </ThemedText>
            
            <View style={[
              styles.progressBackground,
              { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }
            ]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${Math.min(overallSavingsProgress, 100)}%`,
                    backgroundColor: Colors[isDark ? 'dark' : 'light'].tint
                  }
                ]} 
              />
            </View>
            <ThemedText style={styles.progressText}>
              {overallSavingsProgress.toFixed(1)}%
            </ThemedText>
          </View>
        </View>
      )}
    </View>
  );
};

// Helper function to get color for category bars
const getBarColor = (index: number, isDark: boolean) => {
  const colors = isDark ? [
    { backgroundColor: 'rgba(76, 175, 80, 0.8)' },  // Green
    { backgroundColor: 'rgba(33, 150, 243, 0.8)' }, // Blue
    { backgroundColor: 'rgba(255, 193, 7, 0.8)' },  // Yellow
    { backgroundColor: 'rgba(156, 39, 176, 0.8)' }, // Purple
    { backgroundColor: 'rgba(255, 87, 34, 0.8)' },  // Orange
    { backgroundColor: 'rgba(0, 188, 212, 0.8)' },  // Cyan
  ] : [
    { backgroundColor: 'rgba(76, 175, 80, 0.7)' },  // Green
    { backgroundColor: 'rgba(33, 150, 243, 0.7)' }, // Blue
    { backgroundColor: 'rgba(255, 193, 7, 0.7)' },  // Yellow
    { backgroundColor: 'rgba(156, 39, 176, 0.7)' }, // Purple
    { backgroundColor: 'rgba(255, 87, 34, 0.7)' },  // Orange
    { backgroundColor: 'rgba(0, 188, 212, 0.7)' },  // Cyan
  ];
  
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  analyticsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryItem: {
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '500',
  },
  categoryAmount: {
    fontSize: 13,
  },
  categoryBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryBar: {
    height: '100%',
    borderRadius: 4,
  },
  categoryPercentage: {
    fontSize: 11,
    opacity: 0.7,
    textAlign: 'right',
    marginTop: 1,
  },
  seeMoreText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 5,
  },
  noDataText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  savingsSummary: {
    marginBottom: 12,
  },
  savingsSummaryText: {
    fontSize: 13,
    marginBottom: 6,
  },
  progressBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 11,
    opacity: 0.7,
    textAlign: 'right',
  },
});