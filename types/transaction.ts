export interface Category {
  id: number;
  name: string;
  description: string;
  userId: number;
  isActive: boolean;
  created_at?: string | object;
  updated_at?: string | object;
}

export interface Source {
  id: string;
  name: string;
  description: string;
  userId: number;
  isActive: boolean;
  createdAt?: string | object;
  updatedAt?: string | object;
}

export interface Transaction {
  id: string;
  date: string | object;
  amount: number | string;
  categoryId?: number;
  sourceId?: string | null;
  userId?: number;
  description: string;
  type: 'income' | 'expense';
  createdAt?: string | object;
  updatedAt?: string | object;
  category?: Category | string;
  source?: Source | null;
}

export interface TransactionListProps {
  transactions: Transaction[];
  showHeader?: boolean;
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  hasMoreData?: boolean;
  onTransactionEdit?: () => void;
  onScroll?: (event: any) => void;
}

export interface TransactionItemProps {
  transaction: Transaction;
  onLongPress?: (transaction: Transaction) => void;
  onPress?: (transaction: Transaction) => void;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  totalCount?: number;
  hasMore?: boolean;
}

export type FilterOptions = {
  type?: 'all' | 'income' | 'expense';
  sortBy?: 'date' | 'amount';
  sortOrder?: 'asc' | 'desc';
  fromDate?: Date | null;
  toDate?: Date | null;
  minAmount?: string;
  maxAmount?: string;
  category?: string;
};