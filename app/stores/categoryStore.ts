import { create } from 'zustand';

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

interface CategoryStore {
  categories: Category[];
  fetchCategories: () => Promise<void>;
}

const dummyCategories: Category[] = [
  { id: '1', name: 'Salary', type: 'income' },
  { id: '2', name: 'Freelance', type: 'income' },
  { id: '3', name: 'Investments', type: 'income' },
  { id: '4', name: 'Food', type: 'expense' },
  { id: '5', name: 'Transport', type: 'expense' },
  { id: '6', name: 'Shopping', type: 'expense' },
];

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  fetchCategories: async () => {
    // Simulating API call with dummy data
    setTimeout(() => {
      set({ categories: dummyCategories });
    }, 500);
  },
}));

export default useCategoryStore;
