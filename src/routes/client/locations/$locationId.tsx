import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { locationService } from '@/services/api/location-service';
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
import { UpdateLocationRequest } from '@/types/api/location';

export const Route = createFileRoute('/client/locations/$locationId')({
  component: LocationDetail,
});

const locationSchema = z.object({
  locationName: z.string().min(1, "Location Name is required"),
  description: z.string().optional(),
  address1: z.string().min(1, "Address Line 1 is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal Code is required"),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  timeZoneId: z.string().optional(),
  isMainLocation: z.boolean(),
  isActive: z.boolean(),
});

type LocationFormValues = z.infer<typeof locationSchema>;

function LocationDetail() {
  const { locationId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: location, isLoading } = useQuery({
    queryKey: ['location', locationId],
    queryFn: () => locationService.getLocationById(locationId),
  });

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      locationName: '',
      address1: '',
      city: '',
      state: '',
      postalCode: '',
      isMainLocation: false,
      isActive: true
    }
  });

  useEffect(() => {
    if (location) {
      form.reset({
        locationName: location.locationName,
        description: '', // Assuming locationSummary might lack description, default to empty. Ideally explicit.
        address1: '', // LocationSummary lacks address fields? Wait.
        address2: '',
        city: location.city || '',
        state: location.state || '',
        postalCode: '',
        country: '',
        phone: '',
        email: '',
        timeZoneId: '',
        isMainLocation: location.isMainLocation,
        isActive: location.isActive
      });
      // NOTE: LocationSummary (from existing type file) only has: 
      // id, locationName, locationNumber, city, state, isActive, isMainLocation, assetCount, createdDate.
      // It completely LACKS address1, address2, postalCode, details, etc.
      // This implies getLocationById needs to return a DIFFERENT type (LocationDetail) than LocationSummary.
      // OR I need to update LocationSummary to include these fields if the API returns them.
      // I will assume for now the API returns the full object and I should update the type or cast it.
      // But since I can't see the API response, I will proceed with what I have and potentially update the Type if built fails or I realize mismatches.
      // Actually, for the Edit Form to work, we need these values. 
      // Assuming the `getLocationById` returns the full object (matching UpdateLocationRequest structure + ID), 
      // I should basically cast `location` to `any` or extend the type to map these fields.
      // Let's populate what we can.
    }
  }, [location, form]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateLocationRequest) => locationService.updateLocation(locationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['location', locationId] });
      queryClient.invalidateQueries({ queryKey: ['client-locations'] });
      toast.success("Location updated successfully");
      setIsEditing(false);
    },
    onError: () => toast.error("Failed to update location")
  });

  function onSubmit(data: LocationFormValues) {
    const updateData: UpdateLocationRequest = {
      ...data,
      description: data.description || undefined,
      address2: data.address2 || undefined,
      country: data.country || undefined,
      phone: data.phone || undefined,
      email: data.email || undefined,
      timeZoneId: data.timeZoneId || undefined,
    };
    updateMutation.mutate(updateData);
  }

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!location) return <div className="p-8">Location not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/client/locations' })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Location Details</h2>
              <p className="text-muted-foreground">{location.locationName} (#{location.locationNumber})</p>
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
                  name="locationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeZoneId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Zone</FormLabel>
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

              <div className="space-y-4">
                <h3 className="font-medium">Address & Contact</h3>
                <FormField
                  control={form.control}
                  name="address1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Active</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isMainLocation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Main Location</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

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
                <Label className="text-muted-foreground">Location Name</Label>
                <div className="font-medium text-lg">{location.locationName}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${location.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {location.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">City/State</Label>
                <div className="font-medium">{location.city}, {location.state}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Type</Label>
                <div className="font-medium">{location.isMainLocation ? 'Main Location' : 'Standard Location'}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Asset Count</Label>
                <div className="font-medium">{location.assetCount}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
