import { apiFetch } from "./api-client";
import { Client, ApiResponse, PaginatedResult } from "@/types/api/client";
import { CreateClientRequest } from "@/types/api/create-client";

export const clientService = {
    /**
     * Create a new client tenant
     */
    createClient: async (data: CreateClientRequest): Promise<Client> => {
        const response = await apiFetch<ApiResponse<Client>>("/clients", {
            method: "POST",
            body: JSON.stringify(data)
        });
        return response.result;
    },

    /**
     * Get paginated list of clients
     */
    getClients: async (page = 1, pageSize = 25, search = ""): Promise<PaginatedResult<Client>> => {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        });

        if (search) {
            queryParams.append("search", search);
        }

        const response = await apiFetch<ApiResponse<PaginatedResult<Client>>>(`/clients?${queryParams.toString()}`);
        return response.result;
    },

    /**
     * Get single client details
     */
    getClientById: async (id: string): Promise<Client> => {
        const response = await apiFetch<ApiResponse<Client>>(`/clients/${id}`);
        return response.result;
    }
};
