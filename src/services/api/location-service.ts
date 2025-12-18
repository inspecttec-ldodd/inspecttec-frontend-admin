import { apiFetch } from "./api-client";
import { LocationSummary, LocationListResult, CreateLocationRequest } from "@/types/api/location";
import { ApiResponse } from "@/types/api/common";
import { useAdminStore } from "@/stores/admin-store";

export const locationService = {
    /**
     * Get paginated list of locations for the current client
     */
    getLocations: async (page = 1, pageSize = 20, search = ""): Promise<LocationListResult> => {
        const clientId = useAdminStore.getState().selectedClientId;
        if (!clientId) throw new Error("No client selected");

        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
            search
        });

        const response = await apiFetch<ApiResponse<LocationListResult>>(`/locations?${params}`);
        return response.result;
    },

    /**
     * Create a new location
     */
    createLocation: async (data: Omit<CreateLocationRequest, 'clientId'>): Promise<LocationSummary> => {
        const clientId = useAdminStore.getState().selectedClientId;
        if (!clientId) throw new Error("No client selected");

        const payload: CreateLocationRequest = {
            ...data,
            clientId
        };

        const response = await apiFetch<ApiResponse<LocationSummary>>(`/locations`, {
            method: "POST",
            body: JSON.stringify(payload)
        });
        return response.result;
    }
};
