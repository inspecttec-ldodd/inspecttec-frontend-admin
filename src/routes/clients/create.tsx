import { clientService } from "@/services/api/client-service";
import { useAdminStore } from "@/stores/admin-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createClientSchema = z.object({
	clientName: z.string().min(1, "Client Name is required"),
	domainName: z.string().optional(),
	email: z
		.string()
		.email("Invalid email address")
		.optional()
		.or(z.literal("")),
	phone: z.string().optional(),
	website: z.string().optional(),
	address1: z.string().optional(),
	address2: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	postalCode: z.string().optional(),
	timeZoneId: z.string(),
});

type CreateClientFormValues = z.infer<typeof createClientSchema>;

export const Route = createFileRoute("/clients/create")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { selectClient } = useAdminStore();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateClientFormValues>({
		resolver: zodResolver(createClientSchema),
		defaultValues: {
			timeZoneId: "America/New_York",
		},
	});

	const mutation = useMutation({
		mutationFn: (data: CreateClientFormValues) => {
			// Ensure optional empty strings are sent as null/undefined if preferred,
			// or just pass as is since Zod handles it.
			// Backend handles nulls, empty strings might be fine too but let's be clean.
			return clientService.createClient({
				...data,
				// Ensure we match the exact interface expected by CreateClientRequest
			});
		},
		onSuccess: (newClient) => {
			toast.success("Client created successfully");
			queryClient.invalidateQueries({ queryKey: ["clients"] });
			selectClient(newClient.id, newClient.clientName);
			navigate({ to: "/client/dashboard" });
		},
		onError: (error) => {
			toast.error(`Failed to create client: ${(error as Error).message}`);
		},
	});

	const onSubmit = (data: CreateClientFormValues) => {
		mutation.mutate(data);
	};

	return (
		<div className="max-w-4xl mx-auto space-y-8 pb-10">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Link
					to="/clients"
					className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
				>
					<ChevronLeft className="w-5 h-5 text-slate-500" />
				</Link>
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Onboard New Client
					</h1>
					<p className="text-slate-500 text-sm">
						Create a new tenant organization.
					</p>
				</div>
			</div>

			<div className="bg-white dark:bg-slate-900 rounded-lg border shadow-sm p-6">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
					{/* Section: Organization Details */}
					<div className="space-y-4">
						<h2 className="text-lg font-semibold border-b pb-2">
							Organization Details
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="grid gap-2">
								<label
									className="text-sm font-medium"
									htmlFor="clientName"
								>
									Organization Name{" "}
									<span className="text-red-500">*</span>
								</label>
								<input
									id="clientName"
									{...register("clientName")}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									placeholder="e.g. Acme Construction Inc."
								/>
								{errors.clientName && (
									<span className="text-xs text-red-500">
										{errors.clientName.message}
									</span>
								)}
							</div>

							<div className="grid gap-2">
								<label
									className="text-sm font-medium"
									htmlFor="domainName"
								>
									Domain (Optional)
								</label>
								<input
									id="domainName"
									{...register("domainName")}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									placeholder="e.g. acme.com"
								/>
							</div>

							<div className="grid gap-2">
								<label
									className="text-sm font-medium"
									htmlFor="website"
								>
									Website (Optional)
								</label>
								<input
									id="website"
									{...register("website")}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									placeholder="e.g. https://www.acme.com"
								/>
							</div>

							<div className="grid gap-2">
								<label
									className="text-sm font-medium"
									htmlFor="timeZoneId"
								>
									Time Zone
								</label>
								<select
									id="timeZoneId"
									{...register("timeZoneId")}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<option value="America/New_York">
										Eastern Time (US & Canada)
									</option>
									<option value="America/Chicago">
										Central Time (US & Canada)
									</option>
									<option value="America/Denver">
										Mountain Time (US & Canada)
									</option>
									<option value="America/Los_Angeles">
										Pacific Time (US & Canada)
									</option>
									<option value="UTC">UTC</option>
								</select>
							</div>
						</div>
					</div>

					{/* Section: Contact Information */}
					<div className="space-y-4">
						<h2 className="text-lg font-semibold border-b pb-2">
							Contact Information
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="grid gap-2">
								<label
									className="text-sm font-medium"
									htmlFor="email"
								>
									Contact Email (Optional)
								</label>
								<input
									id="email"
									type="email"
									{...register("email")}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									placeholder="e.g. info@acme.com"
								/>
								{errors.email && (
									<span className="text-xs text-red-500">
										{errors.email.message}
									</span>
								)}
							</div>

							<div className="grid gap-2">
								<label
									className="text-sm font-medium"
									htmlFor="phone"
								>
									Phone (Optional)
								</label>
								<input
									id="phone"
									type="tel"
									{...register("phone")}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									placeholder="e.g. +1 (555) 000-0000"
								/>
							</div>
						</div>
					</div>

					{/* Section: Address */}
					<div className="space-y-4">
						<h2 className="text-lg font-semibold border-b pb-2">
							Address
						</h2>

						<div className="grid gap-4">
							<div className="grid gap-2">
								<label
									className="text-sm font-medium"
									htmlFor="address1"
								>
									Address Line 1
								</label>
								<input
									id="address1"
									{...register("address1")}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									placeholder="Street address, P.O. box, c/o"
								/>
							</div>

							<div className="grid gap-2">
								<label
									className="text-sm font-medium"
									htmlFor="address2"
								>
									Address Line 2
								</label>
								<input
									id="address2"
									{...register("address2")}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									placeholder="Apartment, suite, unit, building, floor, etc."
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="grid gap-2">
									<label
										className="text-sm font-medium"
										htmlFor="city"
									>
										City
									</label>
									<input
										id="city"
										{...register("city")}
										className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									/>
								</div>
								<div className="grid gap-2">
									<label
										className="text-sm font-medium"
										htmlFor="state"
									>
										State / Province
									</label>
									<input
										id="state"
										{...register("state")}
										className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									/>
								</div>
								<div className="grid gap-2">
									<label
										className="text-sm font-medium"
										htmlFor="postalCode"
									>
										Postal Code
									</label>
									<input
										id="postalCode"
										{...register("postalCode")}
										className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="flex justify-end gap-3 pt-6 border-t">
						<Link
							to="/clients"
							className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
						>
							Cancel
						</Link>
						<button
							type="submit"
							disabled={mutation.isPending}
							className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
						>
							{mutation.isPending ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<Save className="w-4 h-4" />
							)}
							Create Client
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
