import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

export interface SummaryGridProps {
  monthlyIncome: number;
  monthlyExpenses: number;
  showBalance: boolean;
  isLoading?: boolean;
}

export const SummaryGrid: React.FC<SummaryGridProps> = ({
  monthlyIncome,
  monthlyExpenses,
  showBalance,
  isLoading = false
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  if (isLoading) {
    return (
      <View style={styles.summaryGrid}>
        <View style={[
          styles.summaryItem, 
          styles.loadingItem,
          { 
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
          }
        ]}>
          <ActivityIndicator size="small" color={Colors[isDark ? 'dark' : 'light'].tint} />
        </View>
        <View style={[
          styles.summaryItem, 
          styles.loadingItem,
          { 
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
          }
        ]}>
          <ActivityIndicator size="small" color={isDark ? "#FF5252" : "#E53935"} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.summaryGrid}>
      <View style={[
        styles.summaryItem,
        { 
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
        }
      ]}>
        <View style={[
          styles.iconContainer, 
          { backgroundColor: isDark ? 'rgba(76, 175, 80, 0.15)' : 'rgba(76, 175, 80, 0.1)' }
        ]}>
          <FontAwesome name="arrow-up" size={20} color={Colors[isDark ? 'dark' : 'light'].tint} />
        </View>
        <View>
          <ThemedText style={styles.summaryLabel}>Income</ThemedText>
          <ThemedText style={styles.summaryAmount}>
            {showBalance ? `$${monthlyIncome.toFixed(2)}` : '*******'}
          </ThemedText>
        </View>
      </View>
      <View style={[
        styles.summaryItem,
        { 
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
        }
      ]}>
        <View style={[
          styles.iconContainer, 
          { backgroundColor: isDark ? 'rgba(255, 82, 82, 0.15)' : 'rgba(255, 82, 82, 0.1)' }
        ]}>
          <FontAwesome name="arrow-down" size={20} color={isDark ? "#FF5252" : "#E53935"} />
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
    padding: 16,
    borderRadius: 20,
    gap: 12,
  },
  loadingItem: {
    justifyContent: 'center',
    minHeight: 72,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
});