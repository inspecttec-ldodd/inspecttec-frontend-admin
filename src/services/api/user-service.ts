import { apiFetch } from "./api-client";
import { UserListResult, UserSummary, CreateUserRequest, UpdateUserRequest } from "@/types/api/user";
import { ApiResponse } from "@/types/api/common";

export const userService = {
    getUsers: async (page = 1, pageSize = 20, search = ""): Promise<UserListResult> => {
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
            search
        });

        type RawUserResponse = {
            items: UserSummary[];
            totalCount: number;
            pageNumber: number;
            pageSize: number;
        };

        const response = await apiFetch<ApiResponse<RawUserResponse>>(`/users?${params}`);
        return {
            items: response.result.items,
            totalCount: response.result.totalCount,
            page: response.result.pageNumber,
            pageSize: response.result.pageSize,
            totalPages: Math.ceil(response.result.totalCount / response.result.pageSize)
        };
    },

    getUserById: async (userId: string): Promise<UserSummary> => {
        const response = await apiFetch<ApiResponse<UserSummary>>(`/users/${userId}`);
        return response.result;
    },

    createUser: async (data: CreateUserRequest): Promise<UserSummary> => {
        const response = await apiFetch<ApiResponse<UserSummary>>(`/users`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return response.result;
    },

    updateUser: async (userId: string, data: UpdateUserRequest): Promise<UserSummary> => {
        const response = await apiFetch<ApiResponse<UserSummary>>(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return response.result;
    }
};
