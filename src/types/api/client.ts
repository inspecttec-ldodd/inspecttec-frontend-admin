import { PaginatedResult } from "@/types/api/common";


export interface ClientSummaryStats {
    totalUsers: number;
    activeUsers: number;
    totalLocations: number;
    activeLocations: number;
    totalAssetGroups: number;
    totalAssets: number;
    lastInspectionDate?: string;
}

export interface ClientDetail {
    id: string;
    clientName: string;
    domainName?: string;
    email?: string;
    phone?: string;
    website?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    isActive: boolean;
    timeZoneId: string;
    ownerUserId: string;
    tenantId?: string;
    stats: ClientSummaryStats;
}

export interface ClientSummary {
    id: string;
    name: string;
    clientName: string;
    domainName?: string;
    industry?: string;
    isActive: boolean;
    userCount: number;
    assetCount: number;
    locationCount: number;
    createdDate: string;
    lastActivityDate?: string;
    ownerUserId?: string;
    tenantId?: string;
}

export type ClientListResponse = PaginatedResult<ClientSummary>;

export interface CreateClientRequest {
    clientName: string;
    domainName?: string;
    email?: string; // Contact email
    phone?: string;
    website?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    timeZoneId?: string;
    isActive?: boolean;
}

export interface UpdateClientRequest {
    clientId: string;
    clientName: string;
    domainName?: string;
    email?: string;
    phone?: string;
    website?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    timeZoneId: string;
    ownerUserId: string;
    tenantId?: string;
}
