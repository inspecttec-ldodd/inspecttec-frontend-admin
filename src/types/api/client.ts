import { PaginatedResult } from "./common";

export interface ClientSummary {
    id: string;
    name: string;
    domainName?: string;
    industry?: string;
    isActive: boolean;
    userCount: number;
    assetCount: number;
    locationCount: number;
    createdDate: string;
    lastActivityDate?: string;
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
    timeZoneId?: string;
    isActive: boolean;
}
