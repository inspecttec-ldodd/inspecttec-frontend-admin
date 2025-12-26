import type {
	ClientDetail,
	ClientSummary,
	CreateClientRequest,
	UpdateClientRequest,
} from "@/types/api/client";
import type { ApiResponse, PaginatedResult } from "@/types/api/common";
import { apiFetch } from "./api-client";

export const clientService = {
	/**
	 * Create a new client tenant
	 */
	createClient: async (data: CreateClientRequest): Promise<ClientSummary> => {
		const response = await apiFetch<ApiResponse<ClientSummary>>(
			"/clients",
			{
				method: "POST",
				body: JSON.stringify(data),
			},
		);
		return response.result;
	},

	/**
	 * Get paginated list of clients
	 */
	getClients: async (
		page = 1,
		pageSize = 25,
		search = "",
	): Promise<PaginatedResult<ClientSummary>> => {
		const params = new URLSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString(),
			search,
		});

		const response = await apiFetch<
			ApiResponse<PaginatedResult<ClientSummary>>
		>(`/clients?${params}`);
		return response.result;
	},

	/**
	 * Get single client details
	 */
	getClientById: async (id: string): Promise<ClientDetail> => {
		const response = await apiFetch<ApiResponse<ClientDetail>>(
			`/clients/${id}`,
		);
		return response.result;
	},

	updateClient: async (
		id: string,
		data: UpdateClientRequest,
	): Promise<ClientSummary> => {
		const response = await apiFetch<ApiResponse<ClientSummary>>(
			`/clients/${id}`,
			{
				method: "PUT",
				body: JSON.stringify(data),
			},
		);
		return response.result;
	},
};
