import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { roleService } from '@/services/api/role-service';
import { Button } from '@/components/ui/button';
import { Plus, Users, Shield } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { useAdminStore } from '@/stores/admin-store';
import { RoleType } from '@/types/api/role';

export const Route = createFileRoute('/client/roles/')({
    component: RolesList,
});

function RolesList() {
    const selectedClientId = useAdminStore((state) => state.selectedClientId);
    const navigate = useNavigate();

    const { data: roles, isLoading } = useQuery({
        queryKey: ['roles', selectedClientId],
        queryFn: () => roleService.getRoles(),
        enabled: !!selectedClientId
    });

    if (isLoading) {
        return <div className="p-8">Loading roles...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Roles</h2>
                    <p className="text-muted-foreground">
                        Manage roles and permissions for this client.
                    </p>
                </div>
                <Button asChild>
                    <Link to="/client/roles/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Role
                    </Link>
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No.</TableHead>
                            <TableHead>Role Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles?.items?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No roles found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            roles?.items?.map((role, index) => (
                                <TableRow key={role.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-muted-foreground" />
                                            {role.roleName}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={role.roleType === RoleType.System ? "secondary" : "outline"}>
                                            {role.roleType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={role.isActive ? "default" : "destructive"}>
                                            {role.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link to={`/client/roles/${role.id}`}>
                                                Manage
                                            </Link>
                                        </Button>
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
