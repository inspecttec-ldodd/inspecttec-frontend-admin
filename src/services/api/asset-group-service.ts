import { apiFetch } from "./api-client";
import { PaginatedResult, ApiResponse } from "@/types/api/common";
import { useAdminStore } from "@/stores/admin-store";

export interface AssetGroupSummary {
    id: string;
    description: string;
    isActive: boolean;
    assetCount: number;
}

export interface AssetGroupListResult extends PaginatedResult<AssetGroupSummary> {
    clientId: string;
    clientName: string;
}

export const assetGroupService = {
    /**
     * Get paginated list of asset groups for the current client
     */
    getAssetGroups: async (page = 1, pageSize = 100, search = ""): Promise<AssetGroupListResult> => {
        const clientId = useAdminStore.getState().selectedClientId;
        if (!clientId) throw new Error("No client selected");

        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
            search
        });

        const response = await apiFetch<ApiResponse<AssetGroupListResult>>(`/asset-groups?${params}`);
        return response.result;
    }
};
