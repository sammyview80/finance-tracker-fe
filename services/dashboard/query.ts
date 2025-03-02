import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../apiClient"
import { ENDPOINT } from "./endpoint"
import { IAPIResponse } from "../interface"
import { 
    ITotalBalance, 
    IBudgetComparison, 
    ISpendingByCategory, 
    IMonthlyTrends, 
    ISavingsProgress,
    ITransactionsResponse
} from "./interface"

// Financial Summary
export const getBalance = async () => {
    return await apiClient.get<ITotalBalance>(ENDPOINT.getBalance);
}

export const useGetBalance = () => {
    return useQuery({
        queryKey: [ENDPOINT.getBalance],
        queryFn: getBalance,
        staleTime: 60000,
        refetchOnWindowFocus: false,
        retry: 2,
    });
}

// Budget Comparison
export const getBudgetComparison = async () => {
    return await apiClient.get<IBudgetComparison>(ENDPOINT.getBudgetComparison);
}

export const useGetBudgetComparison = () => {
    return useQuery({
        queryKey: [ENDPOINT.getBudgetComparison],
        queryFn: getBudgetComparison,
        staleTime: 60000,
        refetchOnWindowFocus: false,
        retry: 2,
    });
}

// Spending by Category
export const getSpendingByCategory = async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const url = queryString ? `${ENDPOINT.getSpendingByCategory}?${queryString}` : ENDPOINT.getSpendingByCategory;
    
    return await apiClient.get<ISpendingByCategory>(url);
}

export const useGetSpendingByCategory = (startDate?: string, endDate?: string) => {
    return useQuery({
        queryKey: [ENDPOINT.getSpendingByCategory, startDate, endDate],
        queryFn: () => getSpendingByCategory(startDate, endDate),
        staleTime: 60000,
        refetchOnWindowFocus: false,
        retry: 2,
    });
}

// Monthly Trends
export const getMonthlyTrends = async (months?: number) => {
    const params = new URLSearchParams();
    if (months) params.append('months', months.toString());
    
    const queryString = params.toString();
    const url = queryString ? `${ENDPOINT.getMonthlyTrends}?${queryString}` : ENDPOINT.getMonthlyTrends;
    
    return await apiClient.get<IMonthlyTrends>(url);
}

export const useGetMonthlyTrends = (months?: number) => {
    return useQuery({
        queryKey: [ENDPOINT.getMonthlyTrends, months],
        queryFn: () => getMonthlyTrends(months),
        staleTime: 60000,
        refetchOnWindowFocus: false,
        retry: 2,
    });
}

// Savings Progress
export const getSavingsProgress = async () => {
    return await apiClient.get<ISavingsProgress>(ENDPOINT.getSavingsProgress);
}

export const useGetSavingsProgress = () => {
    return useQuery({
        queryKey: [ENDPOINT.getSavingsProgress],
        queryFn: getSavingsProgress,
        staleTime: 60000,
        refetchOnWindowFocus: false,
        retry: 2,
    });
}

// Recent Transactions
export const getTransactions = async (limit?: number) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const url = queryString ? `${ENDPOINT.getTransactions}?${queryString}` : ENDPOINT.getTransactions;
    
    return await apiClient.get<ITransactionsResponse>(url);
}

export const useGetTransactions = (limit?: number) => {
    return useQuery({
        queryKey: [ENDPOINT.getTransactions, limit],
        queryFn: () => getTransactions(limit),
        staleTime: 60000,
        refetchOnWindowFocus: false,
        retry: 2,
    });
}