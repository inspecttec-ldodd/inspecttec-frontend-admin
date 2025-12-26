import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientService } from "@/services/api/client-service";
import { userService } from "@/services/api/user-service";
import { useAdminStore } from "@/stores/admin-store";
import type { UpdateClientRequest } from "@/types/api/client";
import type { UserSummary } from "@/types/api/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Edit2, Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const Route = createFileRoute("/client/details")({
	component: ClientDetails,
});

const clientSchema = z.object({
	clientName: z.string().min(1, "Client Name is required"),
	domainName: z.string().optional(),
	email: z.string().email("Invalid email").optional().or(z.literal("")),
	phone: z.string().optional(),
	website: z.string().url("Invalid URL").optional().or(z.literal("")),
	address1: z.string().optional(),
	address2: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	postalCode: z.string().optional(),
	timeZoneId: z.string().min(1, "Time Zone is required"),
	ownerUserId: z.string().min(1, "Owner User ID is required"),
	tenantId: z.string().optional(),
	// isActive removed from schema as it's not in update request
});

type ClientFormValues = z.infer<typeof clientSchema>;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Box, Calendar, MapPin, Users } from "lucide-react";

function ClientDetails() {
	const { selectedClientId } = useAdminStore();
	const queryClient = useQueryClient();
	const [isEditing, setIsEditing] = useState(false);

	// Fetch users for the owner selection dropdown
	const { data: users } = useQuery({
		queryKey: ["users"],
		queryFn: () => userService.getUsers(1, 100), // Fetch first 100 users for now
	});

	const { data: client, isLoading } = useQuery({
		queryKey: ["client", selectedClientId],
		queryFn: () =>
			selectedClientId
				? clientService.getClientById(selectedClientId)
				: null,
		enabled: !!selectedClientId,
	});

	const form = useForm<ClientFormValues>({
		resolver: zodResolver(clientSchema),
		defaultValues: {
			clientName: "",
			timeZoneId: "America/Los_Angeles",
			ownerUserId: "",
		},
	});

	useEffect(() => {
		if (client) {
			form.reset({
				clientName: client.clientName,
				domainName: client.domainName || "",
				email: client.email || "",
				phone: client.phone || "",
				website: client.website || "",
				address1: client.address1 || "",
				address2: client.address2 || "",
				city: client.city || "",
				state: client.state || "",
				postalCode: client.postalCode || "",
				timeZoneId: client.timeZoneId || "America/Los_Angeles",
				ownerUserId:
					client.ownerUserId ||
					"00000000-0000-0000-0000-000000000000",
				tenantId: client.tenantId || "",
			});
		}
	}, [client, form]);

	const updateMutation = useMutation({
		mutationFn: (data: UpdateClientRequest) => {
			if (!selectedClientId) throw new Error("No client selected");
			return clientService.updateClient(selectedClientId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["client", selectedClientId],
			});
			queryClient.invalidateQueries({ queryKey: ["clients"] });
			toast.success("Client updated successfully");
			setIsEditing(false);
		},
		onError: () => toast.error("Failed to update client"),
	});

	function onSubmit(data: ClientFormValues) {
		if (!selectedClientId) return;

		const updateData: UpdateClientRequest = {
			clientId: selectedClientId,
			clientName: data.clientName,
			domainName: data.domainName || undefined,
			email: data.email || undefined,
			phone: data.phone || undefined,
			website: data.website || undefined,
			address1: data.address1 || undefined,
			address2: data.address2 || undefined,
			city: data.city || undefined,
			state: data.state || undefined,
			postalCode: data.postalCode || undefined,
			timeZoneId: data.timeZoneId,
			ownerUserId: data.ownerUserId,
			tenantId: data.tenantId || undefined,
		};
		updateMutation.mutate(updateData);
	}

	if (!selectedClientId)
		return <div className="p-8">No client selected.</div>;
	if (isLoading) return <div className="p-8">Loading...</div>;
	if (!client) return <div className="p-8">Client not found.</div>;

	return (
		<div className="max-w-6xl mx-auto space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">
						Client Details
					</h2>
					<p className="text-muted-foreground">{client.clientName}</p>
				</div>
				{!isEditing && (
					<Button onClick={() => setIsEditing(true)}>
						<Edit2 className="mr-2 h-4 w-4" />
						Edit Details
					</Button>
				)}
			</div>

			{client.stats && (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Users
							</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{client.stats.activeUsers} /{" "}
								{client.stats.totalUsers}
							</div>
							<p className="text-xs text-muted-foreground">
								Active / Total Users
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Locations
							</CardTitle>
							<MapPin className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{client.stats.activeLocations} /{" "}
								{client.stats.totalLocations}
							</div>
							<p className="text-xs text-muted-foreground">
								Active / Total Locations
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Assets
							</CardTitle>
							<Box className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{client.stats.totalAssets}
							</div>
							<p className="text-xs text-muted-foreground">
								In {client.stats.totalAssetGroups} Groups
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Last Inspection
							</CardTitle>
							<Calendar className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{client.stats.lastInspectionDate
									? new Date(
											client.stats.lastInspectionDate,
										).toLocaleDateString()
									: "N/A"}
							</div>
							<p className="text-xs text-muted-foreground">
								Date of last activity
							</p>
						</CardContent>
					</Card>
				</div>
			)}

			<div className="border rounded-lg p-6 bg-card">
				{isEditing ? (
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6"
						>
							<FormField
								control={form.control}
								name="clientName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Client Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="domainName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Domain Name</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="example.com"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="website"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Website</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="https://..."
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phone</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="timeZoneId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Time Zone</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a timezone" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="America/Los_Angeles">
													America/Los_Angeles
												</SelectItem>
												<SelectItem value="America/New_York">
													America/New_York
												</SelectItem>
												<SelectItem value="America/Chicago">
													America/Chicago
												</SelectItem>
												<SelectItem value="America/Denver">
													America/Denver
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="ownerUserId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Owner User</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select an owner" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{users?.items?.map(
													(user: UserSummary) => (
														<SelectItem
															key={user.id}
															value={user.id}
														>
															{user.firstName}{" "}
															{user.lastName} (
															{user.email})
														</SelectItem>
													),
												)}
											</SelectContent>
										</Select>
										<FormDescription>
											The user who owns this client
											account.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<h3 className="font-medium mt-4">Address</h3>
							<FormField
								control={form.control}
								name="address1"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address Line 1</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="address2"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address Line 2</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-3 gap-4">
								<FormField
									control={form.control}
									name="city"
									render={({ field }) => (
										<FormItem>
											<FormLabel>City</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="state"
									render={({ field }) => (
										<FormItem>
											<FormLabel>State</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="postalCode"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Postal Code</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="flex justify-end gap-4 mt-6">
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsEditing(false)}
								>
									<X className="mr-2 h-4 w-4" />
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={updateMutation.isPending}
								>
									{updateMutation.isPending ? (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									) : (
										<Save className="mr-2 h-4 w-4" />
									)}
									Save Changes
								</Button>
							</div>
						</form>
					</Form>
				) : (
					<div className="space-y-6">
						<div className="grid grid-cols-2 gap-x-8 gap-y-4">
							<div>
								<Label className="text-muted-foreground">
									Client Name
								</Label>
								<div className="font-medium text-lg">
									{client.clientName}
								</div>
							</div>
							<div>
								<Label className="text-muted-foreground">
									Status
								</Label>
								<div
									className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${client.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
								>
									{client.isActive ? "Active" : "Inactive"}
								</div>
							</div>
							<div>
								<Label className="text-muted-foreground">
									Domain
								</Label>
								<div className="font-medium">
									{client.domainName || "-"}
								</div>
							</div>
							<div>
								<Label className="text-muted-foreground">
									Owner
								</Label>
								<div className="font-medium">
									{users?.items?.find(
										(u) => u.id === client.ownerUserId,
									) ? (
										`${users.items.find((u) => u.id === client.ownerUserId)?.firstName} ${users.items.find((u) => u.id === client.ownerUserId)?.lastName}`
									) : (
										<span className="text-xs font-mono">
											{client.ownerUserId}
										</span>
									)}
								</div>
							</div>

							<div>
								<Label className="text-muted-foreground">
									Email
								</Label>
								<div className="font-medium">
									{client.email || "-"}
								</div>
							</div>
							<div>
								<Label className="text-muted-foreground">
									Phone
								</Label>
								<div className="font-medium">
									{client.phone || "-"}
								</div>
							</div>
							<div>
								<Label className="text-muted-foreground">
									Time Zone
								</Label>
								<div className="font-medium">
									{client.timeZoneId}
								</div>
							</div>
						</div>

						<div>
							<Label className="text-muted-foreground mb-1 block">
								Address
							</Label>
							<div className="font-medium">
								{client.address1 && (
									<div>{client.address1}</div>
								)}
								{client.address2 && (
									<div>{client.address2}</div>
								)}
								{(client.city ||
									client.state ||
									client.postalCode) && (
									<div>
										{client.city}
										{client.city && client.state
											? ", "
											: ""}
										{client.state} {client.postalCode}
									</div>
								)}
								{!client.address1 && !client.city && (
									<div className="text-muted-foreground">
										-
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
