import type { PaginatedResult } from "./common";

export enum RoleType {
	System = "System",
	Custom = "Custom",
}

export interface RoleItem {
	id: string;
	roleName: string;
	roleType: RoleType;
	isActive: boolean;
	description?: string;
	userCount?: number;
	permissions?: {
		id: string;
		permissionName: string;
		description?: string;
	}[];
	users?: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
	}[];
	userGroups?: {
		id: string;
		userGroupName: string;
		userGroupType: string;
		description?: string;
	}[];
}

export interface RoleListResult extends PaginatedResult<RoleItem> {}

export interface CreateRoleRequest {
	roleName: string;
	isActive: boolean;
	// Permissions might be assigned separately or here?
	// Based on RoleFunctions.CreateRole, it just takes Create.Request.
	// If backend CreateRequest doesn't have permissions list, then we create then assign.
	// I'll assume basic fields for now.
}

export interface UpdateRoleRequest {
	roleName: string;
	isActive: boolean;
}
