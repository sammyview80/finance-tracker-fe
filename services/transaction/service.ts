import { apiClient } from '../apiClient';
import { IAPIResponse } from '../interface';
import { Transaction, PaginationParams, FilterOptions } from '../../types/transaction';
import { ITransactionResponse } from './interface';
import { ENDPOINT } from './endpoint';
import logger from '../../utils/logger';

export const transactionService = {
  getTransactions: async (
    filters?: FilterOptions,
    page: number = 1,
    pageSize: number = 10
  ): Promise<IAPIResponse<ITransactionResponse>> => {
    logger.log('getTransactions called with:', { filters, page, pageSize });
    
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
        params.append('fromDate', filters.fromDate.toISOString().split('T')[0]);
      }
      
      if (filters.toDate) {
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
    const url = queryString ? `${ENDPOINT.getTransactions}?${queryString}` : ENDPOINT.getTransactions;
    logger.log('API URL:', url);
    
    try {
      const response = await apiClient.get<any>(url);
      logger.log('API Response structure:', {
        success: response.success,
        hasData: !!response.data,
        dataIsArray: Array.isArray(response.data),
        dataLength: Array.isArray(response.data) ? response.data.length : 'not an array',
        hasMeta: !!response.meta,
        metaStructure: response.meta ? Object.keys(response.meta) : 'no meta'
      });
      
      // Format the response to match our expected structure
      if (response.success) {
        // Check if the data is directly in response.data or nested
        let transactions = [];
        let meta: any = {};
        
        if (Array.isArray(response.data)) {
          // Data is an array of transactions
          transactions = response.data;
          meta = response.meta || {};
          logger.log('Direct array structure detected');
        } else if (response.data && typeof response.data === 'object') {
          // Data might be nested in response.data.data
          if (Array.isArray(response.data.data)) {
            transactions = response.data.data;
            meta = response.data.meta || response.meta || {};
            logger.log('Nested array structure detected');
          } else {
            // Single transaction or unknown structure
            logger.log('Unknown data structure:', typeof response.data);
            transactions = Array.isArray(response.data) ? response.data : [response.data];
          }
        }
        
        logger.log('Transactions array length:', transactions.length);
        logger.log('Meta information:', meta);
        
        try {
          logger.log('Processing transactions...');
          const processedTransactions = transactions.map((transaction: any, index: number) => {
            logger.log(`Processing transaction ${index}:`, transaction.id);
            
            // Check if transaction has the expected properties
            if (!transaction) {
              logger.error('Transaction is null or undefined');
              return null;
            }
            
            let date = transaction.date;
            try {
              // Handle different date formats safely
              if (!transaction.date) {
                // Handle null or undefined date
                date = 'No date';
              } else if (typeof transaction.date === 'string') {
                // Keep string dates as they are
                date = transaction.date;
              } else if (typeof transaction.date === 'number') {
                // Handle timestamp numbers
                const dateObj = new Date(transaction.date);
                if (!isNaN(dateObj.getTime())) {
                  date = dateObj.toISOString().split('T')[0];
                } else {
                  logger.warn(`Invalid numeric date for transaction ${transaction.id}:`, transaction.date);
                  date = 'Invalid date';
                }
              } else if (transaction.date instanceof Date) {
                // Handle Date objects
                if (!isNaN(transaction.date.getTime())) {
                  date = transaction.date.toISOString().split('T')[0];
                } else {
                  logger.warn(`Invalid Date object for transaction ${transaction.id}`);
                  date = 'Invalid date';
                }
              } else if (typeof transaction.date === 'object') {
                // Handle date-like objects
                if (Object.keys(transaction.date).length === 0) {
                  // Empty object
                  date = 'No date';
                } else if (transaction.date.year) {
                  // Object with year, month, day properties
                  try {
                    const dateObj = new Date(
                      transaction.date.year,
                      (transaction.date.month || 1) - 1,
                      transaction.date.day || 1
                    );
                    if (!isNaN(dateObj.getTime())) {
                      date = dateObj.toISOString().split('T')[0];
                    } else {
                      logger.warn(`Invalid date components for transaction ${transaction.id}:`, transaction.date);
                      date = 'Invalid date';
                    }
                  } catch (error) {
                    logger.error(`Error creating date from components for transaction ${transaction.id}:`, error);
                    date = 'Invalid date';
                  }
                } else {
                  // Try to create a date from the object
                  try {
                    const dateObj = new Date(transaction.date);
                    if (!isNaN(dateObj.getTime())) {
                      date = dateObj.toISOString().split('T')[0];
                    } else {
                      logger.warn(`Invalid date object for transaction ${transaction.id}:`, transaction.date);
                      date = 'Invalid date';
                    }
                  } catch (error) {
                    logger.error(`Error creating date from object for transaction ${transaction.id}:`, error);
                    date = 'Invalid date';
                  }
                }
              }
            } catch (error) {
              logger.error(`Error formatting date for transaction ${transaction.id}:`, error);
              date = 'Error formatting date';
            }
              
            const category = transaction.category && typeof transaction.category === 'object' 
              ? transaction.category.name 
              : transaction.category;
              
            const amount = typeof transaction.amount === 'string' 
              ? parseFloat(transaction.amount) 
              : transaction.amount;
              
            logger.log(`Transaction ${index} processed:`, { date, category, amount });
              
            return {
              ...transaction,
              date,
              category,
              amount
            };
          }).filter(Boolean); // Remove any null entries
          
          logger.log('Processed transactions:', processedTransactions.length);
          
          const res = {
            success: true,
            data: {
              data: processedTransactions,
              pagination: {
                page: meta.page || page,
                pageSize: meta.pageSize || pageSize,
                totalCount: meta.count || 0,
                hasMore: typeof meta.count === 'number' 
                  ? (page * pageSize) < meta.count
                  : false
              }
            }
          };
          logger.log('Returning response with data length:', res.data.data.length);
          return res;
        } catch (error) {
          logger.error('Error processing transactions:', error);
          throw error;
        }
      } else {
        logger.log('API request was not successful:', response.error);
      }
      
      return response as IAPIResponse<ITransactionResponse>;
    } catch (error) {
      logger.error('Error fetching transactions:', error);
      throw error;
    }
  },

  getTransaction: async (id: string): Promise<IAPIResponse<Transaction>> => {
    try {
      const response = await apiClient.get<any>(ENDPOINT.getTransaction(id));
      
      // If the API returns data in a different format, transform it here
      if (response.success && response.data) {
        // Transform the transaction data if needed
        const transaction = response.data;
        
        let date = transaction.date;
        try {
          // Handle different date formats safely
          if (!transaction.date) {
            // Handle null or undefined date
            date = 'No date';
          } else if (typeof transaction.date === 'string') {
            // Keep string dates as they are
            date = transaction.date;
          } else if (typeof transaction.date === 'number') {
            // Handle timestamp numbers
            const dateObj = new Date(transaction.date);
            if (!isNaN(dateObj.getTime())) {
              date = dateObj.toISOString().split('T')[0];
            } else {
              logger.warn(`Invalid numeric date for transaction ${transaction.id}:`, transaction.date);
              date = 'Invalid date';
            }
          } else if (transaction.date instanceof Date) {
            // Handle Date objects
            if (!isNaN(transaction.date.getTime())) {
              date = transaction.date.toISOString().split('T')[0];
            } else {
              logger.warn(`Invalid Date object for transaction ${transaction.id}`);
              date = 'Invalid date';
            }
          } else if (typeof transaction.date === 'object') {
            // Handle date-like objects
            if (Object.keys(transaction.date).length === 0) {
              // Empty object
              date = 'No date';
            } else if (transaction.date.year) {
              // Object with year, month, day properties
              try {
                const dateObj = new Date(
                  transaction.date.year,
                  (transaction.date.month || 1) - 1,
                  transaction.date.day || 1
                );
                if (!isNaN(dateObj.getTime())) {
                  date = dateObj.toISOString().split('T')[0];
                } else {
                  logger.warn(`Invalid date components for transaction ${transaction.id}:`, transaction.date);
                  date = 'Invalid date';
                }
              } catch (error) {
                logger.error(`Error creating date from components for transaction ${transaction.id}:`, error);
                date = 'Invalid date';
              }
            } else {
              // Try to create a date from the object
              try {
                const dateObj = new Date(transaction.date);
                if (!isNaN(dateObj.getTime())) {
                  date = dateObj.toISOString().split('T')[0];
                } else {
                  logger.warn(`Invalid date object for transaction ${transaction.id}:`, transaction.date);
                  date = 'Invalid date';
                }
              } catch (error) {
                logger.error(`Error creating date from object for transaction ${transaction.id}:`, error);
                date = 'Invalid date';
              }
            }
          }
        } catch (error) {
          logger.error(`Error formatting date for transaction ${transaction.id}:`, error);
          date = 'Error formatting date';
        }
        
        return {
          success: true,
          data: {
            ...transaction,
            // Use the safely processed date
            date,
            // Format category if needed
            category: transaction.category && typeof transaction.category === 'object' 
              ? transaction.category.name 
              : transaction.category,
            // Format amount as number if it's a string
            amount: typeof transaction.amount === 'string' 
              ? parseFloat(transaction.amount) 
              : transaction.amount
          }
        };
      }
      
      return response;
    } catch (error) {
      logger.error('Error fetching transaction:', error);
      throw error;
    }
  },

  createTransaction: async (data: Partial<Transaction>): Promise<IAPIResponse<Transaction>> => {
    try {
      // Format the request data to match the API expectations
      const requestData = {
        date: data.date,
        amount: data.amount,
        category: data.category,
        description: data.description,
        type: data.type
      };
      
      const response = await apiClient.post<Transaction>(ENDPOINT.createTransaction, requestData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateTransaction: async (id: string, data: Partial<Transaction>): Promise<IAPIResponse<Transaction>> => {
    try {
      // Format the request data to match the API expectations
      const requestData = {
        ...(data.date && { date: data.date }),
        ...(data.amount && { amount: data.amount }),
        ...(data.category && { category: data.category }),
        ...(data.description && { description: data.description }),
        ...(data.type && { type: data.type })
      };
      
      const response = await apiClient.put<Transaction>(ENDPOINT.updateTransaction(id), requestData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteTransaction: async (id: string): Promise<IAPIResponse<void>> => {
    try {
      const response = await apiClient.delete<void>(ENDPOINT.deleteTransaction(id));
      return response;
    } catch (error) {
      throw error;
    }
  }
}; 