import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { Login } from "@/components/auth/login";
import { Sidebar } from "@/components/shell/sidebar";

export const Route = createRootRoute({
    component: () => (
        <>
            <AuthenticatedTemplate>
                <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
                    <Sidebar />
                    <main className="flex-1 overflow-auto flex flex-col">
                        <div className="flex-1 p-8">
                            <Outlet />
                        </div>
                    </main>
                </div>
                <TanStackRouterDevtools />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <Login />
            </UnauthenticatedTemplate>
        </>
    ),
})
