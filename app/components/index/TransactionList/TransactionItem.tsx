import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { TransactionItemProps } from '@/types/transaction';
import { transactionSharedStyles } from './styles';

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onLongPress,
}) => {
  const isIncome = transaction.type === 'income';
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.transactionItem,
        pressed && styles.transactionItemPressed
      ]}
      onLongPress={() => onLongPress(transaction)}
      delayLongPress={300}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
    >
      <View style={[
        styles.transactionIcon,
        isIncome ? transactionSharedStyles.incomeIconBackground : transactionSharedStyles.expenseIconBackground
      ]}>
        <FontAwesome 
          name={isIncome ? 'arrow-up' : 'arrow-down'} 
          size={16} 
          color={isIncome ? '#4CAF50' : '#FF5252'} 
        />
      </View>
      <View style={styles.transactionDetails}>
        <ThemedText style={[transactionSharedStyles.subtitle, styles.description]}>
          {transaction.description}
        </ThemedText>
        <ThemedText style={transactionSharedStyles.subtitle}>
          {transaction.category}
        </ThemedText>
      </View>
      <View style={styles.transactionAmount}>
        <ThemedText style={[
          transactionSharedStyles.amount,
          isIncome ? transactionSharedStyles.incomeText : transactionSharedStyles.expenseText
        ]}>
          {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
        </ThemedText>
        <ThemedText style={transactionSharedStyles.date}>{transaction.date}</ThemedText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  description: {
    marginBottom: 4,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionItemPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});