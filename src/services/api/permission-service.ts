import type { ApiResponse } from "@/types/api/common";
import type { PermissionListResult } from "@/types/api/permission";
import { apiFetch } from "./api-client";

export const permissionService = {
	/**
	 * Get all system permissions (paginated)
	 */
	getPermissions: async (
		page = 1,
		pageSize = 100,
		search = "",
	): Promise<PermissionListResult> => {
		const params = new URLSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString(),
			search,
		});

		type RawPermissionResponse = {
			categories: {
				categoryName: string;
				displayName: string;
				permissions: {
					id: string;
					permissionName: string;
					description: string;
					action: string;
					scope: string | null;
					displayName?: string;
				}[];
			}[];
			totalCount: number;
		};

		const response = await apiFetch<ApiResponse<RawPermissionResponse>>(
			`/permissions?${params}`,
		);

		// Flatten for existing components that expect 'items'
		const flatItems = response.result.categories.flatMap(
			(c) => c.permissions,
		);

		return {
			categories: response.result.categories,
			totalCount: response.result.totalCount,
			items: flatItems, // Injected for compatibility
		};
	},
};
