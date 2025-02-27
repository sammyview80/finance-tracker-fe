import { create } from 'zustand';
import { FinancialData } from '@/types/finance';

interface FinanceStore {
  data: FinancialData | null;
  isLoading: boolean;
  setData: (data: FinancialData) => void;
  setLoading: (loading: boolean) => void;
}

export const useFinanceStore = create<FinanceStore>((set) => ({
  data: null,
  isLoading: false,
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ isLoading: loading }),
}));