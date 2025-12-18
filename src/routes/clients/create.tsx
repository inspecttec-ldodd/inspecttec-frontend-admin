import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronLeft, Save, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { clientService } from '@/services/api/client-service'

const createClientSchema = z.object({
  clientName: z.string().min(1, 'Client Name is required'),
  domainName: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address1: z.string().optional(),
})

type CreateClientFormValues = z.infer<typeof createClientSchema>

export const Route = createFileRoute('/clients/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateClientFormValues>({
    resolver: zodResolver(createClientSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: CreateClientFormValues) => clientService.createClient(data),
    onSuccess: () => {
      // Handle success, e.g., navigate to client list or show a success message
      console.log('Client created successfully!')
    },
    onError: (error) => {
      // Handle error
      console.error('Failed to create client:', error)
    },
  })

  const onSubmit = (data: CreateClientFormValues) => {
    mutation.mutate(data)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/clients" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Onboard New Client</h1>
          <p className="text-slate-500 text-sm">Create a new tenant organization.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg border shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Organization Details</h2>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Organization Name <span className="text-red-500">*</span></label>
              <input
                {...register("clientName", { required: "Client Name is required" })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. Acme Construction Inc."
              />
              {errors.clientName && <span className="text-xs text-red-500">{errors.clientName.message}</span>}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Domain (Optional)</label>
              <input
                {...register("domainName")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. acme.com"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Contact Email (Optional)</label>
              <input
                type="email"
                {...register("email")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. info@acme.com"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-lg font-semibold border-b pb-2">Address</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 col-span-2">
                <label className="text-sm font-medium">Address Line 1</label>
                <input
                  {...register("address1")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {mutation.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              Failed to create client: {(mutation.error as Error).message}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Link
              to="/clients"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Create Client
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
