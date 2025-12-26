import type { PaginatedResult } from "./common";

export interface UserSummary {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	displayName?: string; // Not in JSON, but we compute it UI side or optional
	primaryMobile?: string; // In JSON
	isActive: boolean;
	lastLoginDate?: string;

	// Fields expected by new model but missing in current JSON response
	// keeping them optional for now so TS doesn't complain if mapped manually
	roleCount?: number;
	groupCount?: number;
	invitationStatus?: string;
	createdDate?: string;
	jobTitle?: string;
}

export interface UserListResult extends PaginatedResult<UserSummary> {}

export interface CreateUserRequest {
	firstName: string;
	lastName: string;
	email: string;
	jobTitle?: string;
	password?: string; // Initial password? Or invite flow? Assuming backend handles or optional
	isActive: boolean;
	// userGroupIds?: string[]; // If payload supports it
}

export interface UpdateUserRequest {
	firstName: string;
	lastName: string;
	email: string; // Email usually immutable?
	jobTitle?: string;
	isActive: boolean;
}
