export default function LoginLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded bg-slate-200" />
        <div className="h-4 w-64 rounded bg-slate-200" />
      </div>
      <div className="space-y-3">
        <div className="h-10 rounded bg-slate-200" />
        <div className="h-10 rounded bg-slate-200" />
      </div>
      <div className="h-px bg-slate-200" />
      <div className="space-y-3">
        <div className="h-10 rounded bg-slate-200" />
        <div className="h-10 rounded bg-slate-200" />
        <div className="h-10 rounded bg-slate-200" />
      </div>
      <div className="h-10 rounded bg-indigo-200" />
    </div>
  );
}
