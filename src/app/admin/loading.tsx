import AdminHeader from '@/components/AdminHeader';

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="py-4 px-4">
        <div className="h-4 w-32 bg-zinc-200 rounded mb-2" />
        <div className="h-3 w-40 bg-zinc-100 rounded" />
      </td>
      <td className="py-4 px-4">
        <div className="h-4 w-24 bg-zinc-200 rounded" />
      </td>
      <td className="py-4 px-4">
        <div className="h-4 w-full max-w-xs bg-zinc-100 rounded" />
      </td>
      <td className="py-4 px-4">
        <div className="h-6 w-20 bg-zinc-200 rounded-full" />
      </td>
      <td className="py-4 px-4">
        <div className="h-3 w-20 bg-zinc-100 rounded" />
      </td>
    </tr>
  );
}

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-white text-zinc-950 flex flex-col font-sans">
      <AdminHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="animate-pulse space-y-2">
          <div className="h-8 w-40 bg-zinc-200 rounded" />
          <div className="h-4 w-56 bg-zinc-100 rounded" />
        </div>

        <div className="h-11 max-w-md bg-zinc-100 rounded-lg animate-pulse" />

        <div className="ring-1 ring-zinc-200/70 rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200/60">
                {['Lead', 'Budget', 'Message', 'Status', 'Date'].map((h) => (
                  <th key={h} className="py-3 px-4 text-left">
                    <div className="h-3 w-16 bg-zinc-200 rounded animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/60">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
