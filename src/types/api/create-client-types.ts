export interface CreateClientRequest {
    name: string;
    domainName?: string;
    adminEmail: string;
    adminName: string;
}

export interface CreateClientResponse {
    id: string; // The ID of the created client
    invitationLink?: string; // Optional if we return a link immediately
}
