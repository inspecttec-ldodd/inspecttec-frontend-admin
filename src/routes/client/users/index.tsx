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
import { userService } from "@/services/api/user-service";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MoreHorizontal, Plus, Search, User } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/client/users/")({
	component: UsersList,
});

function UsersList() {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");

	const { data: users, isLoading } = useQuery({
		queryKey: ["users", search],
		queryFn: () => userService.getUsers(1, 50, search),
	});

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Users</h2>
					<p className="text-muted-foreground">
						Manage client users and account access.
					</p>
				</div>
				<Button
					onClick={() => navigate({ to: "/client/users/create" })}
				>
					<Plus className="mr-2 h-4 w-4" />
					Create User
				</Button>
			</div>

			<div className="flex items-center space-x-2">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search users..."
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
							<TableHead>User</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Job Title</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="h-24 text-center"
								>
									Loading...
								</TableCell>
							</TableRow>
						) : users?.items?.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="h-24 text-center"
								>
									No users found.
								</TableCell>
							</TableRow>
						) : (
							users?.items?.map((user) => (
								<TableRow key={user.id}>
									<TableCell className="font-medium">
										<div className="flex items-center gap-2">
											<User className="w-4 h-4 text-muted-foreground" />
											{user.firstName} {user.lastName}
										</div>
									</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										{user.jobTitle || "-"}
									</TableCell>
									<TableCell>
										<Badge
											variant={
												user.isActive
													? "default"
													: "secondary"
											}
										>
											{user.isActive
												? "Active"
												: "Inactive"}
										</Badge>
									</TableCell>
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
															to: "/client/users/$userId",
															params: {
																userId: user.id,
															},
														})
													}
												>
													Edit User
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
