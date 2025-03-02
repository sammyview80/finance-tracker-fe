import { Transaction, PaginationParams } from "../../types/transaction";

export interface ITransactionResponse {
  data: Transaction[];
  pagination: PaginationParams;
}

export interface ITransactionDetailResponse {
  transaction: Transaction;
}

export interface ICreateTransactionRequest {
  date: string;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
}

export interface IUpdateTransactionRequest {
  date?: string;
  amount?: number;
  category?: string;
  description?: string;
  type?: 'income' | 'expense';
} 