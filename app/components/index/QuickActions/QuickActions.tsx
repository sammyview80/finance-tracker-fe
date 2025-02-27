import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { TransactionModal } from '@/app/components/index/TransactionList/TransactionModal';

export const QuickActions: React.FC = () => {
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  return (
    <View style={styles.quickActions}>
      <Pressable style={styles.actionButton} onPress={() => setShowIncomeModal(true)}>
        <View style={[styles.actionIcon, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
          <FontAwesome name="plus" size={20} color="#4CAF50" />
        </View>
        <ThemedText style={styles.actionText}>Add Income</ThemedText>
      </Pressable>

      <Pressable style={styles.actionButton} onPress={() => setShowExpenseModal(true)}>
        <View style={[styles.actionIcon, { backgroundColor: 'rgba(175, 76, 76, 0.15)' }]}>
          <FontAwesome name="minus" size={20} color="#FF5252" />
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

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});