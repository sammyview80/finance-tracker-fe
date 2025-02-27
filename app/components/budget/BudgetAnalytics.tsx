import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { BudgetItem, SavingsGoal } from '@/store/useBudgetStore';

interface BudgetAnalyticsProps {
  expenseItems: BudgetItem[];
  savingsGoals: SavingsGoal[];
}

export const BudgetAnalytics: React.FC<BudgetAnalyticsProps> = ({ expenseItems, savingsGoals }) => {
  // Calculate total expense amount and percentage for each category
  const totalExpenses = expenseItems.reduce((sum, item) => sum + item.actual, 0);
  
  const expenseCategories = expenseItems.map(item => ({
    category: item.category || '',
    amount: item.actual,
    percentage: (item.actual / totalExpenses) * 100
  }));
  
  // Sort categories by amount (highest first)
  expenseCategories.sort((a, b) => b.amount - a.amount);

  // Calculate total savings target and progress
  const totalSavingsTarget = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);
  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.saved, 0);
  const overallSavingsProgress = totalSavingsTarget > 0 ? (totalSaved / totalSavingsTarget) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Spending by Category Section */}
      <View style={styles.analyticsSection}>
        <ThemedText style={styles.sectionTitle}>Spending by Category</ThemedText>
        
        {/* Category bars */}
        {expenseCategories.map((cat, index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <ThemedText style={styles.categoryName}>{cat.category}</ThemedText>
              <ThemedText style={styles.categoryAmount}>${cat.amount.toFixed(2)}</ThemedText>
            </View>
            
            <View style={styles.categoryBarContainer}>
              <View 
                style={[
                  styles.categoryBar, 
                  { width: `${cat.percentage}%` },
                  getBarColor(index)
                ]} 
              />
            </View>
            
            <ThemedText style={styles.categoryPercentage}>
              {cat.percentage.toFixed(1)}%
            </ThemedText>
          </View>
        ))}
      </View>

      {/* Savings Summary Section */}
      <View style={styles.analyticsSection}>
        <ThemedText style={styles.sectionTitle}>Savings Summary</ThemedText>
        
        {/* Overall savings progress */}
        <View style={styles.savingsSummary}>
          <ThemedText style={styles.savingsSummaryText}>
            Overall Progress: ${totalSaved.toFixed(0)} / ${totalSavingsTarget.toFixed(0)}
          </ThemedText>
          
          <View style={styles.overallProgressContainer}>
            <View style={styles.progressBackground}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${overallSavingsProgress}%` }
                ]} 
              />
            </View>
            <ThemedText style={styles.progressText}>
              {overallSavingsProgress.toFixed(1)}%
            </ThemedText>
          </View>
        </View>

        {/* Monthly savings rate information */}
        <View style={styles.savingsRate}>
          <View style={styles.savingsRateItem}>
            <ThemedText style={styles.savingsRateLabel}>Monthly Target</ThemedText>
            <ThemedText style={styles.savingsRateValue}>$500.00</ThemedText>
          </View>
          <View style={styles.savingsRateDivider} />
          <View style={styles.savingsRateItem}>
            <ThemedText style={styles.savingsRateLabel}>Current Rate</ThemedText>
            <ThemedText style={styles.savingsRateValue}>$350.00</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
};

// Helper function to get color for category bars
const getBarColor = (index: number) => {
  const colors = [
    { backgroundColor: 'rgba(76, 175, 80, 0.8)' },  // Green
    { backgroundColor: 'rgba(33, 150, 243, 0.8)' }, // Blue
    { backgroundColor: 'rgba(255, 193, 7, 0.8)' },  // Yellow
    { backgroundColor: 'rgba(156, 39, 176, 0.8)' }, // Purple
    { backgroundColor: 'rgba(255, 87, 34, 0.8)' },  // Orange
    { backgroundColor: 'rgba(0, 188, 212, 0.8)' },  // Cyan
  ];
  
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  analyticsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoryItem: {
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryAmount: {
    fontSize: 14,
  },
  categoryBarContainer: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  categoryBar: {
    height: '100%',
    borderRadius: 6,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'right',
    marginTop: 2,
  },
  savingsSummary: {
    marginBottom: 16,
  },
  savingsSummaryText: {
    fontSize: 14,
    marginBottom: 8,
  },
  overallProgressContainer: {
    marginBottom: 16,
  },
  progressBackground: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3700B3',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'right',
  },
  savingsRate: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  savingsRateItem: {
    flex: 1,
    alignItems: 'center',
  },
  savingsRateDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
  },
  savingsRateLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    marginBottom: 4,
  },
  savingsRateValue: {
    fontSize: 18,
    fontWeight: '600',
  },
});