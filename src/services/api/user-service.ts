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

        // The backend returns a standard PaginatedResult structure with 'items'
        // NOT a custom structure with 'users' property as previously thought.
        // We map the raw items to our UserSummary type.
        const response = await apiFetch<ApiResponse<UserListResult>>(`/users?${params}`);
        return response.result;
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
