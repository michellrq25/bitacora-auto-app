import React from 'react';

/**
 * Mobile-First Shimmer Skeleton para transiciones instantáneas entre rutas
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 pb-28 text-slate-100 animate-pulse">
      {/* Skeleton Header */}
      <div className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 px-4 py-3">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-800/80" />
            <div className="space-y-1.5">
              <div className="h-5 w-24 rounded bg-slate-800/80" />
              <div className="h-3 w-36 rounded bg-slate-800/60" />
            </div>
          </div>
          <div className="h-8 w-8 rounded-xl bg-slate-800/80" />
        </div>
      </div>

      {/* Skeleton Content */}
      <main className="mx-auto max-w-md px-4 py-4 space-y-4">
        {/* Hero Card */}
        <div className="h-44 w-full rounded-3xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-3">
          <div className="h-3 w-28 rounded bg-slate-800/80" />
          <div className="h-10 w-44 rounded bg-slate-800/90" />
          <div className="h-3 w-32 rounded bg-slate-800/60" />
          <div className="mt-4 h-12 w-full rounded-xl bg-slate-950/70 border border-slate-800/60" />
        </div>

        {/* Secondary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="h-28 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-2">
            <div className="h-3 w-20 rounded bg-slate-800/80" />
            <div className="h-6 w-24 rounded bg-slate-800/90" />
            <div className="h-2 w-16 rounded bg-slate-800/60" />
          </div>
          <div className="h-28 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-2">
            <div className="h-3 w-20 rounded bg-slate-800/80" />
            <div className="h-6 w-24 rounded bg-slate-800/90" />
            <div className="h-2 w-16 rounded bg-slate-800/60" />
          </div>
        </div>

        {/* List items */}
        <div className="space-y-3 pt-2">
          <div className="h-4 w-32 rounded bg-slate-800/80" />
          <div className="h-20 w-full rounded-2xl border border-slate-800/80 bg-slate-900/60" />
          <div className="h-20 w-full rounded-2xl border border-slate-800/80 bg-slate-900/60" />
        </div>
      </main>
    </div>
  );
}
