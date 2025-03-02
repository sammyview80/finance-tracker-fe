import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { BaseModal } from '@/app/components/common/Modal/BaseModal';
import { Transaction, Category } from '@/types/transaction';
import { transactionSharedStyles } from './styles';
import { TransactionModal } from './TransactionModal';

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  visible: boolean;
  onClose: () => void;
  onEdit?: () => void; // Callback for when a transaction is edited
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
  onClose,
  onEdit
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  
  if (!transaction) return null;
  
  const isIncome = transaction.type === 'income';

  // Get category name from category object or string
  const getCategoryName = (): string => {
    if (!transaction.category) return '';
    if (typeof transaction.category === 'string') return transaction.category;
    return transaction.category.name || '';
  };

  // Convert transaction to form data format for editing
  const getInitialFormData = () => {
    return {
      amount: typeof transaction.amount === 'number' ? transaction.amount.toString() : '0',
      category: getCategoryName(),
      date: new Date(transaction.date as string),
      remarks: transaction.description || ''
    };
  };

  // Handle successful edit
  const handleEditSuccess = () => {
    setShowEditModal(false);
    
    // Call the parent's onEdit callback if provided
    if (onEdit) {
      onEdit();
    }
    
    // Close the details modal
    onClose();
  };

  return (
    <>
      <BaseModal visible={visible} onClose={onClose}>
        <View style={transactionSharedStyles.modalHeader}>
          <ThemedText style={transactionSharedStyles.title}>Transaction Details</ThemedText>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              onPress={() => setShowEditModal(true)} 
              style={styles.editButton}
            >
              <FontAwesome name="pencil" size={18} color="#4CAF50" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="times" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
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
              {isIncome ? '+' : '-'}${typeof transaction.amount === 'number' ? transaction.amount.toFixed(2) : transaction.amount}
            </ThemedText>
          </DetailRow>
          
          <DetailRow label="Category">
            <ThemedText style={styles.detailValue}>{getCategoryName()}</ThemedText>
          </DetailRow>
          
          <DetailRow label="Description">
            <ThemedText style={styles.detailValue}>{transaction.description || ''}</ThemedText>
          </DetailRow>
          
          <DetailRow label="Date">
            <ThemedText style={styles.detailValue}>{transaction.date as string}</ThemedText>
          </DetailRow>
          
          <DetailRow label="Transaction ID">
            <ThemedText style={styles.detailValue}>{transaction.id}</ThemedText>
          </DetailRow>
        </View>
      </BaseModal>

      {/* Edit Transaction Modal */}
      <TransactionModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        type={isIncome ? 'income' : 'expense'}
        initialData={getInitialFormData()}
        isEditing={true}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
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