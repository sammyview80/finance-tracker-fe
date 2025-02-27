import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

interface SummaryGridProps {
  monthlyIncome: number;
  monthlyExpenses: number;
  showBalance: boolean;
}

export const SummaryGrid: React.FC<SummaryGridProps> = ({
  monthlyIncome,
  monthlyExpenses,
  showBalance
}) => {
  return (
    <View style={styles.summaryGrid}>
      <View style={styles.summaryItem}>
        <View style={[styles.iconContainer, styles.incomeIcon]}>
          <FontAwesome name="arrow-up" size={20} color="#4CAF50" />
        </View>
        <View>
          <ThemedText style={styles.summaryLabel}>Income</ThemedText>
          <ThemedText style={styles.summaryAmount}>
            {showBalance ? `$${monthlyIncome.toFixed(2)}` : '*******'}
          </ThemedText>
        </View>
      </View>
      <View style={styles.summaryItem}>
        <View style={[styles.iconContainer, styles.expenseIcon]}>
          <FontAwesome name="arrow-down" size={20} color="#FF5252" />
        </View>
        <View>
          <ThemedText style={styles.summaryLabel}>Expenses</ThemedText>
          <ThemedText style={styles.summaryAmount}>
            {showBalance ? `$${monthlyExpenses.toFixed(2)}` : '*******'}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 20,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incomeIcon: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  expenseIcon: {
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});