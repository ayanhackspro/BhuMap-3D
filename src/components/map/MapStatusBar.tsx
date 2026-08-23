"use client";

import { useMapStore } from "@/store/mapStore";
import { formatCoordinate } from "@/lib/utils";

export function MapStatusBar() {
  const { cursorCoords, zoom } = useMapStore();

  return (
    <div className="flex items-center gap-4 px-4 flex-shrink-0 text-xs"
      style={{ height: 28, background: "var(--color-surface-2)", borderTop: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}>
      <span className="font-mono-id">
        {cursorCoords
          ? `Lat: ${formatCoordinate(cursorCoords.lat)}  Lng: ${formatCoordinate(cursorCoords.lng)}  Elev: ${cursorCoords.elevation.toFixed(1)}m`
          : "Lat: 25.590200  Lng: 85.098000  Elev: 53.5m"}
      </span>
      <span style={{ color: "var(--color-border)" }}>|</span>
      <span>CRS: WGS84 / EPSG:4326</span>
      <span style={{ color: "var(--color-border)" }}>|</span>
      <span>Scale: 1:{Math.round(591657550.5 / Math.pow(2, zoom)).toLocaleString()}</span>
      <span style={{ color: "var(--color-border)" }}>|</span>
      <span>Source: Survey of India · ISRO Cartosat-3 · DJI L2</span>
      <div className="ml-auto flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span>Live · Supabase PostGIS</span>
      </div>
    </div>
  );
}
