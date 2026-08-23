"use client";

import Link from "next/link";
import {
  Map, Activity, AlertTriangle, Layers, Cpu, Server
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function AnalystDashboard() {
  const processingJobs = [
    { id: "JOB-902", type: "CityGML LoD2 Extrusion", progress: 100, status: "completed" },
    { id: "JOB-903", type: "AI Building Footprint Detection", progress: 65, status: "processing" },
    { id: "JOB-904", type: "Underground Pipe Topology", progress: 12, status: "processing" },
  ];

  const validationData = [
    { category: "Self-Intersections", errors: 4 },
    { category: "Overlapping Parcels", errors: 12 },
    { category: "Z-Axis Floating", errors: 3 },
    { category: "Invalid 3DSPID", errors: 0 },
  ];

  return (
    <div className="p-6 space-y-6 overflow-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">GIS Analyst Dashboard</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
            Data processing queue and topology validation overview.
          </p>
        </div>
        <Link href="/map"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: "var(--color-primary)" }}>
          <Map className="w-4 h-4" />
          Open 3D Map
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Validation Errors Chart */}
        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-md font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" />
              Topology Validation Errors
            </h3>
            <Link href="/validation" className="text-xs text-[var(--color-info)] hover:underline">View Details →</Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={validationData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-border-subtle)" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }} />
                <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }} width={120} />
                <Tooltip cursor={{ fill: 'var(--color-surface-2)' }} contentStyle={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: 8, color: "var(--color-text-primary)" }} />
                <Bar dataKey="errors" fill="var(--color-danger)" radius={[0, 4, 4, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Processing Queue */}
        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-md font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[var(--color-info)]" />
              Background Processing Queue
            </h3>
            <Link href="/processing" className="text-xs text-[var(--color-info)] hover:underline">Manage Queue →</Link>
          </div>
          
          <div className="space-y-4">
            {processingJobs.map(job => (
              <div key={job.id} className="p-4 bg-[var(--color-surface-2)] rounded-lg border border-[var(--color-border-subtle)]">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm text-[var(--color-text-primary)]">{job.type}</div>
                  <div className="text-xs font-mono text-[var(--color-text-muted)]">{job.id}</div>
                </div>
                <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--color-info)] transition-all duration-1000" 
                    style={{ width: `${job.progress}%` }} 
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className={`${job.status === 'completed' ? 'text-[var(--color-success)]' : 'text-[var(--color-text-secondary)]'}`}>
                    {job.status === 'completed' ? 'Completed' : `Processing (${job.progress}%)`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="lg:col-span-2 p-6 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
              <Server className="w-6 h-6 text-[var(--color-success)]" />
            </div>
            <div>
              <h4 className="font-semibold text-[var(--color-text-primary)]">GIS Database Status</h4>
              <p className="text-sm text-[var(--color-text-secondary)]">PostGIS and Supabase connected. All services operational.</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[var(--color-text-muted)]">Current Load</div>
            <div className="text-lg font-medium text-[var(--color-text-primary)]">24% CPU</div>
          </div>
        </div>
      </div>
    </div>
  );
}
