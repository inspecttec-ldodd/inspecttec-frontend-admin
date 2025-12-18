import { apiFetch } from "./api-client";
import { AssetSummary, AssetListResult, CreateAssetRequest, UpdateAssetRequest } from "@/types/api/asset";
import { ApiResponse } from "@/types/api/common";
import { useAdminStore } from "@/stores/admin-store";

export const assetService = {
    /**
     * Get paginated list of assets for the current client
     */
    getAssets: async (page = 1, pageSize = 50, search = ""): Promise<AssetListResult> => {
        const clientId = useAdminStore.getState().selectedClientId;
        if (!clientId) throw new Error("No client selected");

        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
            search
        });

        const response = await apiFetch<ApiResponse<AssetListResult>>(`/assets?${params}`);
        return response.result;
    },
    createAsset: async (data: Omit<CreateAssetRequest, 'clientId'>): Promise<AssetSummary> => {
        const clientId = useAdminStore.getState().selectedClientId;
        if (!clientId) throw new Error("No client selected");

        const payload: CreateAssetRequest = {
            ...data,
            clientId
        };

        const response = await apiFetch<ApiResponse<AssetSummary>>(`/assets`, {
            method: "POST",
            body: JSON.stringify(payload)
        });
        return response.result;
    },

    getAssetById: async (id: string): Promise<AssetSummary> => {
        const response = await apiFetch<ApiResponse<AssetSummary>>(`/assets/${id}`);
        return response.result;
    },

    updateAsset: async (id: string, data: UpdateAssetRequest): Promise<AssetSummary> => {
        const response = await apiFetch<ApiResponse<AssetSummary>>(`/assets/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        });
        return response.result;
    }
};
