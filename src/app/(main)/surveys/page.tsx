"use client";
export default function SurveysPage() {
  return (
    <div className="p-6 h-full overflow-auto max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">Survey Management</h2>
        <p className="text-sm font-light text-slate-400">
          Field surveys and GNSS observations. This module covers survey assignment, field data collection, and CORS-referenced GNSS point import.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white">Demo GNSS Control Points</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">Active</span>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-[var(--color-background)]/50 border border-[var(--color-border-subtle)]">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">Points Seeded</div>
              <div className="text-sm font-medium text-slate-200">5 GNSS control points (Patna demo area)</div>
            </div>
            
            <div className="p-3 rounded-lg bg-[var(--color-background)]/50 border border-[var(--color-border-subtle)]">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">Accuracy target</div>
              <div className="text-sm font-medium text-slate-200">RTK Fixed: ±2–3cm (H), ±3–5cm (V)</div>
            </div>
            
            <div className="p-3 rounded-lg bg-[var(--color-background)]/50 border border-[var(--color-border-subtle)]">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">Reference Base</div>
              <div className="text-sm font-mono text-slate-200">CORS-PATNA-01, CORS-PATNA-02</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
