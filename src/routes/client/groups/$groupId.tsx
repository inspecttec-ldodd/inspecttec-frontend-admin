import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userGroupService } from '@/services/api/user-group-service';
import { roleService } from '@/services/api/role-service';
import { userService } from '@/services/api/user-service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { ArrowLeft, Trash2, Plus, Shield, User, Loader2 } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/client/groups/$groupId')({
  component: GroupDetail,
});

function GroupDetail() {
  const { groupId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedroleId, setSelectedRoleId] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // Queries
  const { data: group, isLoading: isLoadingGroup } = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => userGroupService.getUserGroupById(groupId),
  });

  const { data: groupRoles } = useQuery({
    queryKey: ['group-roles', groupId],
    queryFn: () => userGroupService.getGroupRoles(groupId),
  });

  const { data: allRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getRoles(1, 100), // Get first 100 roles
  });

  const { data: allUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(1, 100),
  });

  // Mutations
  const assignRoleMutation = useMutation({
    mutationFn: (roleId: string) => userGroupService.assignRole(groupId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-roles', groupId] });
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      toast.success("Role assigned to group");
      setSelectedRoleId("");
    },
    onError: () => toast.error("Failed to assign role")
  });

  const removeRoleMutation = useMutation({
    mutationFn: (roleId: string) => userGroupService.removeRole(groupId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-roles', groupId] });
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      toast.success("Role removed from group");
    },
    onError: () => toast.error("Failed to remove role")
  });

  const addUserMutation = useMutation({
    mutationFn: (userId: string) => userGroupService.addUser(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] }); // Update counts or if we had a list
      toast.success("User added to group");
      setSelectedUserId("");
    },
    onError: () => toast.error("Failed to add user")
  });

  const removeUserMutation = useMutation({
    mutationFn: (userId: string) => userGroupService.removeUser(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      toast.success("User removed from group");
    },
    onError: () => toast.error("Failed to remove user")
  });

  if (isLoadingGroup) return <div className="p-8">Loading...</div>;
  if (!group) return <div className="p-8">Group not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/client/groups' })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{group.userGroupName} Group Details</h2>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <span>{group.userGroupName}</span>
            <Badge variant={group.isActive ? "default" : "destructive"}>
              {group.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
        </div>
      </div>

      <Tabs defaultValue="roles" className="w-full">
        <TabsList>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Assigned Roles ({group.groupRoles?.length || groupRoles?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Members ({group.members?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4 mt-4">
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-card">
            <Select value={selectedroleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a role to assign..." />
              </SelectTrigger>
              <SelectContent>
                {allRoles?.items?.map((role) => (
                  <SelectItem key={role.id} value={role.id}>{role.roleName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => assignRoleMutation.mutate(selectedroleId)}
              disabled={!selectedroleId || assignRoleMutation.isPending}
            >
              {assignRoleMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Assign Role
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>System Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Use group.groupRoles if available, fallback to groupRoles query if needed, or merge */}
                {(group.groupRoles && group.groupRoles.length > 0) ? (
                  group.groupRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.roleName}</TableCell>
                      <TableCell>{role.roleType === 'System' ? 'Yes' : 'No'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/90"
                          onClick={() => removeRoleMutation.mutate(role.id)}
                          disabled={removeRoleMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (groupRoles && groupRoles.length > 0) ? (
                  groupRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.roleName}</TableCell>
                      <TableCell>{role.roleType === 'System' ? 'Yes' : 'No'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/90"
                          onClick={() => removeRoleMutation.mutate(role.id)}
                          disabled={removeRoleMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No roles assigned to this group.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4 mt-4">
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-card">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a user to add..." />
              </SelectTrigger>
              <SelectContent>
                {allUsers?.items?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>{user.firstName} {user.lastName} ({user.email})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => addUserMutation.mutate(selectedUserId)}
              disabled={!selectedUserId || addUserMutation.isPending}
            >
              {addUserMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Add Member
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.members && group.members.length > 0 ? (
                  group.members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.displayName || `${member.firstName} ${member.lastName}`}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Badge variant={member.isActive ? "default" : "secondary"}>
                          {member.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(member.joinedDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/90"
                          onClick={() => removeUserMutation.mutate(member.clientUserId || member.id)}
                          disabled={removeUserMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No members in this group.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
