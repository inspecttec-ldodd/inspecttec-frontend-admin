export interface ApiResponse<T> {
	result: T;
	isSuccess: boolean;
	errors: string[];
	requestTime: string;
	responseTime: string;
}

export interface PaginatedResult<T> {
	items: T[];
	totalCount: number;
	page: number;
	pageSize: number;
	totalPages: number;
}
