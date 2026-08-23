"use client";
import { Brain, Loader2, CheckCircle } from "lucide-react";
export default function ProcessingPage() {
  const jobs = [
    { id: "JOB-001", name: "AI Building Extraction — Urban Tower A", status: "completed", progress: 100, output: "6 buildings extracted, avg confidence 85.1%" },
    { id: "JOB-002", name: "Topology Validation — Rajendra Nagar", status: "completed", progress: 100, output: "22 properties validated, 1 conflict detected" },
    { id: "JOB-003", name: "DSM-DEM Difference — Canopy Height", status: "completed", progress: 100, output: "Canopy height raster generated (1m resolution)" },
    { id: "JOB-004", name: "Underground Utility 3D Reconstruction", status: "completed", progress: 100, output: "3 utility lines reconstructed in 3D" },
  ];
  return (
    <div className="p-6 h-full overflow-auto max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">Processing Queue</h2>
        <p className="text-sm font-light text-slate-400">AI and data processing jobs for the demo area</p>
      </div>
      
      <div className="space-y-4">
        {jobs.map(job => (
          <div key={job.id} className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-sm hover:bg-[var(--color-surface-2)] transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-widest text-slate-400 border border-slate-600/50 bg-slate-800/50 shadow-sm">
                  {job.id}
                </div>
                <span className="font-medium text-white text-base">{job.name}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Completed</span>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
            
            <div className="w-full h-2 rounded-full mb-4 bg-[var(--color-background)] overflow-hidden border border-[var(--color-border-subtle)]">
              <div className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(52,211,153,0.5)] bg-emerald-500" style={{ width: "100%" }} />
            </div>
            
            <div className="flex items-center gap-2 text-xs font-light text-slate-400">
              <span className="font-medium text-slate-500">Output:</span> {job.output}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
