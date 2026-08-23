"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Map, FileText, CheckCircle } from "lucide-react";
import { getStatusBadgeClass, formatArea } from "@/lib/utils";
import Link from "next/link";
import { use } from "react";

export default function ParcelDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();

  const { data: parcel, isLoading } = useQuery({
    queryKey: ["parcel", params.id],
    queryFn: async () => {
      const { data } = await supabase.from("parcels").select("*").eq("id", params.id).single();
      return data;
    },
  });

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!parcel) return <div className="p-6">Parcel not found.</div>;

  return (
    <div className="p-6 h-full overflow-auto">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-xs mb-6 hover:underline" style={{ color: "var(--color-text-secondary)" }}>
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Parcels
      </button>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-white">Parcel {parcel.ulpin}</h2>
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${getStatusBadgeClass(parcel.status)}`}>
              {parcel.status}
            </span>
          </div>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Survey No. {parcel.survey_number} · {parcel.village}, {parcel.district}
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
            <FileText className="w-4 h-4" style={{ color: "var(--color-primary-light)" }} /> Record Details
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>ULPIN</span>
              <span className="font-mono-id text-white">{parcel.ulpin}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>Area</span>
              <span className="text-white">{parcel.area_sqm ? formatArea(parcel.area_sqm) : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>Land Type</span>
              <span className="text-white">{parcel.land_type}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>State</span>
              <span className="text-white">{parcel.state}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>District</span>
              <span className="text-white">{parcel.district}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>Tehsil</span>
              <span className="text-white">{parcel.tehsil}</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
           <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" style={{ color: "#66bb6a" }} /> 3D Extents (Demo)
          </h3>
           <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>Min Elevation</span>
              <span className="text-white">{parcel.elevation_min_m ?? "45.0"} m</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>Max Elevation</span>
              <span className="text-white">{parcel.elevation_max_m ?? "120.0"} m</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>CRS</span>
              <span className="text-white">EPSG:4326</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
