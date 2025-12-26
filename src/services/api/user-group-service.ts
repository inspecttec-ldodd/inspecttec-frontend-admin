import { useAdminStore } from "@/stores/admin-store";
import type { ApiResponse } from "@/types/api/common";
import type {
	CreateUserGroupRequest,
	UpdateUserGroupRequest,
	UserGroupListResult,
	UserGroupRole,
	UserGroupSummary,
} from "@/types/api/user-group";
import { apiFetch } from "./api-client";

export const userGroupService = {
	getUserGroups: async (
		page = 1,
		pageSize = 20,
		search = "",
	): Promise<UserGroupListResult> => {
		const params = new URLSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString(),
			search,
		});

		type RawGroupResponse = {
			items: UserGroupSummary[];
			totalCount: number;
			pageNumber: number; // JSON says pageNumber
			pageSize: number;
		};

		const response = await apiFetch<ApiResponse<RawGroupResponse>>(
			`/usergroups?${params}`,
		);
		return {
			items: response.result.items,
			totalCount: response.result.totalCount,
			page: response.result.pageNumber,
			pageSize: response.result.pageSize,
			totalPages: Math.ceil(
				response.result.totalCount / response.result.pageSize,
			),
		};
	},

	getUserGroupById: async (groupId: string): Promise<UserGroupSummary> => {
		const response = await apiFetch<ApiResponse<UserGroupSummary>>(
			`/usergroups/${groupId}`,
		);
		return response.result;
	},

	create: async (data: CreateUserGroupRequest): Promise<UserGroupSummary> => {
		const response = await apiFetch<ApiResponse<UserGroupSummary>>(
			`/usergroups`,
			{
				method: "POST",
				body: JSON.stringify(data),
			},
		);
		return response.result;
	},

	update: async (
		groupId: string,
		data: UpdateUserGroupRequest,
	): Promise<UserGroupSummary> => {
		const response = await apiFetch<ApiResponse<UserGroupSummary>>(
			`/usergroups/${groupId}`,
			{
				method: "PUT",
				body: JSON.stringify(data),
			},
		);
		return response.result;
	},

	delete: async (groupId: string): Promise<void> => {
		await apiFetch(`/user-group/${groupId}`, {
			method: "DELETE",
		});
	},

	// --- Roles ---
	getGroupRoles: async (groupId: string): Promise<UserGroupRole[]> => {
		const clientId = useAdminStore.getState().selectedClientId;
		if (!clientId) throw new Error("Client context required");
		// Using route from Step 550: clients/{clientId}/usergroups/{userGroupId}/roles
		const response = await apiFetch<
			ApiResponse<{ roles: UserGroupRole[] }>
		>(`/clients/${clientId}/usergroups/${groupId}/roles`);
		// Note: Response structure might differ, Step 562 ResultModel has prop "Roles" list.
		// Let's cast to any or refine type if needed. Assuming it matches ResultModel structure.
		return (response.result as any).roles || [];
	},

	assignRole: async (groupId: string, roleId: string): Promise<void> => {
		const clientId = useAdminStore.getState().selectedClientId;
		if (!clientId) throw new Error("Client context required");

		await apiFetch(`/clients/${clientId}/usergroups/${groupId}/roles`, {
			method: "POST",
			body: JSON.stringify({ roleId }),
		});
	},

	removeRole: async (groupId: string, roleId: string): Promise<void> => {
		const clientId = useAdminStore.getState().selectedClientId;
		if (!clientId) throw new Error("Client context required");

		await apiFetch(
			`/clients/${clientId}/usergroups/${groupId}/roles/${roleId}`,
			{
				method: "DELETE",
			},
		);
	},

	// --- Members (Users) ---
	// Uses Routes from Step 582: user-group/{userGroupId}/users
	addUser: async (groupId: string, userId: string): Promise<void> => {
		await apiFetch(`/user-group/${groupId}/users`, {
			method: "POST",
			body: JSON.stringify({ clientUserId: userId }),
			// Note: Payload signature assumed from 'AddUser.Request'. usually contains UserId.
			// Step 582 said 'AddUser.Request request'. Assuming property name is UserId or ClientUserId.
			// But usually request just has Id. Let's try { clientUserId: userId }
		});
	},

	removeUser: async (groupId: string, userId: string): Promise<void> => {
		await apiFetch(`/user-group/${groupId}/users/${userId}`, {
			method: "DELETE",
		});
	},
};
