import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminState {
	// UI State
	isSidebarOpen: boolean;
	toggleSidebar: () => void;

	// Context State
	selectedClientId: string | null;
	selectedClientName: string | null;

	// Actions
	selectClient: (id: string, name: string) => void;
	clearClientContext: () => void;
}

export const useAdminStore = create<AdminState>()(
	persist(
		(set) => ({
			isSidebarOpen: true,
			toggleSidebar: () =>
				set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

			selectedClientId: null,
			selectedClientName: null,

			selectClient: (id, name) =>
				set({
					selectedClientId: id,
					selectedClientName: name,
				}),

			clearClientContext: () =>
				set({
					selectedClientId: null,
					selectedClientName: null,
				}),
		}),
		{
			name: "inspect-admin-storage",
		},
	),
);
