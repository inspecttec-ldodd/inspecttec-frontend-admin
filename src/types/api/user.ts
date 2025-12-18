import { PaginatedResult } from "./common";

export interface UserSummary {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    jobTitle?: string;
    isActive: boolean;
    createdDate: string;
    lastLoginDate?: string;
    // roles?: string[]; // Roles might be direct or via group.
}

export interface UserListResult extends PaginatedResult<UserSummary> {
}

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
