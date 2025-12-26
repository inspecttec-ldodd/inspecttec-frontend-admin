export interface AssetGroupSummary {
	id: string;
	assetGroupName: string;
	description?: string;
	assetType?: number; // Enum value
	assetTypeName?: string;
	isActive: boolean;
	assetCount: number;
}

export interface AssetGroupListResult {
	items: AssetGroupSummary[];
	totalCount: number;
	clientId: string;
	clientName: string;
}

export interface CreateAssetGroupRequest {
	clientId: string;
	assetGroupName: string;
	description?: string;
	assetType?: number;
	isActive?: boolean;
}

export interface UpdateAssetGroupRequest {
	assetGroupName: string;
	description?: string;
	isActive: boolean;
}
