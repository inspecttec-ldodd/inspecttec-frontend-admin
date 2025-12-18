import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { userService } from '@/services/api/user-service';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const userSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.union([z.literal(""), z.string().email("Invalid email address")]),
    jobTitle: z.string().optional(),
    isActive: z.boolean().default(true),
});

type UserFormValues = z.infer<typeof userSchema>;

export const Route = createFileRoute('/client/users/create')({
    component: CreateUser,
});

function CreateUser() {
    const navigate = useNavigate();
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            jobTitle: '',
            isActive: true,
        },
    });

    async function onSubmit(data: UserFormValues) {
        try {
            await userService.createUser(data);
            toast.success("User created successfully");
            navigate({ to: '/client/users' });
        } catch (error) {
            toast.error("Failed to create user");
            console.error(error);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/client/users' })}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Create User</h2>
                    <p className="text-muted-foreground">
                        Add a new user to the client organization.
                    </p>
                </div>
            </div>

            <div className="border rounded-lg p-6 bg-card">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Jane" {...field} />
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
                                            <Input placeholder="Doe" {...field} />
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
                                        <Input placeholder="jane.doe@example.com" type="email" {...field} />
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
                                        <Input placeholder="Inspector" {...field} />
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
                                        <FormLabel>
                                            Active
                                        </FormLabel>
                                        <FormDescription>
                                            User can log in and access assigned resources.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => navigate({ to: '/client/users' })}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Create User
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
