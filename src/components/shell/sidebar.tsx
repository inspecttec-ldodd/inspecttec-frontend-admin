import { useAdminStore } from "@/stores/admin-store";
import { Link, useLocation } from "@tanstack/react-router";
import {
    LayoutDashboard,
    Users,
    Settings,
    Building2,
    LogOut,
    ChevronLeft,
    Database,
    FileCheck,
    AlertCircle,
    MapPin,
    Box
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
    const { selectedClientId, selectedClientName, clearClientContext } = useAdminStore();
    const location = useLocation();

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800">
            {/* Header */}
            <div className="h-14 flex items-center px-4 border-b border-slate-800">
                <span className="font-bold text-white text-lg tracking-tight">InspectTec <span className="text-blue-500">Admin</span></span>
            </div>

            {/* Context Switcher / Indicator */}
            {selectedClientId ? (
                <div className="px-4 py-3 bg-blue-900/20 border-b border-blue-900/50">
                    <div className="text-xs font-medium text-blue-400 uppercase mb-1">Managing Client</div>
                    <div className="text-sm font-bold text-white truncate">{selectedClientName}</div>
                    <button
                        onClick={clearClientContext}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mt-2 transition-colors"
                    >
                        <ChevronLeft className="w-3 h-3" />
                        Back to Global Admin
                    </button>
                </div>
            ) : (
                <div className="px-4 py-3 border-b border-slate-800">
                    <div className="text-xs font-medium text-slate-500 uppercase">Context</div>
                    <div className="text-sm font-bold text-slate-200">Global Administration</div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">

                    {!selectedClientId ? (
                        /* Global Context Menu */
                        <>
                            <li>
                                <Link
                                    to="/"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white",
                                        isActive('/') && location.pathname === '/' && "bg-slate-800 text-white"
                                    )}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Link>
                            </li>
                            <li className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Platform
                            </li>
                            <li>
                                <Link
                                    to="/clients"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white",
                                        isActive('/clients') && "bg-slate-800 text-white"
                                    )}
                                >
                                    <Building2 className="w-4 h-4" />
                                    Clients
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/users"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white",
                                        isActive('/users') && "bg-slate-800 text-white"
                                    )}
                                >
                                    <Users className="w-4 h-4" />
                                    Global Admins
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/system/audit"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white",
                                        isActive('/system') && "bg-slate-800 text-white"
                                    )}
                                >
                                    <Settings className="w-4 h-4" />
                                    System Audit
                                </Link>
                            </li>
                        </>
                    ) : (
                        /* Client Context Menu */
                        <>
                            <li>
                                <Link
                                    to="/client/dashboard"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white",
                                        isActive('/client/dashboard') && "bg-slate-800 text-white"
                                    )}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Client Dashboard
                                </Link>
                            </li>

                            <li className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Asset Management
                            </li>
                            <li>
                                <Link to="/client/assets" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white">
                                    <Box className="w-4 h-4" />
                                    Assets
                                </Link>
                            </li>
                            <li>
                                <Link to="/client/locations" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white">
                                    <MapPin className="w-4 h-4" />
                                    Locations
                                </Link>
                            </li>

                            <li className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Inspection Config
                            </li>
                            <li>
                                <Link to="/client/checklists" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white">
                                    <FileCheck className="w-4 h-4" />
                                    Checklists
                                </Link>
                            </li>

                            <li className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Data & Users
                            </li>
                            <li>
                                <Link to="/client/users" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white">
                                    <Users className="w-4 h-4" />
                                    Users & Groups
                                </Link>
                            </li>
                            <li>
                                <Link to="/client/inspections" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white">
                                    <Database className="w-4 h-4" />
                                    Inspections
                                </Link>
                            </li>
                            <li>
                                <Link to="/client/resolutions" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white">
                                    <AlertCircle className="w-4 h-4" />
                                    Resolutions
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors w-full">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
