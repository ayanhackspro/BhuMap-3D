"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Map, Home, ShieldCheck } from "lucide-react";
import { getStatusBadgeClass, getConfidenceClass } from "@/lib/utils";
import Link from "next/link";
import { use } from "react";

export default function PropertyDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();

  const { data: prop, isLoading } = useQuery({
    queryKey: ["property", params.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("properties")
        .select("*, buildings(name), floors(floor_name)")
        .eq("id", params.id).single();
      return data;
    },
  });

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!prop) return <div className="p-6">Property not found.</div>;

  return (
    <div className="p-6 h-full overflow-auto">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-xs mb-6 hover:underline" style={{ color: "var(--color-text-secondary)" }}>
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Properties
      </button>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold font-mono-id text-white">{prop.spid_3d}</h2>
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${getStatusBadgeClass(prop.approval_status)}`}>
              {prop.approval_status?.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Unit {prop.unit_number} · {(prop.buildings as any)?.name} · {(prop.floors as any)?.floor_name}
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
            <Home className="w-4 h-4" style={{ color: "var(--color-primary-light)" }} /> Property Details
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>Property Type</span>
              <span className="text-white">{prop.property_type}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>Area</span>
              <span className="text-white">{prop.area_sqm}m²</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>Parent ULPIN</span>
              <span className="text-white font-mono-id">{prop.parent_ulpin}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>Volume (3D)</span>
              <span className="text-white">{prop.volume_cbm ?? "—"} m³</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
           <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" style={{ color: "#66bb6a" }} /> Registration Status
          </h3>
           <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>AI Confidence</span>
              <span className={getConfidenceClass(prop.ai_confidence ?? 0)}>
                {prop.ai_confidence?.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>Registered Date</span>
              <span className="text-white">{new Date(prop.created_at).toLocaleDateString()}</span>
            </div>
            {prop.rejection_reason && (
               <div className="mt-4 p-3 rounded" style={{ background: "rgba(183,28,28,0.1)", border: "1px solid rgba(183,28,28,0.3)" }}>
                 <div className="text-xs mb-1" style={{ color: "#ef5350" }}>Rejection Reason:</div>
                 <div className="text-sm text-white">{prop.rejection_reason}</div>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
