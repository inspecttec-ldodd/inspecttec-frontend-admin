import { useAdminStore } from "@/stores/admin-store";
import type {
	AssetGroupListResult,
	AssetGroupSummary,
	CreateAssetGroupRequest,
	UpdateAssetGroupRequest,
} from "@/types/api/asset-group";
import type { ApiResponse } from "@/types/api/common";
import { apiFetch } from "./api-client";

export const assetGroupService = {
	/**
	 * Get paginated list of asset groups for the current client
	 */
	getAssetGroups: async (
		page = 1,
		pageSize = 100,
		search = "",
	): Promise<AssetGroupListResult> => {
		const clientId = useAdminStore.getState().selectedClientId;
		if (!clientId) throw new Error("No client selected");

		const params = new URLSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString(),
			search,
		});

		// The endpoint is Admin_GetAllAssetGroups which returns ResultModel (containing Items, ClientId, ClientName)
		const response = await apiFetch<ApiResponse<AssetGroupListResult>>(
			`/asset-groups?${params}`,
		);
		return response.result;
	},

	getAssetGroupById: async (id: string): Promise<AssetGroupSummary> => {
		const response = await apiFetch<ApiResponse<AssetGroupSummary>>(
			`/asset-groups/${id}`,
		);
		return response.result;
	},

	createAssetGroup: async (
		data: CreateAssetGroupRequest,
	): Promise<AssetGroupSummary> => {
		const response = await apiFetch<ApiResponse<AssetGroupSummary>>(
			`/asset-groups`,
			{
				method: "POST",
				body: JSON.stringify(data),
			},
		);
		return response.result;
	},

	updateAssetGroup: async (
		id: string,
		data: UpdateAssetGroupRequest,
	): Promise<AssetGroupSummary> => {
		const response = await apiFetch<ApiResponse<AssetGroupSummary>>(
			`/asset-groups/${id}`,
			{
				method: "PUT",
				body: JSON.stringify(data),
			},
		);
		return response.result;
	},
};
