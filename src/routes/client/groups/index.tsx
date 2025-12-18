import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userGroupService } from '@/services/api/user-group-service'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Search, Users, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner'

export const Route = createFileRoute('/client/groups/')({
  component: UserGroupsList,
})

function UserGroupsList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [groupToDelete, setGroupToDelete] = useState<{ id: string, name: string } | null>(null);

  const { data: groups, isLoading } = useQuery({
    queryKey: ['user-groups', search],
    queryFn: () => userGroupService.getUserGroups(1, 50, search),
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (id: string) => userGroupService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-groups'] });
      toast.success("User Group deleted successfully");
      setGroupToDelete(null);
    },
    onError: () => {
      toast.error("Failed to delete user group");
      setGroupToDelete(null);
    }
  });

  // ... return JSX
  return (
    <div className="space-y-6">
      {/* ... header and search ... */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Groups</h2>
          <p className="text-muted-foreground">
            Manage groups to organize users and assign roles efficiently.
          </p>
        </div>
        <Button onClick={() => navigate({ to: '/client/groups/create' })}>
          <Plus className="mr-2 h-4 w-4" />
          Create Group
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
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
              <TableHead>Group Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Members</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : groups?.items?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No user groups found.
                </TableCell>
              </TableRow>
            ) : (
              groups?.items?.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {group.userGroupName}
                    </div>
                  </TableCell>
                  <TableCell>{group.description || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={group.isActive ? "default" : "secondary"}>
                      {group.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{group.membersCount}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => navigate({ to: '/client/groups/$groupId', params: { groupId: group.id } })}
                        >
                          Manage Group
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setGroupToDelete({ id: group.id, name: group.userGroupName })}
                        >
                          Delete
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

      <AlertDialog open={!!groupToDelete} onOpenChange={(open: boolean) => !open && setGroupToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user group
              <strong> "{groupToDelete?.name}"</strong> and remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => groupToDelete && deleteGroupMutation.mutate(groupToDelete.id)}
            >
              {deleteGroupMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
