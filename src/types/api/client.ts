export interface Client {
    id: string;
    name: string;
    domainName: string | null;
    industry: string | null;
    isActive: boolean;
    userCount: number;
    assetCount: number;
    locationCount: number;
    createdDate: string;
    lastActivityDate: string | null;
}

export interface PaginatedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    result: T;
    status: number;
    messages: string[];
}
