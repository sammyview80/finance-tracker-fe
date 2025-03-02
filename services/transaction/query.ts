import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "./service";
import { FilterOptions, Transaction } from "../../types/transaction";
import { IAPIResponse } from "../interface";
import { ITransactionResponse } from "./interface";
import { ENDPOINT } from "./endpoint";
import Toast from "react-native-toast-message";

// Query keys
export const QUERY_KEYS = {
  transactions: 'transactions',
  transaction: (id: string) => ['transaction', id],
};

// Get transactions with pagination and filtering
export const getTransactions = async (
  page: number = 1,
  pageSize: number = 10,
  filters?: FilterOptions
): Promise<ITransactionResponse> => {
  const response = await transactionService.getTransactions(filters, page, pageSize);
  
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch transactions');
  }
  
  return response.data;
};

// Get a single transaction by ID
export const getTransaction = async (id: string): Promise<Transaction> => {
  const response = await transactionService.getTransaction(id);
  
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch transaction');
  }
  
  return response.data;
};

// React Query hooks
export const useGetTransactions = (
  page: number = 1,
  pageSize: number = 10,
  filters?: FilterOptions
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.transactions, page, pageSize, filters],
    queryFn: () => getTransactions(page, pageSize, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetTransaction = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.transaction(id),
    queryFn: () => getTransaction(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Infinite query for pagination with infinite scrolling
export const useInfiniteTransactions = (
  pageSize: number = 10,
  filters?: FilterOptions
) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.transactions, 'infinite', pageSize, filters],
    queryFn: ({ pageParam = 1 }) => getTransactions(pageParam as number, pageSize, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage: ITransactionResponse) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutations
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Transaction>) => transactionService.createTransaction(data),
    onSuccess: () => {
      // Invalidate transactions query to refetch data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.transactions] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) => 
      transactionService.updateTransaction(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific transaction query
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transaction(variables.id) });
      // Invalidate transactions list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.transactions] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => transactionService.deleteTransaction(id),
    onSuccess: () => {
      // Invalidate transactions query to refetch data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.transactions] });
    },
  });
}; 