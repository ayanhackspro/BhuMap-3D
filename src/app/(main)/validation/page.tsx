"use client";
import { CheckCircle, AlertTriangle } from "lucide-react";
export default function ValidationPage() {
  const checks = [
    { name: "Closed polygon geometry", status: "pass", affected: 22 },
    { name: "No self-intersecting geometries", status: "pass", affected: 22 },
    { name: "Valid elevation range (min < max)", status: "pass", affected: 22 },
    { name: "3D volume > 0", status: "pass", affected: 22 },
    { name: "No overlapping floor extents", status: "pass", affected: 9 },
    { name: "Underground-surface non-overlap", status: "fail", affected: 1, note: "BLD-2024-001 Basement 2 / Main Sewer" },
    { name: "Parent ULPIN existence", status: "pass", affected: 22 },
    { name: "Building within parcel boundary", status: "pass", affected: 6 },
    { name: "Coordinate reference system valid", status: "pass", affected: 22 },
    { name: "Area within expected range", status: "pass", affected: 22 },
  ];
  const passed = checks.filter(c => c.status === "pass").length;
  return (
    <div className="p-6 h-full overflow-auto max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">Topology Validation</h2>
        <p className="text-sm font-light text-slate-400">
          {passed}/{checks.length} checks passed · 1 conflict requires attention
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[
          { label: "Passed", value: passed, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { label: "Failed", value: checks.filter(c => c.status === "fail").length, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
          { label: "Total Entities", value: 22, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-sm relative overflow-hidden group hover:border-slate-600 transition-colors">
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40 ${s.bg}`} />
            <div className={`text-4xl font-light tracking-tight mb-2 ${s.color}`}>{s.value}</div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>
      
      <div className="space-y-3">
        {checks.map((check, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-2)] transition-colors group">
            {check.status === "pass" ? (
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-200">{check.name}</div>
              {check.note && <div className="text-[11px] text-rose-400 font-medium mt-1">{check.note}</div>}
            </div>
            
            <div className="shrink-0 text-[11px] font-medium uppercase tracking-wider text-slate-500 px-3 py-1 rounded-lg bg-[var(--color-background)] border border-[var(--color-border-subtle)]">
              {check.affected} {check.affected === 1 ? 'entity' : 'entities'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
