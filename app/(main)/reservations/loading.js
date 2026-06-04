export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="h-12 w-64 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6 flex gap-4">
            <div className="h-24 w-32 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
