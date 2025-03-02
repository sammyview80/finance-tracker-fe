export const ENDPOINT = {
  getTransactions: '/api/v1/transactions',
  getTransaction: (id: string) => `/api/v1/transactions/${id}`,
  createTransaction: '/api/v1/transactions',
  updateTransaction: (id: string) => `/api/v1/transactions/${id}`,
  deleteTransaction: (id: string) => `/api/v1/transactions/${id}`,
}; 