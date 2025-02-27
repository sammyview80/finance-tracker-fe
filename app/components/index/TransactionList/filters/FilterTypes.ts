export type FilterOptions = {
  type?: 'all' | 'income' | 'expense';
  sortBy?: 'date' | 'amount';
  sortOrder?: 'asc' | 'desc';
  fromDate?: Date | null;
  toDate?: Date | null;
  minAmount?: string;
  maxAmount?: string;
};