import { clientService } from "@/services/api/client-service";
import { useAdminStore } from "@/stores/admin-store";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/clients/")({
	component: ClientsList,
});

function ClientsList() {
	const [page, setPage] = useState(1);
	const { selectClient } = useAdminStore();

	const { data, isLoading, error } = useQuery({
		queryKey: ["clients", page],
		queryFn: () => clientService.getClients(page),
	});

	const handleManageClient = (id: string, name: string) => {
		selectClient(id, name);
	};

	if (error) {
		return (
			<div className="p-4 text-red-500">
				Error loading clients: {(error as Error).message}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Clients
					</h1>
					<p className="text-slate-500 mt-1">
						Manage tenant organizations and subscriptions.
					</p>
				</div>
				<Link
					to="/clients/create"
					className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors"
				>
					<Plus className="w-4 h-4" />
					Onboard New Client
				</Link>
			</div>

			<div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg border shadow-sm">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
					<input
						type="text"
						placeholder="Search clients..."
						className="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-transparent"
					/>
				</div>
			</div>

			<div className="bg-white dark:bg-slate-900 rounded-lg border shadow-sm overflow-hidden">
				<table className="w-full text-sm text-left">
					<thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-medium border-b">
						<tr>
							<th className="px-6 py-3">Organization</th>
							<th className="px-6 py-3">Domain</th>
							<th className="px-6 py-3">Status</th>
							<th className="px-6 py-3">Users</th>
							<th className="px-6 py-3">Assets</th>
							<th className="px-6 py-3">Locations</th>
							<th className="px-6 py-3 text-right">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
						{isLoading ? (
							<tr>
								<td
									colSpan={7}
									className="p-8 text-center text-slate-500"
								>
									Loading clients...
								</td>
							</tr>
						) : (
							data?.items.map((client) => (
								<tr
									key={client.id}
									className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
								>
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
												{client.name
													.substring(0, 2)
													.toUpperCase()}
											</div>
											<div>
												<div className="font-medium text-slate-900 dark:text-slate-100">
													{client.name}
												</div>
												<div className="text-xs text-slate-500">
													{new Date(
														client.createdDate,
													).toLocaleDateString()}
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 text-slate-600">
										{client.domainName || "-"}
									</td>
									<td className="px-6 py-4">
										<span
											className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                    ${client.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
										>
											{client.isActive
												? "Active"
												: "Inactive"}
										</span>
									</td>
									<td className="px-6 py-4 text-slate-600 font-mono">
										{client.userCount}
									</td>
									<td className="px-6 py-4 text-slate-600 font-mono">
										{client.assetCount}
									</td>
									<td className="px-6 py-4 text-slate-600 font-mono">
										{client.locationCount}
									</td>
									<td className="px-6 py-4 text-right">
										<button
											onClick={() =>
												handleManageClient(
													client.id,
													client.name,
												)
											}
											className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 hover:border-blue-400 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-all"
										>
											Manage Context
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
