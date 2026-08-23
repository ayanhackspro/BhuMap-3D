"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getStatusBadgeClass } from "@/lib/utils";
import { Database, Upload, Download, RefreshCw } from "lucide-react";

export default function DatasetsPage() {
  const { data: datasets, isLoading } = useQuery({
    queryKey: ["datasets"],
    queryFn: async () => {
      const { data } = await supabase.from("datasets").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  function formatFileSize(bytes: number): string {
    if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  const FORMAT_COLORS: Record<string, string> = {
    geotiff: "#ff9800", las: "#4caf50", laz: "#4caf50",
    geojson: "#2196f3", shapefile: "#9c27b0", geopackage: "#607d8b",
    las_cloud: "#4caf50", csv: "#607d8b", citygml: "#e91e63",
    glb: "#ff5722", ifc: "#795548",
  };

  return (
    <div className="p-6 h-full overflow-auto max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">Datasets</h2>
          <p className="text-sm font-light text-slate-400">
            {datasets?.length ?? 0} imported datasets · GeoTIFF, LAS, GeoJSON, Shapefile
          </p>
        </div>
        <button
          onClick={() => alert("DEMO: In production, this would open the data import wizard.\n\nSupported formats:\n• GeoTIFF (orthophoto, DEM, DSM)\n• LAZ/LAS (LiDAR point cloud)\n• GeoJSON / Shapefile / GeoPackage\n• IFC / CityGML (BIM data)\n• CSV (tabular with coordinates)\n• DXF (CAD drawings)")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white shadow-md shadow-blue-500/20 transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, var(--color-primary-light), var(--color-primary))" }}>
          <Upload className="w-4 h-4" />
          Import Dataset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-48 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]" />
          ))
        ) : datasets?.map(dataset => (
          <div key={dataset.id} className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-2)] transition-all shadow-sm flex flex-col group">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-widest shadow-sm"
                style={{ background: `${FORMAT_COLORS[dataset.format] ?? "#607d8b"}22`, color: FORMAT_COLORS[dataset.format] ?? "#607d8b", border: `1px solid ${FORMAT_COLORS[dataset.format] ?? "#607d8b"}44` }}>
                {dataset.format}
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getStatusBadgeClass(dataset.status)}`}>
                {dataset.status}
              </span>
            </div>
            <div className="font-medium text-white text-base mb-3 truncate" title={dataset.name}>{dataset.name}</div>
            
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-light mb-4 flex-1">
              <div className="bg-[var(--color-background)]/50 p-2 rounded-lg border border-[var(--color-border-subtle)]">
                <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Size</span>
                <span className="text-slate-200 font-medium">{dataset.file_size_bytes ? formatFileSize(dataset.file_size_bytes) : "—"}</span>
              </div>
              {dataset.crs && (
                <div className="bg-[var(--color-background)]/50 p-2 rounded-lg border border-[var(--color-border-subtle)] truncate" title={dataset.crs}>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">CRS</span>
                  <span className="text-slate-200 font-medium font-mono">{dataset.crs}</span>
                </div>
              )}
              {dataset.feature_count && (
                <div className="bg-[var(--color-background)]/50 p-2 rounded-lg border border-[var(--color-border-subtle)]">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Features</span>
                  <span className="text-slate-200 font-medium">{dataset.feature_count.toLocaleString()}</span>
                </div>
              )}
              {dataset.metadata?.resolution_cm && (
                <div className="bg-[var(--color-background)]/50 p-2 rounded-lg border border-[var(--color-border-subtle)]">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Res</span>
                  <span className="text-slate-200 font-medium">{dataset.metadata.resolution_cm}cm/px</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[var(--color-border-subtle)]">
              <button className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-medium px-3 py-2 rounded-lg transition-all bg-[var(--color-background)] text-slate-400 hover:text-white border border-[var(--color-border-subtle)] hover:border-slate-500 shadow-sm">
                <Download className="w-3.5 h-3.5" /> Export
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-medium px-3 py-2 rounded-lg transition-all bg-[var(--color-background)] text-slate-400 hover:text-white border border-[var(--color-border-subtle)] hover:border-slate-500 shadow-sm">
                <RefreshCw className="w-3.5 h-3.5" /> Reprocess
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
