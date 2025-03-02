export interface ITotalBalance {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    savingsSummary: {
        totalSavingsTarget: number;
        totalSaved: number;
        savingsProgress: number;
        remainingToSave: number;
    };
    period: {
        startDate: string;
        endDate: string;
    };
}

export interface ITransaction {
    id: string;
    date: string;
    amount: number;
    category: string;
    description: string;
    type: 'expense' | 'income';
    createdAt?: string;
    updatedAt?: string;
}

export interface ITransactionsResponse {
    count: number;
    data: ITransaction[];
}

export interface IBudgetComparison {
    summary: {
        income: {
            budgeted: number;
            actual: number;
            difference: number;
            performance: number;
        };
        expenses: {
            budgeted: number;
            actual: number;
            difference: number;
            performance: number;
        };
        net: {
            budgeted: number;
            actual: number;
        };
    };
    incomeByCategory: {
        categoryId: string;
        categoryName: string;
        budgeted: number;
        actual: number;
        difference: number;
        items: any[];
    }[];
    expensesByCategory: {
        categoryId: string;
        categoryName: string;
        budgeted: number;
        actual: number;
        difference: number;
        items: any[];
    }[];
}

export interface ISpendingByCategory {
    categories: {
        categoryId: string;
        categoryName: string;
        amount: number;
        count: number;
        percentage: number;
    }[];
    totalSpending: number;
    period: {
        startDate: string;
        endDate: string;
    };
}

export interface IMonthlyTrend {
    month: string;
    income: number;
    expenses: number;
    balance: number;
    key: string;
}

export interface IMonthlyTrends {
    trends: IMonthlyTrend[];
    period: {
        months: number;
    };
}

export interface ISavingsProgress {
    goals: {
        id: string;
        categoryId: string;
        categoryName: string;
        target: number;
        saved: number;
        remaining: number;
        progress: number;
        isComplete: boolean;
    }[];
    summary: {
        totalGoals: number;
        completed: number;
        totalTarget: number;
        totalSaved: number;
        totalRemaining: number;
        overallProgress: number;
    };
}