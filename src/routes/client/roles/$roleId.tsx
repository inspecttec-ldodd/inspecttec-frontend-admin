import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleService } from '@/services/api/role-service';
import { permissionService } from '@/services/api/permission-service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { RoleType } from '@/types/api/role';

export const Route = createFileRoute('/client/roles/$roleId')({
  component: RoleDetail,
});

function RoleDetail() {
  const { roleId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: role, isLoading: isLoadingRole } = useQuery({
    queryKey: ['role', roleId],
    queryFn: () => roleService.getRoleById(roleId),
  });

  const { data: allPermissions, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionService.getPermissions(),
  });

  const addPermissionMutation = useMutation({
    mutationFn: ({ roleId, permissionId }: { roleId: string; permissionId: string }) =>
      roleService.addPermission(roleId, permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role', roleId] });
      toast.success("Permission added");
    },
    onError: () => toast.error("Failed to add permission")
  });

  const removePermissionMutation = useMutation({
    mutationFn: ({ roleId, permissionId }: { roleId: string; permissionId: string }) =>
      roleService.removePermission(roleId, permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role', roleId] });
      toast.success("Permission removed");
    },
    onError: () => toast.error("Failed to remove permission")
  });

  const handlePermissionToggle = (permissionId: string, isChecked: boolean) => {
    if (isChecked) {
      addPermissionMutation.mutate({ roleId, permissionId });
    } else {
      removePermissionMutation.mutate({ roleId, permissionId });
    }
  };

  if (isLoadingRole || isLoadingPermissions) return <div className="p-8">Loading...</div>;
  if (!role) return <div className="p-8">Role not found</div>;

  // Determine System Role but allow editing
  const isSystemRole = role.roleType === RoleType.System;

  // Create Set of IDs from the Role's permissions (which are objects now)
  const assignedPermissionIds = new Set(role.permissions?.map(p => p.id) || []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/client/roles' })}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1">
          <div className="flex items-baseline gap-4 mb-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{role.roleName} Role Permissions</h1>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Badge variant={isSystemRole ? "secondary" : "outline"} className="text-sm px-3 py-1">
              {role.roleType}
            </Badge>
            <Badge variant={role.isActive ? "default" : "destructive"} className="text-sm px-3 py-1">
              {role.isActive ? "Active" : "Inactive"}
            </Badge>
            {role.description && <span className="border-l pl-2 ml-2">{role.description}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="border rounded-lg bg-card">
            <div className="p-4 border-b bg-muted/20">
              <h3 className="font-semibold text-lg">Permissions</h3>
              <p className="text-sm text-muted-foreground">
                Manage permissions for this role.
              </p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-6">
                {/* Iterate by Categories for better UI */}
                {allPermissions?.categories?.map((category) => (
                  <div key={category.categoryName} className="space-y-2">
                    <h4 className="font-medium text-sm text-slate-700 uppercase tracking-wider border-b pb-1">
                      {category.displayName}
                    </h4>
                    <div className="grid grid-cols-1 gap-1">
                      {category.permissions.map((perm) => {
                        const isAssigned = assignedPermissionIds.has(perm.id);
                        return (
                          <div key={perm.id} className="flex items-start space-x-3 p-2 hover:bg-slate-50 rounded">
                            <Checkbox
                              id={perm.id}
                              checked={isAssigned}
                              disabled={addPermissionMutation.isPending || removePermissionMutation.isPending}
                              onCheckedChange={(checked) => handlePermissionToggle(perm.id, checked as boolean)}
                            />
                            <div className="grid gap-1 leading-none">
                              <label
                                htmlFor={perm.id}
                                className="text-sm font-medium leading-none cursor-pointer"
                              >
                                {perm.permissionName}
                              </label>
                              <p className="text-xs text-muted-foreground">
                                {perm.description || perm.permissionName}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Fallback to flat items */}
                {(!allPermissions?.categories || allPermissions.categories.length === 0) && allPermissions?.items?.map(perm => (
                  <div key={perm.id} className="flex items-start space-x-3 p-2">
                    <Checkbox
                      id={perm.id}
                      checked={assignedPermissionIds.has(perm.id)}
                      onCheckedChange={(checked) => handlePermissionToggle(perm.id, checked as boolean)}
                    />
                    <label htmlFor={perm.id}>{perm.permissionName}</label>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* USERS Section */}
          <div className="border rounded-lg bg-card overflow-hidden">
            <div className="p-4 border-b bg-muted/20">
              <h3 className="font-semibold">Users</h3>
              <p className="text-xs text-muted-foreground">Directly assigned users</p>
            </div>
            <div className="p-4 text-sm space-y-3">
              {role.users && role.users.length > 0 ? (
                role.users.map(user => (
                  <div key={user.id} className="flex flex-col">
                    <span className="font-medium">{user.firstName} {user.lastName}</span>
                    <span className="text-muted-foreground text-xs">{user.email}</span>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground italic text-xs">No users assigned directly.</div>
              )}
            </div>
          </div>

          {/* USER GROUPS Section */}
          <div className="border rounded-lg bg-card overflow-hidden">
            <div className="p-4 border-b bg-muted/20">
              <h3 className="font-semibold">User Groups</h3>
              <p className="text-xs text-muted-foreground">Assigned via groups</p>
            </div>
            <div className="p-4 text-sm space-y-3">
              {role.userGroups && role.userGroups.length > 0 ? (
                role.userGroups.map(group => (
                  <div key={group.id} className="flex flex-col">
                    <span className="font-medium">{group.userGroupName}</span>
                    {group.description && <span className="text-muted-foreground text-xs">{group.description}</span>}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground italic text-xs">No user groups assigned.</div>
              )}
            </div>
          </div>

          <div className="border rounded-lg bg-card p-4">
            <h3 className="font-semibold mb-2">Details</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-xs uppercase tracking-wider">Role ID</span>
                <span className="font-mono text-xs break-all select-all block bg-muted/30 p-2 rounded">{role.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
