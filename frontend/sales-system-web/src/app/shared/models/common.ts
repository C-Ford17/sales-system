export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: string[];
}
