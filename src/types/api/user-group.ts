import type { PaginatedResult } from "./common";

export interface UserGroupSummary {
	id: string;
	userGroupName: string;
	description?: string; // Optional in UI, might be missing in JSON
	isActive: boolean;
	membersCount: number;
	userGroupType: string;
	members?: {
		id: string; // Membership ID or User ID? usage suggests Member info
		clientUserId: string;
		firstName: string;
		lastName: string;
		email: string;
		displayName: string;
		isActive: boolean;
		joinedDate: string;
	}[];
	groupRoles?: {
		id: string;
		roleName: string;
		roleType: string;
	}[];
}

export interface UserGroupListResult
	extends PaginatedResult<UserGroupSummary> {}

export enum UserGroupType {
	Inspectors = "Inspectors",
	Instructors = "Instructors",
}

export interface CreateUserGroupRequest {
	userGroupName: string;
	userGroupType: UserGroupType;
	isActive: boolean;
	memberIds: string[];
	roleIds: string[];
}

export interface UpdateUserGroupRequest {
	name: string;
	description?: string;
	isActive: boolean;
}

export interface UserGroupRole {
	roleId: string;
	roleName: string;
	roleType: string;
}

export interface AssignRoleRequest {
	roleId: string;
	// clientId? usually inferred or required by backend DTO, but service handles logic
}
