import { apiClient } from './apiClient';
import { FinancialData } from '@/types/finance';
import { IAPIResponse } from './interface';

export const getFinancialData = async (): Promise<IAPIResponse<FinancialData>> => {
  return await apiClient.get<FinancialData>('/api/v1/statistics/dashboard');
};