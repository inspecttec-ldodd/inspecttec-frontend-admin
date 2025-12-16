export interface IConfig {
    AZURE_AD_CLIENT_ID: string | undefined;
    AZURE_AD_TENANT_ID: string | undefined;
    REDIRECT_URI: string | undefined;
    SCOPES: string | undefined;
    APPINSIGHTS_CONNECTION_STRING: string | undefined;
    API_BASE_URL: string | undefined;
}

const Config: IConfig = {
    AZURE_AD_CLIENT_ID: process.env.REACT_APP_AZURE_AD_CLIENT_ID,
    AZURE_AD_TENANT_ID: process.env.REACT_APP_AZURE_AD_TENANT_ID,
    REDIRECT_URI: process.env.REACT_APP_REDIRECT_URI,
    SCOPES: process.env.REACT_APP_SCOPES,
    APPINSIGHTS_CONNECTION_STRING:
        process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING,
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:7091/api",
};

export default Config;
