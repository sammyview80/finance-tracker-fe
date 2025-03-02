import { apiClient } from './apiClient';
import { IAPIResponse } from './interface';
import { Transaction, PaginationParams, FilterOptions } from '../types/transaction';

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

export interface TransactionResponse {
  data: Transaction[];
  pagination: PaginationParams;
}

export const transactionService = {
  getTransactions: async (
    filters?: FilterOptions,
    page: number = 1,
    pageSize: number = 10
  ): Promise<IAPIResponse<TransactionResponse>> => {
    // Build query parameters
    const params = new URLSearchParams();
    
    // Pagination params
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    
    // Filter params
    if (filters) {
      if (filters.type && filters.type !== 'all') {
        params.append('type', filters.type);
      }
      
      if (filters.sortBy) {
        params.append('sortBy', filters.sortBy);
      }
      
      if (filters.sortOrder) {
        params.append('sortOrder', filters.sortOrder);
      }
      
      if (filters.fromDate) {
        // Convert Date object to string in YYYY-MM-DD format
        params.append('fromDate', filters.fromDate.toISOString().split('T')[0]);
      }
      
      if (filters.toDate) {
        // Convert Date object to string in YYYY-MM-DD format
        params.append('toDate', filters.toDate.toISOString().split('T')[0]);
      }
      
      if (filters.minAmount) {
        params.append('minAmount', filters.minAmount);
      }
      
      if (filters.maxAmount) {
        params.append('maxAmount', filters.maxAmount);
      }
      
      if (filters.category) {
        params.append('category', filters.category);
      }
    }
    
    const queryString = params.toString();
    const url = queryString ? `/transactions?${queryString}` : '/transactions';
    
    return await apiClient.get<TransactionResponse>(url);
  },

  getTransaction: async (id: string): Promise<IAPIResponse<Transaction>> => {
    return await apiClient.get<Transaction>(`/transactions/${id}`);
  },

  createTransaction: async (data: Partial<Transaction>): Promise<IAPIResponse<Transaction>> => {
    return await apiClient.post<Transaction>('/transactions', data);
  },

  updateTransaction: async (id: string, data: Partial<Transaction>): Promise<IAPIResponse<Transaction>> => {
    return await apiClient.put<Transaction>(`/transactions/${id}`, data);
  },

  deleteTransaction: async (id: string): Promise<IAPIResponse<void>> => {
    return await apiClient.delete<void>(`/transactions/${id}`);
  }
};