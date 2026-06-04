export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6 h-32 animate-pulse" />
        ))}
      </div>
      <div className="bg-white rounded-xl shadow p-6 h-64 animate-pulse" />
    </div>
  );
}
