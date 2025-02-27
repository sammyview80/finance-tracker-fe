import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { BudgetItem } from '@/store/useBudgetStore';

interface BudgetTableProps {
  items: BudgetItem[];
  totalBudgeted: number;
  totalActual: number;
  totalDifference: number;
  type: 'income' | 'expense';
}

export const BudgetTable: React.FC<BudgetTableProps> = ({
  items,
  totalBudgeted,
  totalActual,
  totalDifference,
  type
}) => {
  const titleLabel = type === 'income' ? 'Source' : 'Category';
  const titleKey = type === 'income' ? 'source' : 'category';

  return (
    <>
      <View style={styles.summaryRow}>
        <ThemedText style={[styles.summaryText, styles.summaryLabel]}>
          Total {type === 'income' ? 'Income' : 'Expenses'}:
        </ThemedText>
        <ThemedText style={styles.summaryAmount}>
          ${totalActual.toFixed(2)} / ${totalBudgeted.toFixed(2)}
        </ThemedText>
        <ThemedText 
          style={[
            styles.summaryDifference, 
            totalDifference >= 0 ? styles.positiveAmount : styles.negativeAmount
          ]}
        >
          {totalDifference >= 0 ? '+' : ''}${Math.abs(totalDifference).toFixed(2)}
        </ThemedText>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <ThemedText style={[styles.tableHeaderText, { flex: 2 }]}>{titleLabel}</ThemedText>
        <ThemedText style={[styles.tableHeaderText, { flex: 1 }]}>Budget</ThemedText>
        <ThemedText style={[styles.tableHeaderText, { flex: 1 }]}>Actual</ThemedText>
        <ThemedText style={[styles.tableHeaderText, { flex: 1 }]}>Diff</ThemedText>
      </View>
      
      {/* Table Rows */}
      {items.map((item) => (
        <View key={item.id} style={styles.tableRow}>
          <ThemedText style={[styles.tableCell, { flex: 2 }]}>
            {type === 'income' ? item.source : item.category}
          </ThemedText>
          <ThemedText style={[styles.tableCell, { flex: 1 }]}>${item.budgeted}</ThemedText>
          <ThemedText style={[styles.tableCell, { flex: 1 }]}>${item.actual}</ThemedText>
          <ThemedText 
            style={[
              styles.tableCell, 
              { flex: 1 },
              item.difference >= 0 ? styles.positiveAmount : styles.negativeAmount
            ]}
          >
            {item.difference >= 0 ? '+' : ''}${Math.abs(item.difference)}
          </ThemedText>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryText: {
    fontSize: 16,
  },
  summaryLabel: {
    flex: 1,
    fontWeight: '600',
  },
  summaryAmount: {
    fontSize: 16,
    marginRight: 8,
  },
  summaryDifference: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'right',
  },
  positiveAmount: {
    color: '#4CAF50',
  },
  negativeAmount: {
    color: '#FF5252',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  tableHeaderText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#CCCCCC',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  tableCell: {
    fontSize: 14,
  },
});