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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { userGroupService } from "@/services/api/user-group-service";
import { UserGroupType } from "@/types/api/user-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const Route = createFileRoute("/client/groups/create")({
	component: CreateGroup,
});

// ... (Schema implementation below)
const groupSchema = z.object({
	userGroupName: z.string().min(1, "Group name is required"),
	userGroupType: z.nativeEnum(UserGroupType, {
		errorMap: () => ({ message: "Please select a group type" }),
	}),
	isActive: z.boolean().default(true),
});

type GroupFormValues = z.infer<typeof groupSchema>;

function CreateGroup() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const form = useForm<GroupFormValues>({
		resolver: zodResolver(groupSchema),
		defaultValues: {
			userGroupName: "",
			isActive: true,
			// userGroupType is undefined strictly speaking but react-hook-form handles it
		},
	});

	const createMutation = useMutation({
		mutationFn: (data: GroupFormValues) =>
			userGroupService.create({
				...data,
				memberIds: [],
				roleIds: [],
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user-groups"] });
			toast.success("Group created successfully");
			navigate({ to: "/client/groups" });
		},
		onError: () => toast.error("Failed to create group"),
	});

	function onSubmit(data: GroupFormValues) {
		createMutation.mutate(data);
	}

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate({ to: "/client/groups" })}
				>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<div>
					<h2 className="text-3xl font-bold tracking-tight">
						Create User Group
					</h2>
					<p className="text-muted-foreground">
						Create a new group to organize users.
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
							name="userGroupName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Group Name</FormLabel>
									<FormControl>
										<Input
											placeholder="e.g. West Coast Inspectors"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="userGroupType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Group Type</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a group type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem
												value={UserGroupType.Inspectors}
											>
												Inspectors
											</SelectItem>
											<SelectItem
												value={
													UserGroupType.Instructors
												}
											>
												Instructors
											</SelectItem>
										</SelectContent>
									</Select>
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
											Group is active and can have
											members.
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
									navigate({ to: "/client/groups" })
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
								Create Group
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
