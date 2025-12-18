import { PaginatedResult } from "./common";

export interface LocationSummary {
    id: string;
    locationName: string;
    locationNumber: number;
    city?: string;
    state?: string;
    isActive: boolean;
    isMainLocation: boolean;
    assetCount: number;
    createdDate: string;
}

export interface LocationListResult extends PaginatedResult<LocationSummary> {
    clientId: string;
    clientName: string;
}

export interface CreateLocationRequest {
    clientId: string;
    locationName: string;
    description?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    phone?: string;
    email?: string;
    timeZoneId?: string;
    isMainLocation: boolean;
    isActive?: boolean;
}

export interface UpdateLocationRequest {
    locationName: string;
    description?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    phone?: string;
    email?: string;
    timeZoneId?: string;
    isMainLocation: boolean;
    isActive: boolean;
}
