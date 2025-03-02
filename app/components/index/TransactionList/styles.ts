import { StyleSheet } from 'react-native';

export const transactionSharedStyles = StyleSheet.create({
  // Colors
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#FF5252',
  },
  
  // Icons
  incomeIconBackground: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  expenseIconBackground: {
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
  },
  
  // Text styles
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#999999',
  },
  
  // Common layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  // Modal
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 12,
  },
});

export default transactionSharedStyles;