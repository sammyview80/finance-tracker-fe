import { create } from 'zustand';

export interface BudgetItem {
  id: string;
  source?: string; // for income items
  category?: string; // for expense items
  budgeted: number;
  actual: number;
  difference: number;
}

export interface SavingsGoal {
  id: string;
  category: string;
  target: number;
  saved: number;
  remaining: number;
}

interface BudgetState {
  incomeItems: BudgetItem[];
  expenseItems: BudgetItem[];
  savingsGoals: SavingsGoal[];
  isLoading: boolean;
  error: string | null;
  
  fetchBudgetData: () => Promise<void>;
  addIncomeItem: (item: Omit<BudgetItem, 'id' | 'difference'>) => void;
  updateIncomeItem: (id: string, updates: Partial<BudgetItem>) => void;
  deleteIncomeItem: (id: string) => void;
  
  addExpenseItem: (item: Omit<BudgetItem, 'id' | 'difference'>) => void;
  updateExpenseItem: (id: string, updates: Partial<BudgetItem>) => void;
  deleteExpenseItem: (id: string) => void;
  
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'remaining'>) => void;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
}

// Sample data
const dummyIncomeItems: BudgetItem[] = [
  { id: '1', source: 'Salary', budgeted: 3000, actual: 3000, difference: 0 },
  { id: '2', source: 'Freelance', budgeted: 500, actual: 800, difference: 300 },
  { id: '3', source: 'Investments', budgeted: 200, actual: 150, difference: -50 },
];

const dummyExpenseItems: BudgetItem[] = [
  { id: '1', category: 'Rent/Mortgage', budgeted: 1000, actual: 1000, difference: 0 },
  { id: '2', category: 'Utilities', budgeted: 150, actual: 130, difference: 20 },
  { id: '3', category: 'Groceries', budgeted: 300, actual: 350, difference: -50 },
  { id: '4', category: 'Transportation', budgeted: 100, actual: 120, difference: -20 },
  { id: '5', category: 'Dining Out', budgeted: 50, actual: 75, difference: -25 },
  { id: '6', category: 'Entertainment', budgeted: 50, actual: 45, difference: 5 },
];

const dummySavingsGoals: SavingsGoal[] = [
  { id: '1', category: 'Emergency Fund', target: 5000, saved: 1500, remaining: 3500 },
  { id: '2', category: 'Vacation Fund', target: 2000, saved: 800, remaining: 1200 },
  { id: '3', category: 'Home Down Payment', target: 30000, saved: 5000, remaining: 25000 },
  { id: '4', category: 'Retirement Fund', target: 100000, saved: 10000, remaining: 90000 },
];

export const useBudgetStore = create<BudgetState>((set, get) => ({
  incomeItems: [],
  expenseItems: [],
  savingsGoals: [],
  isLoading: false,
  error: null,
  
  fetchBudgetData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set dummy data as if it came from an API
      set({
        incomeItems: dummyIncomeItems,
        expenseItems: dummyExpenseItems,
        savingsGoals: dummySavingsGoals,
        isLoading: false
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch budget data',
        isLoading: false
      });
    }
  },
  
  addIncomeItem: (item) => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      ...item,
      difference: item.actual - item.budgeted
    };
    
    set(state => ({
      incomeItems: [...state.incomeItems, newItem]
    }));
  },
  
  updateIncomeItem: (id, updates) => {
    set(state => ({
      incomeItems: state.incomeItems.map(item => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          // Recalculate difference if actual or budgeted amounts changed
          if ('actual' in updates || 'budgeted' in updates) {
            updated.difference = updated.actual - updated.budgeted;
          }
          return updated;
        }
        return item;
      })
    }));
  },
  
  deleteIncomeItem: (id) => {
    set(state => ({
      incomeItems: state.incomeItems.filter(item => item.id !== id)
    }));
  },
  
  addExpenseItem: (item) => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      ...item,
      difference: item.budgeted - item.actual // For expenses, positive means under budget
    };
    
    set(state => ({
      expenseItems: [...state.expenseItems, newItem]
    }));
  },
  
  updateExpenseItem: (id, updates) => {
    set(state => ({
      expenseItems: state.expenseItems.map(item => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          // Recalculate difference if actual or budgeted amounts changed
          if ('actual' in updates || 'budgeted' in updates) {
            updated.difference = updated.budgeted - updated.actual;
          }
          return updated;
        }
        return item;
      })
    }));
  },
  
  deleteExpenseItem: (id) => {
    set(state => ({
      expenseItems: state.expenseItems.filter(item => item.id !== id)
    }));
  },
  
  addSavingsGoal: (goal) => {
    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      ...goal,
      remaining: goal.target - goal.saved
    };
    
    set(state => ({
      savingsGoals: [...state.savingsGoals, newGoal]
    }));
  },
  
  updateSavingsGoal: (id, updates) => {
    set(state => ({
      savingsGoals: state.savingsGoals.map(goal => {
        if (goal.id === id) {
          const updated = { ...goal, ...updates };
          // Recalculate remaining if target or saved amounts changed
          if ('target' in updates || 'saved' in updates) {
            updated.remaining = updated.target - updated.saved;
          }
          return updated;
        }
        return goal;
      })
    }));
  },
  
  deleteSavingsGoal: (id) => {
    set(state => ({
      savingsGoals: state.savingsGoals.filter(goal => goal.id !== id)
    }));
  }
}));