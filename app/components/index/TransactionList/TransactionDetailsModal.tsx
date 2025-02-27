import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { BaseModal } from '@/app/components/common/Modal/BaseModal';
import { Transaction } from '@/types/transaction';
import { transactionSharedStyles } from './styles';

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  visible: boolean;
  onClose: () => void;
}

interface DetailRowProps {
  label: string;
  children: React.ReactNode;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, children }) => (
  <View style={styles.detailRow}>
    <ThemedText style={transactionSharedStyles.subtitle}>{label}</ThemedText>
    {children}
  </View>
);

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  transaction,
  visible,
  onClose
}) => {
  if (!transaction) return null;
  
  const isIncome = transaction.type === 'income';

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={transactionSharedStyles.modalHeader}>
        <ThemedText style={transactionSharedStyles.title}>Transaction Details</ThemedText>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <FontAwesome name="times" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={[
          styles.transactionIconLarge,
          isIncome ? transactionSharedStyles.incomeIconBackground : transactionSharedStyles.expenseIconBackground
        ]}>
          <FontAwesome 
            name={isIncome ? 'arrow-up' : 'arrow-down'} 
            size={24} 
            color={isIncome ? '#4CAF50' : '#FF5252'} 
          />
        </View>
        
        <DetailRow label="Amount">
          <ThemedText style={[
            transactionSharedStyles.amount,
            isIncome ? transactionSharedStyles.incomeText : transactionSharedStyles.expenseText
          ]}>
            {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
          </ThemedText>
        </DetailRow>
        
        <DetailRow label="Category">
          <ThemedText style={styles.detailValue}>{transaction.category}</ThemedText>
        </DetailRow>
        
        <DetailRow label="Description">
          <ThemedText style={styles.detailValue}>{transaction.description}</ThemedText>
        </DetailRow>
        
        <DetailRow label="Date">
          <ThemedText style={styles.detailValue}>{transaction.date}</ThemedText>
        </DetailRow>
        
        <DetailRow label="Transaction ID">
          <ThemedText style={styles.detailValue}>{transaction.id}</ThemedText>
        </DetailRow>
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    padding: 8,
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    ...transactionSharedStyles.row,
    ...transactionSharedStyles.spaceBetween,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  transactionIconLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
});