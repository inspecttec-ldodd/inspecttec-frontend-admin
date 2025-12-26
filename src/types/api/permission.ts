// Basic permission item
export interface PermissionItem {
	id: string;
	permissionName: string;
	description?: string;
	displayName?: string; // Some responses have this
	action?: string;
	scope?: string | null;
}

// Category structure from API
export interface PermissionCategory {
	categoryName: string;
	displayName: string;
	permissions: PermissionItem[];
}

// Response structure
export interface PermissionListResult {
	categories: PermissionCategory[];
	totalCount: number;
	// Helper to get flat list if needed
	items?: PermissionItem[];
}
