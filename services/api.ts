import axios from 'axios';
import { FinancialData } from '@/types/finance';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getFinancialData = async (): Promise<FinancialData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        "totalBalance": 5000,
        "monthlyIncome": 3000,
        "monthlyExpenses": 2000,
        "recentTransactions": [
          {
            "id": "t1",
            "date": "2024-01-20",
            "amount": 50,
            "category": "Food",
            "description": "Grocery shopping",
            "type": "expense"
          },
          {
            "id": "t2",
            "date": "2024-01-19",
            "amount": 3000,
            "category": "Salary",
            "description": "Monthly salary",
            "type": "income"
          },
          {
            "id": "t3",
            "date": "2024-01-18",
            "amount": 100,
            "category": "Transportation",
            "description": "Fuel",
            "type": "expense"
          }
        ]
      });
    }, 5000);
  });
};