"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { getStatusBadgeClass, getConfidenceClass } from "@/lib/utils";
import { Search, Map } from "lucide-react";
import { useState } from "react";

export default function BuildingsPage() {
  const [search, setSearch] = useState("");

  const { data: buildings, isLoading } = useQuery({
    queryKey: ["buildings"],
    queryFn: async () => {
      const { data } = await supabase.from("buildings").select("*, parcels(ulpin, village)").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const filtered = buildings?.filter(b =>
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.building_code?.toLowerCase().includes(search.toLowerCase()) ||
    (b.parcels as { ulpin?: string })?.ulpin?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 h-full overflow-auto max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">Buildings</h2>
          <p className="text-sm font-light text-slate-400">
            {buildings?.length ?? 0} buildings · AI-extracted · 3D cadastral data
          </p>
        </div>
        <Link href="/map" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-300 bg-[var(--color-surface-2)] hover:bg-slate-700 hover:text-white transition-colors border border-[var(--color-border-subtle)]">
          <Map className="w-4 h-4" /> View on Map
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search building name, code, ULPIN..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm outline-none bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-white placeholder-slate-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-5 rounded-xl skeleton" style={{ height: 180, border: "1px solid var(--color-border-subtle)", background: "var(--color-surface)" }} />
          ))
        ) : filtered?.map(building => (
          <Link key={building.id} href={`/buildings/${building.id}`}
            className="p-5 rounded-xl transition-all group flex flex-col bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-2)] hover:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[11px] font-mono font-medium text-blue-400 tracking-wider bg-blue-500/10 px-2 py-0.5 rounded">{building.building_code}</div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${getStatusBadgeClass(building.status)}`}>
                {building.status}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="text-base font-medium text-white mb-0.5 truncate">{building.name}</div>
              <div className="text-[13px] text-slate-400 font-light truncate">{building.building_type}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-auto">
              <div className="bg-[var(--color-background)]/50 border border-[var(--color-border-subtle)] rounded-lg p-2 flex flex-col justify-center items-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Levels</div>
                <div className="font-medium text-slate-200 text-xs">{building.floor_count}F + {building.basement_count}B</div>
              </div>
              <div className="bg-[var(--color-background)]/50 border border-[var(--color-border-subtle)] rounded-lg p-2 flex flex-col justify-center items-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Height</div>
                <div className="font-medium text-slate-200 text-xs">{building.height_m}m</div>
              </div>
              <div className="bg-[var(--color-background)]/50 border border-[var(--color-border-subtle)] rounded-lg p-2 flex flex-col justify-center items-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">AI Conf</div>
                <div className={`font-medium text-xs ${getConfidenceClass(building.ai_confidence ?? 0)}`}>
                  {building.ai_confidence?.toFixed(0)}%
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
              <div className="text-[11px] text-slate-500 truncate">
                ULPIN: {(building.parcels as { ulpin?: string })?.ulpin ?? "—"}
              </div>
              <div className="text-[11px] font-medium text-slate-400 group-hover:text-blue-400 transition-colors">
                View &rarr;
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {!isLoading && filtered?.length === 0 && (
        <div className="text-center py-16 text-slate-500 text-sm font-light">
          No buildings match your search query.
        </div>
      )}
    </div>
  );
}
