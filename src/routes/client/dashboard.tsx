import { useAdminStore } from "@/stores/admin-store";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/client/dashboard")({
	component: ClientDashboard,
});

function ClientDashboard() {
	const { selectedClientName } = useAdminStore();

	if (!selectedClientName) {
		return (
			<div className="p-8 text-center text-slate-500">
				Please select a client from the Global View to manage.
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-slate-500 mt-1">
					Overview for {selectedClientName}
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white dark:bg-slate-900 p-6 rounded-lg border shadow-sm">
					<h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
						Quick Actions
					</h3>
					<div className="mt-4 space-y-2">
						<button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors text-sm font-medium text-slate-700">
							Create New Asset{" "}
							<ExternalLink className="w-4 h-4" />
						</button>
						<button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors text-sm font-medium text-slate-700">
							Draft Inspection{" "}
							<ExternalLink className="w-4 h-4" />
						</button>
					</div>
				</div>

				<div className="bg-white dark:bg-slate-900 p-6 rounded-lg border shadow-sm">
					<div className="text-4xl font-bold text-slate-900 dark:text-slate-100">
						12
					</div>
					<div className="text-sm text-slate-500 mt-1">
						Open Issues
					</div>
				</div>

				<div className="bg-white dark:bg-slate-900 p-6 rounded-lg border shadow-sm">
					<div className="text-4xl font-bold text-slate-900 dark:text-slate-100">
						98%
					</div>
					<div className="text-sm text-slate-500 mt-1">
						Compliance Score
					</div>
				</div>
			</div>
		</div>
	);
}
