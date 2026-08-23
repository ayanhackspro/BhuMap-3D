"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import {
  FileText, Building2, Home, Layers, AlertTriangle,
  Clock, TrendingUp, Map, ArrowRight, Activity
} from "lucide-react";

async function fetchDashboardStats() {
  const { data } = await supabase.rpc("get_dashboard_stats");
  return data as Record<string, number>;
}

async function fetchBuildingDistribution() {
  const { data } = await supabase.from("buildings").select("building_type, status, ai_confidence");
  return data ?? [];
}

async function fetchPropertyApprovalBreakdown() {
  const { data } = await supabase
    .from("properties")
    .select("approval_status");
  const counts: Record<string, number> = {};
  data?.forEach((p) => { counts[p.approval_status] = (counts[p.approval_status] ?? 0) + 1; });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

async function fetchRecentConflicts() {
  const { data } = await supabase
    .from("conflicts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);
  return data ?? [];
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#f44336",
  high: "#ff7043",
  medium: "#ffa726",
  low: "#aed581",
};

export function GovernmentDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000,
  });

  const { data: buildings } = useQuery({ queryKey: ["buildings-dist"], queryFn: fetchBuildingDistribution });
  const { data: propertyBreakdown } = useQuery({ queryKey: ["property-breakdown"], queryFn: fetchPropertyApprovalBreakdown });
  const { data: recentConflicts } = useQuery({ queryKey: ["recent-conflicts"], queryFn: fetchRecentConflicts });

  const confidenceData = buildings
    ? [
        { range: "90-100%", count: buildings.filter(b => (b.ai_confidence ?? 0) >= 90).length, label: "Very High" },
        { range: "80-90%", count: buildings.filter(b => (b.ai_confidence ?? 0) >= 80 && (b.ai_confidence ?? 0) < 90).length, label: "High" },
        { range: "60-80%", count: buildings.filter(b => (b.ai_confidence ?? 0) >= 60 && (b.ai_confidence ?? 0) < 80).length, label: "Moderate" },
        { range: "<60%", count: buildings.filter(b => (b.ai_confidence ?? 0) < 60).length, label: "Low" },
      ]
    : [];

  const KPI_CARDS = [
    { label: "Total Parcels", value: stats?.total_parcels ?? 0, icon: FileText, color: "#1565c0", link: "/parcels", sublabel: "Active cadastral parcels" },
    { label: "3D Mapped", value: stats?.mapped_3d ?? 0, icon: Map, color: "#0288d1", link: "/map", sublabel: "Parcels with 3D data" },
    { label: "Buildings", value: stats?.total_buildings ?? 0, icon: Building2, color: "#00796b", link: "/buildings", sublabel: "Extracted buildings" },
    { label: "Property Units", value: stats?.total_properties ?? 0, icon: Home, color: "#7b1fa2", link: "/properties", sublabel: "3DSPID-registered units" },
    { label: "Underground Assets", value: stats?.underground_assets ?? 0, icon: Layers, color: "#e65100", link: "/map", sublabel: "Utility networks" },
    { label: "Pending Verification", value: stats?.pending_verification ?? 0, icon: Clock, color: "#f57f17", link: "/approvals", sublabel: "Awaiting review" },
    { label: "Open Conflicts", value: stats?.open_conflicts ?? 0, icon: AlertTriangle, color: "#b71c1c", link: "/conflicts", sublabel: "Spatial conflicts detected" },
    { label: "High Confidence", value: stats?.high_confidence ?? 0, icon: TrendingUp, color: "#2e7d32", link: "/properties", sublabel: "AI confidence ≥ 80%" },
  ];

  return (
    <div className="p-6 space-y-6 overflow-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Mapping Progress Overview</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
            Patna, Bihar — SIH 2026 Demo Area · Real-time data from Supabase
          </p>
        </div>
        <Link href="/map"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: "var(--color-primary)" }}>
          <Map className="w-4 h-4" />
          Open 3D Map
        </Link>
      </div>

      {/* Bento Grid */}
      <div className="bento mt-6">
        {/* Primary Data - Approval Status (2x2) */}
        <div className="cell span-2x2 p-6 justify-between border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Property Approval Pipeline</h3>
          {propertyBreakdown && propertyBreakdown.length > 0 ? (
            <div className="flex-1 flex flex-col justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={propertyBreakdown} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value" paddingAngle={2}>
                    {propertyBreakdown.map((entry, index) => {
                      const colors = ["var(--color-primary)", "var(--color-info)", "var(--color-success)", "var(--color-warning)", "var(--color-danger)", "#90caf9"];
                      return <Cell key={index} fill={colors[index % colors.length]} stroke="var(--color-surface)" strokeWidth={2} />
                    })}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: 8, color: "var(--color-text-primary)" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
                {propertyBreakdown?.map((item, i) => {
                  const colors = ["var(--color-primary)", "var(--color-info)", "var(--color-success)", "var(--color-warning)", "var(--color-danger)", "#90caf9"];
                  return (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors[i % colors.length] }} />
                        <span style={{ color: "var(--color-text-secondary)" }}>{item.name.replace(/_/g, " ")}</span>
                      </div>
                      <span className="font-medium text-[var(--color-text-primary)]">{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : <div className="skeleton flex-1 rounded-lg" />}
        </div>

        {/* Demo Workflow (1x2) */}
        <div className="cell span-1x2 p-5 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)]">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-5 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--color-info)]" />
            Judge Walkthrough
          </h3>
          <div className="space-y-1">
            {[
              { step: "1", label: "Open 3D Map", href: "/map", done: true },
              { step: "2", label: "Select Urban Tower A", href: "/map", done: true },
              { step: "3", label: "View identifiers", href: "/properties", done: true },
              { step: "4", label: "Underground Mode", href: "/map", done: false },
              { step: "5", label: "Detect Conflicts", href: "/conflicts", done: false },
              { step: "6", label: "Approve Property", href: "/approvals", done: false },
              { step: "7", label: "Generate Report", href: "/reports", done: false },
            ].map((item) => (
              <Link key={item.step} href={item.href} className="flex items-center gap-3 p-2.5 rounded-md text-sm transition-all hover:bg-[var(--color-surface)] group">
                <div className={`w-5 h-5 rounded-sm flex items-center justify-center font-medium text-[11px] flex-shrink-0 transition-colors ${item.done ? "bg-[var(--color-info)]/10 text-[var(--color-info)] border border-[var(--color-info)]/30" : "bg-transparent text-[var(--color-text-muted)] border border-[var(--color-border)]"}`}>
                  {item.step}
                </div>
                <span className={`truncate ${item.done ? "text-[var(--color-text-secondary)]" : "text-[var(--color-text-primary)]"}`}>{item.label}</span>
                <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-info)]" />
              </Link>
            ))}
          </div>
        </div>

        {/* KPI blocks (1x1) */}
        {KPI_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.link} className="cell span-1x1 p-5 transition-all hover:bg-[var(--color-surface-2)] bg-[var(--color-surface)] border border-[var(--color-border-subtle)] group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--color-info)]/5 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <div className="text-3xl font-light text-[var(--color-text-primary)] mb-2 tracking-tight">
                {statsLoading ? <div className="skeleton h-8 w-20" /> : card.value.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <Icon className="w-4 h-4 text-[var(--color-info)]" />
                <div className="text-sm font-medium text-[var(--color-text-secondary)]">{card.label}</div>
              </div>
            </Link>
          );
        })}

        {/* AI Confidence (2x1) */}
        <div className="cell span-2x1 p-6 flex flex-col bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">AI Confidence Distribution</h3>
          <div className="flex-1 min-h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-subtle)" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }} />
                <Tooltip cursor={{ fill: 'var(--color-surface-2)' }} contentStyle={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: 8, color: "var(--color-text-primary)", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="count" fill="url(#blueGradient)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-info)" />
                    <stop offset="100%" stopColor="var(--color-primary)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Conflicts (2x1) */}
        <div className="cell span-2x1 p-6 bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Recent Spatial Conflicts</h3>
            <Link href="/conflicts" className="text-xs font-medium text-[var(--color-info)] hover:underline transition-colors">View all →</Link>
          </div>
          {recentConflicts && recentConflicts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {recentConflicts.slice(0, 4).map((conflict) => (
                <div key={conflict.id} className="flex flex-col gap-2 p-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)]">
                  <div className="flex items-start justify-between">
                    <div className="text-sm font-medium text-[var(--color-text-primary)] truncate pr-2">{conflict.conflict_type}</div>
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: SEVERITY_COLORS[conflict.severity] ?? "#4d6a8a" }} />
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)] truncate">{conflict.description}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-center py-8 text-[var(--color-text-muted)]">No conflicts detected in current viewport</div>
          )}
        </div>
      </div>

      {/* Demo watermark */}
      <div className="text-xs text-center py-2" style={{ color: "var(--color-text-muted)" }}>
        ⚠ DEMO PROTOTYPE — Data is simulated for SIH 2026. Not for production use. · 3D-BhuMap v1.0.0-sih2026
      </div>
    </div>
  );
}
