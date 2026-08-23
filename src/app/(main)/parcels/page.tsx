"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { getStatusBadgeClass, formatArea } from "@/lib/utils";
import { FileText, Search, Filter, Plus, Map } from "lucide-react";
import { useState } from "react";

export default function ParcelsPage() {
  const [search, setSearch] = useState("");

  const { data: parcels, isLoading } = useQuery({
    queryKey: ["parcels"],
    queryFn: async () => {
      const { data } = await supabase.from("parcels").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const filtered = parcels?.filter(p =>
    p.ulpin?.toLowerCase().includes(search.toLowerCase()) ||
    p.village?.toLowerCase().includes(search.toLowerCase()) ||
    p.district?.toLowerCase().includes(search.toLowerCase()) ||
    p.survey_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 h-full overflow-auto max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">Cadastral Parcels</h2>
          <p className="text-sm font-light text-slate-400">
            {parcels?.length ?? 0} parcels · ULPIN-indexed · Patna, Bihar
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/map" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-300 bg-[var(--color-surface-2)] hover:bg-slate-700 hover:text-white transition-colors border border-[var(--color-border-subtle)]">
            <Map className="w-4 h-4" />
            View on Map
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search ULPIN, village, survey number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm outline-none bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-white placeholder-slate-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-background)]/50">
                {["ULPIN", "Survey No.", "District", "Tehsil", "Village", "Area", "Status", ""].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="bg-[var(--color-surface)]">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="skeleton h-4 rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered?.map(parcel => (
                <tr key={parcel.id} className="group hover:bg-[var(--color-surface-2)] transition-colors bg-[var(--color-surface)]">
                  <td className="px-5 py-4 font-mono text-[13px] text-blue-400 font-medium">{parcel.ulpin}</td>
                  <td className="px-5 py-4 text-slate-300">{parcel.survey_number}</td>
                  <td className="px-5 py-4 text-white font-medium">{parcel.district}</td>
                  <td className="px-5 py-4 text-slate-400">{parcel.tehsil}</td>
                  <td className="px-5 py-4 text-slate-400">{parcel.village}</td>
                  <td className="px-5 py-4 text-white">{parcel.area_sqm ? formatArea(parcel.area_sqm) : "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${getStatusBadgeClass(parcel.status)}`}>
                      {parcel.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/parcels/${parcel.id}`} className="text-sm font-medium text-slate-400 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all">
                      View details &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && filtered?.length === 0 && (
          <div className="text-center py-16 text-slate-500 text-sm font-light">
            No parcels match your search query.
          </div>
        )}
      </div>
    </div>
  );
}
