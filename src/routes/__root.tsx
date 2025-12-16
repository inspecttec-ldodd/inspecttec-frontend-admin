import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
    component: () => (
        <>
            <div className="p-2 gap-2 text-lg border-b bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex gap-2">
                    <span className="font-bold px-2">InspectTec Admin</span>
                    <Link to="/" className="[&.active]:font-bold">
                        Home
                    </Link>
                </div>
            </div>
            <div className="p-2">
                <Outlet />
            </div>
            <TanStackRouterDevtools />
        </>
    ),
})
