export default function WorkflowsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-56 rounded bg-slate-200 animate-pulse" />
        </div>
        <div className="h-9 w-32 rounded bg-slate-200 animate-pulse" />
      </div>
      <div className="card overflow-hidden">
        <div className="space-y-2 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 rounded bg-slate-100 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
