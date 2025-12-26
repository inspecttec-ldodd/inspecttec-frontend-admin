import type { ApiResponse } from "@/types/api/common";
import type {
	CreateRoleRequest,
	RoleItem,
	RoleListResult,
	UpdateRoleRequest,
} from "@/types/api/role";
import { apiFetch } from "./api-client";

export const roleService = {
	getRoles: async (
		page = 1,
		pageSize = 50,
		search = "",
	): Promise<RoleListResult> => {
		const params = new URLSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString(),
			search,
		});
		// Backend returns { roles: [], ... } but we expect PaginatedResult { items: [] }
		// We define a temporary type for the raw response
		type RawRoleResponse = {
			roles: RoleItem[];
			totalCount: number;
			page: number;
			pageSize: number;
		};

		const response = await apiFetch<ApiResponse<RawRoleResponse>>(
			`/roles?${params}`,
		);

		return {
			items: response.result.roles,
			totalCount: response.result.totalCount,
			page: response.result.page,
			pageSize: response.result.pageSize,
			totalPages: Math.ceil(
				response.result.totalCount / response.result.pageSize,
			),
		};
	},

	getRoleById: async (roleId: string): Promise<RoleItem> => {
		const response = await apiFetch<ApiResponse<RoleItem>>(
			`/roles/${roleId}`,
		);
		return response.result;
	},

	createRole: async (data: CreateRoleRequest): Promise<RoleItem> => {
		const response = await apiFetch<ApiResponse<RoleItem>>(`/roles`, {
			method: "POST",
			body: JSON.stringify(data),
		});
		return response.result;
	},

	updateRole: async (
		roleId: string,
		data: UpdateRoleRequest,
	): Promise<RoleItem> => {
		const response = await apiFetch<ApiResponse<RoleItem>>(
			`/roles/${roleId}`,
			{
				method: "PUT",
				body: JSON.stringify(data),
			},
		);
		return response.result;
	},

	deleteRole: async (roleId: string): Promise<void> => {
		await apiFetch(`/roles/${roleId}`, {
			method: "DELETE",
		});
	},

	addPermission: async (
		roleId: string,
		permissionId: string,
	): Promise<void> => {
		await apiFetch(`/roles/${roleId}/permissions/${permissionId}`, {
			method: "POST",
		});
	},

	removePermission: async (
		roleId: string,
		permissionId: string,
	): Promise<void> => {
		await apiFetch(`/roles/${roleId}/permissions/${permissionId}`, {
			method: "DELETE",
		});
	},
};
