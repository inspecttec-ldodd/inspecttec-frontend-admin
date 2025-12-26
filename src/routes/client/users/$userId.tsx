import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { userService } from "@/services/api/user-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const Route = createFileRoute("/client/users/$userId")({
	component: UserDetail,
});

const userSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.union([z.literal(""), z.string().email("Invalid email address")]),
	jobTitle: z.string().optional(),
	isActive: z.boolean(),
});

type UserFormValues = z.infer<typeof userSchema>;

function UserDetail() {
	const { userId } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: user, isLoading } = useQuery({
		queryKey: ["user", userId],
		queryFn: () => userService.getUserById(userId),
	});

	const form = useForm<UserFormValues>({
		resolver: zodResolver(userSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			jobTitle: "",
			isActive: true,
		},
	});

	useEffect(() => {
		if (user) {
			form.reset({
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				jobTitle: user.jobTitle || "",
				isActive: user.isActive,
			});
		}
	}, [user, form]);

	const updateMutation = useMutation({
		mutationFn: (data: UserFormValues) =>
			userService.updateUser(userId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user", userId] });
			toast.success("User updated successfully");
		},
		onError: () => toast.error("Failed to update user"),
	});

	function onSubmit(data: UserFormValues) {
		updateMutation.mutate(data);
	}

	if (isLoading) return <div className="p-8">Loading...</div>;
	if (!user) return <div className="p-8">User not found</div>;

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate({ to: "/client/users" })}
				>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<div>
					<h2 className="text-3xl font-bold tracking-tight">
						Edit User
					</h2>
					<p className="text-muted-foreground">
						{user.firstName} {user.lastName}
					</p>
				</div>
			</div>

			<div className="border rounded-lg p-6 bg-card">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
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
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email (Optional)</FormLabel>
									<FormControl>
										<Input type="email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="jobTitle"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Job Title</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="isActive"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>Active</FormLabel>
										<FormDescription>
											User can log in and access assigned
											resources.
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() =>
									navigate({ to: "/client/users" })
								}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={updateMutation.isPending}
							>
								{updateMutation.isPending && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Save Changes
							</Button>
						</div>
					</form>
				</Form>
			</div>

			<div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm text-blue-800">
				To manage Group Assignments, please visit the{" "}
				<strong>User Groups</strong> section.
			</div>
		</div>
	);
}
