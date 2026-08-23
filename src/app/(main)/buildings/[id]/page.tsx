"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Map, Building, Layers } from "lucide-react";
import { getStatusBadgeClass, getConfidenceClass } from "@/lib/utils";
import Link from "next/link";
import { use } from "react";

export default function BuildingDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();

  const { data: building, isLoading } = useQuery({
    queryKey: ["building", params.id],
    queryFn: async () => {
      const { data } = await supabase.from("buildings").select("*, parcels(ulpin, village)").eq("id", params.id).single();
      return data;
    },
  });

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!building) return <div className="p-6">Building not found.</div>;

  return (
    <div className="p-6 h-full overflow-auto">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-xs mb-6 hover:underline" style={{ color: "var(--color-text-secondary)" }}>
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Buildings
      </button>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-white">{building.name}</h2>
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${getStatusBadgeClass(building.status)}`}>
              {building.status}
            </span>
          </div>
          <p className="text-sm font-mono-id" style={{ color: "var(--color-text-secondary)" }}>
            Code: {building.building_code} · ULPIN: {(building.parcels as any)?.ulpin ?? "—"}
          </p>
        </div>
        <Link href="/map" className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white"
          style={{ background: "var(--color-primary)" }}>
          <Map className="w-3.5 h-3.5" /> View on Map
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Building className="w-4 h-4" style={{ color: "var(--color-primary-light)" }} /> Structural Details
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>Building Type</span>
              <span className="text-white">{building.building_type}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>Total Height</span>
              <span className="text-white">{building.height_m}m</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>Footprint Area</span>
              <span className="text-white">{building.footprint_area_sqm}m²</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>Floors (Above Ground)</span>
              <span className="text-white">{building.floor_count}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>Basements</span>
              <span className="text-white">{building.basement_count}</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
           <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4" style={{ color: "#ce93d8" }} /> Extraction Metadata
          </h3>
           <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>AI Confidence</span>
              <span className={getConfidenceClass(building.ai_confidence ?? 0)}>
                {building.ai_confidence?.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>Extracted Date</span>
              <span className="text-white">{new Date(building.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
