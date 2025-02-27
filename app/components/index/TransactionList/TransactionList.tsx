import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/ThemedText';
import { TransactionListProps, Transaction } from '@/types/transaction';
import { TransactionItem } from './TransactionItem';
import { TransactionDetailsModal } from './TransactionDetailsModal';

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, showHeader = false }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLongPress = (transaction: Transaction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>All Transactions</ThemedText>
        </View>
      )}
      
      {transactions.map(transaction => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onLongPress={handleLongPress}
        />
      ))}

      <TransactionDetailsModal
        transaction={selectedTransaction}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});