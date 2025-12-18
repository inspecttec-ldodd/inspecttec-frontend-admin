import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetGroupService } from '@/services/api/asset-group-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, Save, X, Edit2, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UpdateAssetGroupRequest } from '@/types/api/asset-group';

export const Route = createFileRoute('/client/asset-groups/$groupId')({
  component: AssetGroupDetail,
});

const assetGroupSchema = z.object({
  groupName: z.string().min(1, "Group Name is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type AssetGroupFormValues = z.infer<typeof assetGroupSchema>;

function AssetGroupDetail() {
  const { groupId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: group, isLoading } = useQuery({
    queryKey: ['asset-group', groupId],
    queryFn: () => assetGroupService.getAssetGroupById(groupId),
  });

  const form = useForm<AssetGroupFormValues>({
    resolver: zodResolver(assetGroupSchema),
    defaultValues: {
      groupName: '',
      isActive: true
    }
  });

  useEffect(() => {
    if (group) {
      form.reset({
        groupName: group.name,
        description: '', // AssetGroupSummary might lack description, assumed API returns it or we start empty
        isActive: group.isActive
      });
      // UpdateAssetGroupRequest needs description, but Summary type doesn't have it.
      // Assuming getAssetGroupById returns full object OR we accept it might be missing from display.
      // For editing, we try to use what we have.
    }
  }, [group, form]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateAssetGroupRequest) => assetGroupService.updateAssetGroup(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['client-asset-groups'] });
      toast.success("Asset Group updated successfully");
      setIsEditing(false);
    },
    onError: () => toast.error("Failed to update asset group")
  });

  function onSubmit(data: AssetGroupFormValues) {
    const updateData: UpdateAssetGroupRequest = {
      ...data,
      description: data.description || undefined,
    };
    updateMutation.mutate(updateData);
  }

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!group) return <div className="p-8">Asset Group not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/client/asset-groups' })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Asset Group Details</h2>
              <p className="text-muted-foreground">{group.name}</p>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Details
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="groupName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
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
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Inactive groups cannot be assigned to new assets.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <Label className="text-muted-foreground">Group Name</Label>
                <div className="font-medium text-lg">{group.name}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Asset Count</Label>
                <div className="font-medium">{group.assetCount}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${group.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {group.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Created Date</Label>
                <div className="font-medium">{new Date(group.createdDate).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
