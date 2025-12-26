import { useAdminStore } from "@/stores/admin-store";
import type { ApiResponse } from "@/types/api/common";
import type {
	CreateLocationRequest,
	LocationListResult,
	LocationSummary,
	UpdateLocationRequest,
} from "@/types/api/location";
import { apiFetch } from "./api-client";

export const locationService = {
	/**
	 * Get paginated list of locations for the current client
	 */
	getLocations: async (
		page = 1,
		pageSize = 20,
		search = "",
	): Promise<LocationListResult> => {
		const clientId = useAdminStore.getState().selectedClientId;
		if (!clientId) throw new Error("No client selected");

		const params = new URLSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString(),
			search,
		});

		const response = await apiFetch<ApiResponse<LocationListResult>>(
			`/locations?${params}`,
		);
		return response.result;
	},

	/**
	 * Create a new location
	 */
	createLocation: async (
		data: Omit<CreateLocationRequest, "clientId">,
	): Promise<LocationSummary> => {
		const clientId = useAdminStore.getState().selectedClientId;
		if (!clientId) throw new Error("No client selected");

		const payload: CreateLocationRequest = {
			...data,
			clientId,
		};

		const response = await apiFetch<ApiResponse<LocationSummary>>(
			`/locations`,
			{
				method: "POST",
				body: JSON.stringify(payload),
			},
		);
		return response.result;
	},

	getLocationById: async (id: string): Promise<LocationSummary> => {
		// Assuming API supports this. If not, we might need to find it in the list or backend needs update.
		// Based on plan, we assume it exists.
		const response = await apiFetch<ApiResponse<LocationSummary>>(
			`/locations/${id}`,
		);
		return response.result;
	},

	updateLocation: async (
		id: string,
		data: UpdateLocationRequest,
	): Promise<LocationSummary> => {
		const response = await apiFetch<ApiResponse<LocationSummary>>(
			`/locations/${id}`,
			{
				method: "PUT",
				body: JSON.stringify(data),
			},
		);
		return response.result;
	},
};
