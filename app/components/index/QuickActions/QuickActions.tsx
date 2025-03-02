import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import TransactionModal from '@/app/components/index/TransactionList/TransactionModal';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

export const QuickActions: React.FC = () => {
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  return (
    <View style={styles.quickActions}>
      <Pressable 
        style={[
          styles.actionButton,
          {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }
        ]} 
        onPress={() => setShowIncomeModal(true)}
      >
        <View style={[styles.actionIcon, { backgroundColor: isDark ? 'rgba(76, 175, 80, 0.15)' : 'rgba(76, 175, 80, 0.1)' }]}>
          <FontAwesome name="plus" size={20} color={Colors[isDark ? 'dark' : 'light'].tint} />
        </View>
        <ThemedText style={styles.actionText}>Add Income</ThemedText>
      </Pressable>

      <Pressable 
        style={[
          styles.actionButton,
          {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }
        ]} 
        onPress={() => setShowExpenseModal(true)}
      >
        <View style={[styles.actionIcon, { backgroundColor: isDark ? 'rgba(175, 76, 76, 0.15)' : 'rgba(175, 76, 76, 0.1)' }]}>
          <FontAwesome name="minus" size={20} color={isDark ? "#FF5252" : "#E53935"} />
        </View>
        <ThemedText style={styles.actionText}>Add Expenses</ThemedText>
      </Pressable>

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
    </View>
  );
};

export default QuickActions;

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});