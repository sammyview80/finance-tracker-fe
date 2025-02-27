export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
}

export interface TransactionListProps {
  transactions: Transaction[];
  showHeader?: boolean;
}

export interface TransactionItemProps {
  transaction: Transaction;
  onLongPress: (transaction: Transaction) => void;
}