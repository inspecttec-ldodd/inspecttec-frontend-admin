import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetService } from '@/services/api/asset-service';
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
import { UpdateAssetRequest, AssetType } from '@/types/api/asset';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { locationService } from '@/services/api/location-service';
import { assetGroupService } from '@/services/api/asset-group-service';

export const Route = createFileRoute('/client/assets/$assetId')({
  component: AssetDetail,
});

const assetSchema = z.object({
  assetName: z.string().min(1, "Asset Name is required"),
  identifyingNumber: z.string().optional(),
  serialNumber: z.string().optional(),
  description: z.string().optional(),
  assetType: z.string().optional(), // Using string for select value, will cast to Enum or number
  manufacturerName: z.string().optional(),
  modelNumber: z.string().optional(),
  installationDate: z.string().optional(),
  locationId: z.string().min(1, "Location is required"),
  assetGroupId: z.string().min(1, "Asset Group is required"),
  isActive: z.boolean(),
});

type AssetFormValues = z.infer<typeof assetSchema>;

function AssetDetail() {
  const { assetId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: asset, isLoading } = useQuery({
    queryKey: ['asset', assetId],
    queryFn: () => assetService.getAssetById(assetId),
  });

  const { data: locations } = useQuery({
    queryKey: ['client-locations-list'],
    queryFn: () => locationService.getLocations(1, 100),
  });

  const { data: assetGroups } = useQuery({
    queryKey: ['client-asset-groups-list'],
    queryFn: () => assetGroupService.getAssetGroups(1, 100),
  });

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      assetName: '',
      isActive: true,
      locationId: '',
      assetGroupId: ''
    }
  });

  useEffect(() => {
    if (asset) {
      form.reset({
        assetName: asset.assetName,
        identifyingNumber: asset.identifyingNumber || '',
        serialNumber: asset.serialNumber || '',
        description: '',
        assetType: asset.assetType?.toString(),
        manufacturerName: '',
        modelNumber: '',
        installationDate: '',
        locationId: asset.locationId,
        assetGroupId: asset.assetGroupId,
        isActive: asset.isActive
      });
    }
  }, [asset, form]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateAssetRequest) => assetService.updateAsset(assetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset', assetId] });
      queryClient.invalidateQueries({ queryKey: ['client-assets'] });
      toast.success("Asset updated successfully");
      setIsEditing(false);
    },
    onError: () => toast.error("Failed to update asset")
  });

  function onSubmit(data: AssetFormValues) {
    const updateData: UpdateAssetRequest = {
      ...data,
      identifyingNumber: data.identifyingNumber || undefined,
      serialNumber: data.serialNumber || undefined,
      description: data.description || undefined,
      manufacturerName: data.manufacturerName || undefined,
      modelNumber: data.modelNumber || undefined,
      installationDate: data.installationDate || undefined,
      assetType: data.assetType ? Number(data.assetType) as AssetType : undefined
    };
    updateMutation.mutate(updateData);
  }

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!asset) return <div className="p-8">Asset not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/client/assets' })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Asset Details</h2>
              <p className="text-muted-foreground">{asset.assetName}</p>
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
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="assetName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="identifyingNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assetType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(AssetType).filter(k => isNaN(Number(k))).map(key => (
                            <SelectItem key={key} value={AssetType[key as keyof typeof AssetType].toString()}>
                              {key}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="locationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations?.items.map(loc => (
                            <SelectItem key={loc.id} value={loc.id}>
                              {loc.locationName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assetGroupId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Group</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {assetGroups?.items.map(group => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                <Label className="text-muted-foreground">Asset Name</Label>
                <div className="font-medium text-lg">{asset.assetName}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">ID Number</Label>
                <div className="font-medium">{asset.identifyingNumber || '-'}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Location</Label>
                <div className="font-medium">{asset.locationName}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Group</Label>
                <div className="font-medium">{asset.assetGroupName}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${asset.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {asset.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Type</Label>
                <div className="font-medium">{asset.assetTypeName || '-'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
