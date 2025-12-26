import {
	type Configuration,
	PublicClientApplication,
} from "@azure/msal-browser";

// Admin Portal is Single Tenant, so we construct the authority with the specific Tenant ID
const tenantId = process.env.REACT_APP_AZURE_AD_TENANT_ID || "common";
const authority = `https://login.microsoftonline.com/${tenantId}`;

const msalConfig: Configuration = {
	auth: {
		clientId: process.env.REACT_APP_AZURE_AD_CLIENT_ID || "",
		authority: authority,
		redirectUri:
			process.env.REACT_APP_REDIRECT_URI || window.location.origin,
		postLogoutRedirectUri:
			process.env.REACT_APP_REDIRECT_URI || window.location.origin,
		navigateToLoginRequestUrl: false,
	},
	cache: {
		cacheLocation: "sessionStorage",
		storeAuthStateInCookie: false,
	},
	system: {
		windowHashTimeout: 60000,
		iframeHashTimeout: 10000,
		asyncPopups: false,
		loggerOptions: {
			loggerCallback: (level, message, containsPii) => {
				if (containsPii) return;
				if (process.env.NODE_ENV === "development") {
					// Filter out noisy messages if needed, keeping simple for now
					console.log(`[MSAL] ${message}`);
				}
			},
			piiLoggingEnabled: false,
		},
	},
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest = {
	scopes: (process.env.REACT_APP_SCOPES || "User.Read").split(" "),
};
