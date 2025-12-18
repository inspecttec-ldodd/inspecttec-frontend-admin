import { PaginatedResult } from "./common";

export interface AssetSummary {
    id: string;
    assetName: string;
    identifyingNumber?: string;
    serialNumber?: string;
    assetType?: number; // Enum
    assetTypeName?: string;
    locationId: string;
    locationName: string;
    assetGroupId: string;
    assetGroupName: string;
    isActive: boolean;
    currentStatus?: string;
    lastInspectionDate?: string;
}

export interface AssetListResult extends PaginatedResult<AssetSummary> {
    clientId: string;
    clientName: string;
    filters: AssetFilters;
}

export interface AssetFilters {
    locations: { id: string; name: string }[];
    assetGroups: { id: string; name: string }[];
}

export enum AssetType {
    Vehicle = "Vehicle",
    Equipment = "Equipment",
    Site = "Site",
    Building = "Building",
    Inventory = "Inventory",
    Other = "Other"
}

export interface CreateAssetRequest {
    clientId: string;
    locationId: string;
    assetGroupId: string;
    assetName: string;
    identifyingNumber?: string;
    serialNumber?: string;
    description?: string;
    assetType?: AssetType;
    manufacturerName?: string;
    modelNumber?: string;
    installationDate?: string; // DateOnly string YYYY-MM-DD
    isActive?: boolean;
}

export interface UpdateAssetRequest {
    locationId: string;
    assetGroupId: string;
    assetName: string;
    identifyingNumber?: string;
    serialNumber?: string;
    description?: string;
    assetType?: AssetType;
    manufacturerName?: string;
    modelNumber?: string;
    installationDate?: string;
    isActive: boolean;
}

