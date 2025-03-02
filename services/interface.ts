export interface IAPIResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code?: string;
        message?: string;
        details?: any;
    };
    meta?: {
        count?: number;
        page?: number;
        pageSize?: number;
    };
}

export interface IErrorResponse {
    success: boolean;
    error: {
        code: string;
        message: string;
        details?: any;
    };
}