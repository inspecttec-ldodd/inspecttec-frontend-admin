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
import { roleService } from "@/services/api/role-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const Route = createFileRoute("/client/roles/create")({
	component: CreateRole,
});

const roleSchema = z.object({
	roleName: z.string().min(1, "Role name is required"),
	isActive: z.boolean(),
});

type RoleFormValues = z.infer<typeof roleSchema>;

function CreateRole() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const form = useForm<RoleFormValues>({
		resolver: zodResolver(roleSchema),
		defaultValues: {
			roleName: "",
			isActive: true,
		},
	});

	const createMutation = useMutation({
		mutationFn: roleService.createRole,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["roles"] });
			toast.success("Role created successfully");
			navigate({ to: "/client/roles" });
		},
		onError: () => toast.error("Failed to create role"),
	});

	function onSubmit(data: RoleFormValues) {
		createMutation.mutate(data);
	}

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate({ to: "/client/roles" })}
				>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<div>
					<h2 className="text-3xl font-bold tracking-tight">
						Create Role
					</h2>
					<p className="text-muted-foreground">
						Define a new role for this client.
					</p>
				</div>
			</div>

			<div className="border rounded-lg p-6 bg-card">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							control={form.control}
							name="roleName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role Name</FormLabel>
									<FormControl>
										<Input
											placeholder="e.g. Field Inspector"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Unique name for the role.
									</FormDescription>
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
											Role can be assigned to users.
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
									navigate({ to: "/client/roles" })
								}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={createMutation.isPending}
							>
								{createMutation.isPending && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Create Role
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
