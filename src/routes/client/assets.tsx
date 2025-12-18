import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { assetService } from '@/services/api/asset-service'
import { useState } from 'react'
import { Search } from 'lucide-react'

export const Route = createFileRoute('/client/assets')({
  component: ClientAssets,
})

function ClientAssets() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery({
    queryKey: ['client-assets', page],
    queryFn: () => assetService.getAssets(page)
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-slate-500 mt-1">Manage equipment and resources.</p>
        </div>
        <Link
          to="/client/assets/create"
          className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md font-medium text-sm transition-colors"
        >
          Create Asset
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-medium border-b">
            <tr>
              <th className="px-6 py-3">Asset Name</th>
              <th className="px-6 py-3">ID Number</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Group</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Last Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading assets...</td></tr>
            ) : data?.items.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">No assets found.</td></tr>
            ) : data?.items.map((asset) => (
              <tr key={asset.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-medium">
                  <Link to="/client/assets/$assetId" params={{ assetId: asset.id }} className="hover:underline text-blue-600 dark:text-blue-400">
                    {asset.assetName}
                  </Link>
                </td>
                <td className="px-6 py-4 text-slate-600">{asset.identifyingNumber || "-"}</td>
                <td className="px-6 py-4 text-slate-600">{asset.locationName}</td>
                <td className="px-6 py-4 text-slate-600">{asset.assetGroupName}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                    ${asset.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {asset.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{asset.lastInspectionDate ? new Date(asset.lastInspectionDate).toLocaleDateString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
