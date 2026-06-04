export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-3">
            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="aspect-video bg-gray-200 animate-pulse" />
            </div>
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6" />
              <div className="grid grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg p-8 h-96 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
