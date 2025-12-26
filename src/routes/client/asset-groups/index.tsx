import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { assetGroupService } from "@/services/api/asset-group-service";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Box, MoreHorizontal, Plus, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/client/asset-groups/")({
	component: AssetGroupsList,
});

function AssetGroupsList() {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");

	const { data: result, isLoading } = useQuery({
		queryKey: ["asset-groups", search],
		queryFn: () => assetGroupService.getAssetGroups(1, 100, search),
	});

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">
						Asset Groups
					</h2>
					<p className="text-muted-foreground">
						Manage asset groups and their organization.
					</p>
				</div>
				<Button
					onClick={() =>
						navigate({ to: "/client/asset-groups/create" })
					}
				>
					<Plus className="mr-2 h-4 w-4" />
					Create Asset Group
				</Button>
			</div>

			<div className="flex items-center space-x-2">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search asset groups..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-8"
					/>
				</div>
			</div>

			<div className="border rounded-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Group Name</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Asset Type</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Assets</TableHead>
							<TableHead className="text-right">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="h-24 text-center"
								>
									Loading...
								</TableCell>
							</TableRow>
						) : result?.items?.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="h-24 text-center"
								>
									No asset groups found.
								</TableCell>
							</TableRow>
						) : (
							result?.items?.map((group) => (
								<TableRow key={group.id}>
									<TableCell className="font-medium">
										<div className="flex items-center gap-2">
											<Box className="w-4 h-4 text-muted-foreground" />
											{group.assetGroupName}
										</div>
									</TableCell>
									<TableCell>
										{group.description || "-"}
									</TableCell>
									<TableCell>
										{group.assetTypeName || "-"}
									</TableCell>
									<TableCell>
										<Badge
											variant={
												group.isActive
													? "default"
													: "secondary"
											}
										>
											{group.isActive
												? "Active"
												: "Inactive"}
										</Badge>
									</TableCell>
									<TableCell>{group.assetCount}</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													className="h-8 w-8 p-0"
												>
													<span className="sr-only">
														Open menu
													</span>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>
													Actions
												</DropdownMenuLabel>
												<DropdownMenuItem
													onClick={() =>
														navigate({
															to: "/client/asset-groups/$assetGroupId",
															params: {
																assetGroupId:
																	group.id,
															},
														})
													}
												>
													Manage Group
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
