import { PaginatedResult } from "./common";

export interface AssetGroupSummary {
    id: string;
    name: string;
    clientId: string;
    assetCount: number;
    isActive: boolean;
    createdDate: string;
}

export interface AssetGroupListResult extends PaginatedResult<AssetGroupSummary> {
    clientId: string;
    clientName: string;
}

export interface CreateAssetGroupRequest {
    clientId: string;
    groupName: string;
    description?: string;
    isActive?: boolean;
}

export interface UpdateAssetGroupRequest {
    groupName: string;
    description?: string;
    isActive: boolean;
}
