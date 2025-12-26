import Config from "@/config/config";
import { msalInstance } from "@/services/auth/msalConfig";
import { useAdminStore } from "@/stores/admin-store";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

/**
 * Base HTTP client that handles auth headers automatically
 */
export async function apiFetch<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<T> {
	const account = msalInstance.getActiveAccount();
	if (!account) {
		throw new Error("No active account. Please sign in.");
	}

	// Get token silently
	let accessToken: string;
	try {
		const response = await msalInstance.acquireTokenSilent({
			scopes: (Config.SCOPES || "User.Read").split(" "),
			account: account,
		});
		accessToken = response.accessToken;
	} catch (error) {
		if (error instanceof InteractionRequiredAuthError) {
			// Fallback to interaction if silent fails
			// In a real app, you might trigger a popup or redirect here
			throw new Error("Interaction required for auth token.");
		}
		throw error;
	}

	// Check for selected client context
	const selectedClientId = useAdminStore.getState().selectedClientId;

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${accessToken}`,
		...(selectedClientId ? { "X-Tenant-ID": selectedClientId } : {}),
		...(options.headers as Record<string, string>),
	};

	const baseUrl = Config.API_BASE_URL?.replace(/\/+$/, "") || "";
	const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

	const response = await fetch(url, {
		...options,
		headers,
	});

	if (!response.ok) {
		throw new Error(`API Error: ${response.status} ${response.statusText}`);
	}

	// Handle no-content responses
	if (response.status === 204) {
		return {} as T;
	}

	return response.json();
}
