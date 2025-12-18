import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { locationService } from '@/services/api/location-service'
import { useState } from 'react'

export const Route = createFileRoute('/client/locations')({
  component: ClientLocations,
})

function ClientLocations() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery({
    queryKey: ['client-locations', page],
    queryFn: () => locationService.getLocations(page)
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-slate-500 mt-1">Manage physical sites and areas.</p>
        </div>
        <Link
          to="/client/locations/create"
          className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md font-medium text-sm transition-colors"
        >
          Create Location
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-medium border-b">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Number</th>
              <th className="px-6 py-3">City/State</th>
              <th className="px-6 py-3">Assets</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading locations...</td></tr>
            ) : data?.items.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">No locations found.</td></tr>
            ) : data?.items.map((loc) => (
              <tr key={loc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-medium">
                  <Link to="/client/locations/$locationId" params={{ locationId: loc.id }} className="hover:underline text-blue-600 dark:text-blue-400">
                    {loc.locationName}
                  </Link>
                  {loc.isMainLocation && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Main</span>}
                </td>
                <td className="px-6 py-4 text-slate-600">{loc.locationNumber}</td>
                <td className="px-6 py-4 text-slate-600">{loc.city ? `${loc.city}, ${loc.state}` : "-"}</td>
                <td className="px-6 py-4 text-slate-600">{loc.assetCount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                    ${loc.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {loc.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
