"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { getStatusBadgeClass, getConfidenceClass } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";

export default function PropertiesPage() {
  const [search, setSearch] = useState("");

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data } = await supabase
        .from("properties")
        .select("*, buildings(name, building_code), floors(floor_name, floor_number)")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const filtered = properties?.filter(p =>
    p.spid_3d?.toLowerCase().includes(search.toLowerCase()) ||
    p.parent_ulpin?.toLowerCase().includes(search.toLowerCase()) ||
    p.unit_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 h-full overflow-auto max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">3D Properties</h2>
          <p className="text-sm font-light text-slate-400">
            {properties?.length ?? 0} property units · 3DSPID-registered · Urban Tower A demo
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search 3DSPID, ULPIN, unit..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm outline-none bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-white placeholder-slate-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-background)]/50">
                {["3DSPID", "ULPIN", "Building", "Floor", "Unit", "Type", "Area", "AI Conf.", "Approval"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="bg-[var(--color-surface)]">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="skeleton h-4 rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered?.map(prop => (
                <tr key={prop.id} className="group hover:bg-[var(--color-surface-2)] transition-colors bg-[var(--color-surface)]">
                  <td className="px-5 py-4">
                    <Link href={`/properties/${prop.id}`} className="font-mono text-[11px] font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded tracking-wider">
                      {prop.spid_3d}
                    </Link>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-slate-400">{prop.parent_ulpin}</td>
                  <td className="px-5 py-4 text-white font-medium">{(prop.buildings as { name?: string })?.name ?? "—"}</td>
                  <td className="px-5 py-4 text-slate-400">
                    {(prop.floors as { floor_name?: string })?.floor_name ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-white">{prop.unit_number}</td>
                  <td className="px-5 py-4 text-slate-400">{prop.property_type}</td>
                  <td className="px-5 py-4 text-white font-medium">{prop.area_sqm}m²</td>
                  <td className="px-5 py-4">
                    <span className={getConfidenceClass(prop.ai_confidence ?? 0)}>
                      {prop.ai_confidence?.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${getStatusBadgeClass(prop.approval_status)}`}>
                      {prop.approval_status?.replace(/_/g, " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && filtered?.length === 0 && (
          <div className="text-center py-16 text-slate-500 text-sm font-light">
            No properties match your search query.
          </div>
        )}
      </div>
    </div>
  );
}
