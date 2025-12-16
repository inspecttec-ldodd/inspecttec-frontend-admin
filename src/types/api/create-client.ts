import { Client } from "./client";

export interface CreateClientRequest {
    name: string;
    domainName?: string;
    adminEmail: string;
    adminName: string;
}

export const CLIENT_VALIDATION = {
    name: {
        required: "Organization name is required",
        minLength: 2,
        maxLength: 100
    },
    adminEmail: {
        required: "Admin email is required",
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address"
        }
    },
    adminName: {
        required: "Admin contact name is required"
    }
};
