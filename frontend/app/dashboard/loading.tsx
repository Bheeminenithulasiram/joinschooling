export default function Loading() {
  return (
    <div className="container-page py-10">
      <div className="animate-pulse">
        <div className="h-4 w-40 rounded bg-slate-200" />
        <div className="mt-3 h-9 w-72 rounded bg-slate-200" />
        <div className="mt-2 h-4 w-64 rounded bg-slate-100" />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="h-11 w-11 rounded-xl bg-slate-200" />
              <div className="mt-4 h-8 w-20 rounded bg-slate-200" />
              <div className="mt-2 h-4 w-28 rounded bg-slate-100" />
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="h-5 w-56 rounded bg-slate-200" />
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-slate-100 p-4">
                    <div className="h-16 rounded-lg bg-slate-200" />
                    <div className="mt-3 h-4 w-2/3 rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-6">
              <div className="h-5 w-40 rounded bg-slate-200" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-4 w-40 rounded bg-slate-200" />
                    <div className="h-6 w-24 rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="card p-6">
              <div className="h-5 w-32 rounded bg-slate-200" />
              <div className="mt-4 space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 rounded bg-slate-100" />
                ))}
              </div>
            </div>
            <div className="h-40 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
