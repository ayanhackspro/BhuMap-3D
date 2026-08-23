"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getStatusBadgeClass, getSeverityClass } from "@/lib/utils";
import { AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ConflictsPage() {
  const { data: conflicts, isLoading } = useQuery({
    queryKey: ["conflicts"],
    queryFn: async () => {
      const { data } = await supabase.from("conflicts").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const open = conflicts?.filter(c => c.status === "open").length ?? 0;

  return (
    <div className="p-6 h-full overflow-auto max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">Conflict Detection</h2>
          <p className="text-sm font-light text-slate-400">
            {open} open conflicts · 3D spatial intersection analysis
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Critical", severity: "critical", count: conflicts?.filter(c => c.severity === "critical").length ?? 0, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
          { label: "High", severity: "high", count: conflicts?.filter(c => c.severity === "high").length ?? 0, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
          { label: "Medium", severity: "medium", count: conflicts?.filter(c => c.severity === "medium").length ?? 0, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
          { label: "Low", severity: "low", count: conflicts?.filter(c => c.severity === "low").length ?? 0, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        ].map(s => (
          <div key={s.label} className={`p-5 rounded-xl border ${s.border} ${s.bg} backdrop-blur-sm shadow-sm`}>
            <div className={`text-3xl font-light mb-1 ${s.color}`}>{s.count}</div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{s.label} Severity</div>
          </div>
        ))}
      </div>

      {/* Conflicts list */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]" />
          ))
        ) : conflicts?.length === 0 ? (
          <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl">
            <CheckCircle className="w-10 h-10 mx-auto mb-4 text-slate-600" />
            <div className="text-slate-400 text-sm font-light">No conflicts detected. All systems nominal.</div>
          </div>
        ) : conflicts?.map(conflict => (
          <div key={conflict.id} className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-2)] transition-colors group shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className={`p-2.5 rounded-lg ${
                  conflict.severity === 'critical' ? 'bg-red-500/10 text-red-400' : 
                  conflict.severity === 'high' ? 'bg-orange-500/10 text-orange-400' : 
                  conflict.severity === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="font-medium text-white text-base">{conflict.conflict_type}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      conflict.severity === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                      conflict.severity === 'high' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 
                      conflict.severity === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {conflict.severity}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{conflict.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-mono">
                    <span>ID: <span className="text-slate-400">{conflict.id?.slice(0, 8)}</span>...</span>
                    <span>·</span>
                    <span>{new Date(conflict.created_at).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${getStatusBadgeClass(conflict.status)}`}>
                  {conflict.status}
                </span>
                <Link href="/map" className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100">
                  Inspect <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-xs text-slate-500/50 text-center font-light">
        ⚠ Demo environment: Includes 1 deliberate structural overlap conflict for presentation purposes.
      </div>
    </div>
  );
}
