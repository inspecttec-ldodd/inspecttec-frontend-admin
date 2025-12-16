import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { MsalProvider } from "@azure/msal-react"
import { msalInstance } from "./services/auth/msalConfig"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'

// Create a new router instance
const router = createRouter({
    routeTree,
    context: {
        auth: undefined // Will populate later
    }
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const queryClient = new QueryClient()

// Initialize MSAL and then render
msalInstance.initialize().then(() => {
    // Handle redirect response if needed
    msalInstance.handleRedirectPromise().then((authResult) => {
        // Check if user is signed in
        const account = msalInstance.getActiveAccount();
        if (!account && msalInstance.getAllAccounts().length > 0) {
            msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
        }
        if (authResult?.account) {
            msalInstance.setActiveAccount(authResult.account);
        }

        const rootElement = document.getElementById('root')!
        if (!rootElement.innerHTML) {
            const root = ReactDOM.createRoot(rootElement)
            root.render(
                <React.StrictMode>
                    <QueryClientProvider client={queryClient}>
                        <MsalProvider instance={msalInstance}>
                            <RouterProvider router={router} />
                        </MsalProvider>
                    </QueryClientProvider>
                </React.StrictMode>,
            )
        }

    }).catch(e => {
        console.error(e);
    });
});
