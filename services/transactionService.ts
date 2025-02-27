import { FilterOptions } from "@/app/components/index/TransactionList/TransactionFilter";

// Temporary mock data for transactions
const mockTransactions = [
  {
    id: 't1',
    date: '2024-01-20',
    amount: 50.00,
    category: 'Food',
    description: 'Grocery shopping',
    type: 'expense' as const
  },
  {
    id: 't2',
    date: '2024-01-19',
    amount: 3000.00,
    category: 'Salary',
    description: 'Monthly salary',
    type: 'income' as const
  },
  {
    id: 't3',
    date: '2024-01-18',
    amount: 100.00,
    category: 'Transportation',
    description: 'Fuel',
    type: 'expense' as const
  },
  {
    id: 't4',
    date: '2024-01-17',
    amount: 200.00,
    category: 'Entertainment',
    description: 'Movie night',
    type: 'expense' as const
  },
  {
    id: 't5',
    date: '2024-01-16',
    amount: 500.00,
    category: 'Freelance',
    description: 'Web development project',
    type: 'income' as const
  },
  {
    id: 't6',
    date: '2024-01-15',
    amount: 1500.00,
    category: 'Rent',
    description: 'Monthly rent payment',
    type: 'expense' as const
  },
  {
    id: 't7',
    date: '2024-01-14',
    amount: 45.00,
    category: 'Food',
    description: 'Restaurant dinner',
    type: 'expense' as const
  },
  {
    id: 't8',
    date: '2024-01-13',
    amount: 2000.00,
    category: 'Bonus',
    description: 'Year-end bonus',
    type: 'income' as const
  },
  {
    id: 't9',
    date: '2024-01-12',
    amount: 35.00,
    category: 'Utilities',
    description: 'Electricity bill',
    type: 'expense' as const
  },
  {
    id: 't10',
    date: '2024-01-11',
    amount: 25.00,
    category: 'Subscription',
    description: 'Streaming service',
    type: 'expense' as const
  },
];

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
}

/**
 * Mock API service for transactions that applies filters
 */
export const transactionService = {
  /**
   * Get transactions with applied filters
   */
  getTransactions: async (filters: FilterOptions = {}): Promise<Transaction[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clone the transactions to avoid modifying the original data
    let filteredTransactions = [...mockTransactions];
    
    // Apply type filter
    if (filters.type && filters.type !== 'all') {
      filteredTransactions = filteredTransactions.filter(
        transaction => transaction.type === filters.type
      );
    }
    
    // Apply date range filter
    if (filters.fromDate) {
      const fromDate = new Date(filters.fromDate);
      filteredTransactions = filteredTransactions.filter(
        transaction => new Date(transaction.date) >= fromDate
      );
    }
    
    if (filters.toDate) {
      const toDate = new Date(filters.toDate);
      toDate.setHours(23, 59, 59, 999); // End of the day
      filteredTransactions = filteredTransactions.filter(
        transaction => new Date(transaction.date) <= toDate
      );
    }
    
    // Apply amount range filter
    if (filters.minAmount && filters.minAmount.trim() !== '') {
      const minAmount = parseFloat(filters.minAmount);
      if (!isNaN(minAmount)) {
        filteredTransactions = filteredTransactions.filter(
          transaction => transaction.amount >= minAmount
        );
      }
    }
    
    if (filters.maxAmount && filters.maxAmount.trim() !== '') {
      const maxAmount = parseFloat(filters.maxAmount);
      if (!isNaN(maxAmount)) {
        filteredTransactions = filteredTransactions.filter(
          transaction => transaction.amount <= maxAmount
        );
      }
    }
    
    // Apply sorting
    const sortBy = filters.sortBy || 'date';
    const sortOrder = filters.sortOrder || 'desc';
    
    filteredTransactions.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });
    
    return filteredTransactions;
  }
};