"use client";
import { FileDown, BarChart2, FileText, Map } from "lucide-react";
export default function ReportsPage() {
  const reports = [
    { name: "Cadastral Survey Report", desc: "Complete ULPIN-wise parcel report with ownership and area", icon: FileText },
    { name: "3D SPID Registry Export", desc: "All 3DSPID identifiers with geometry metadata", icon: Map },
    { name: "Building Status Report", desc: "AI extraction confidence and approval status summary", icon: BarChart2 },
    { name: "Conflict Detection Report", desc: "All open and resolved 3D spatial conflicts", icon: FileDown },
    { name: "Data Quality Report", desc: "Quality scores, topology validation, accuracy metrics", icon: BarChart2 },
    { name: "Audit Trail Export", desc: "Complete changelog for all entities (last 90 days)", icon: FileText },
  ];
  return (
    <div className="p-6 h-full overflow-auto max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">Reports</h2>
        <p className="text-sm font-light text-slate-400">Generate and export cadastral reports</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map(r => {
          const Icon = r.icon;
          return (
            <button key={r.name}
              onClick={() => alert(`DEMO: Generating "${r.name}"...\n\nIn production, this would generate a PDF/Excel/GeoJSON report and download it.`)}
              className="p-6 rounded-xl text-left transition-all group bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-2)] hover:border-slate-700 shadow-sm flex flex-col h-full">
              
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5 text-blue-400" />
              </div>
              
              <div className="font-medium text-white text-base mb-2">{r.name}</div>
              <div className="text-sm font-light text-slate-400 mb-6 flex-1">{r.desc}</div>
              
              <div className="flex items-center justify-between w-full pt-4 border-t border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 group-hover:text-blue-400 transition-colors">
                  <FileDown className="w-4 h-4" /> Generate Report
                </div>
                <div className="text-slate-600 group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100">&rarr;</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
