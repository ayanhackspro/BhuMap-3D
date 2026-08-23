"use client";

import { useMapStore } from "@/store/mapStore";
import {
  Ruler, Square, Mountain, ArrowDownFromLine, Layers,
  RotateCcw, ZoomIn, ZoomOut, Navigation, Brain, AlertTriangle
} from "lucide-react";


interface MapToolbarProps {
  viewerRef: React.MutableRefObject<unknown>;
}

export function MapToolbar({ viewerRef }: MapToolbarProps) {
  const { measureMode, setMeasureMode, isUndergroundMode, toggleUndergroundMode, isExplodedView, toggleExplodedView } = useMapStore();

  async function zoomToDemo() {
    if (!viewerRef.current) return;
    try {
      // Cesium is loaded via script tag into window, not via npm module
      const Cesium = (window as any).Cesium;
      if (!Cesium) return;
      const v = viewerRef.current as Record<string, unknown>;
      (v.camera as { flyTo: (opts: unknown) => void }).flyTo({
        destination: Cesium.Cartesian3.fromDegrees(85.0940, 25.5870, 500),
        orientation: {
          heading: Cesium.Math.toRadians(30),
          pitch: Cesium.Math.toRadians(-25),
          roll: 0,
        },
        duration: 1.5,
      });
    } catch { /* ignore */ }
  }

  function resetView() {
    zoomToDemo();
  }

  return (
    <div className="flex items-center gap-1 px-3 flex-shrink-0"
      style={{ height: 40, background: "var(--color-surface-2)", borderBottom: "1px solid var(--color-border)" }}>
      {/* Zoom to demo */}
      <button onClick={zoomToDemo}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all"
        style={{ background: "var(--color-primary)", color: "white" }}
        title="Zoom to Patna demo area">
        <Navigation className="w-3.5 h-3.5" />
        Demo Area
      </button>

      <div className="w-px h-5 mx-1" style={{ background: "var(--color-border)" }} />

      {/* Measure tools */}
      <div className="flex items-center gap-0.5">
        {[
          { mode: "distance" as const, icon: Ruler, label: "Measure Distance" },
          { mode: "area" as const, icon: Square, label: "Measure Area" },
          { mode: "height" as const, icon: Mountain, label: "Measure Height" },
        ].map(({ mode, icon: Icon, label }) => (
          <button key={mode}
            onClick={() => setMeasureMode(measureMode === mode ? "none" : mode)}
            className="p-1.5 rounded text-xs transition-all"
            title={label}
            style={{
              background: measureMode === mode ? "rgba(21,101,192,0.15)" : "transparent",
              color: measureMode === mode ? "var(--color-primary)" : "var(--color-text-muted)",
            }}>
            <Icon className="w-3.5 h-3.5" />
          </button>
        ))}
      </div>

      <div className="w-px h-5 mx-1" style={{ background: "var(--color-border)" }} />

      {/* Special modes */}
      <button onClick={toggleExplodedView}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all"
        style={{
          background: isExplodedView ? "rgba(21,101,192,0.15)" : "var(--color-surface-3)",
          color: isExplodedView ? "var(--color-primary)" : "var(--color-text-secondary)",
          border: `1px solid ${isExplodedView ? "var(--color-primary)" : "var(--color-border-subtle)"}`,
        }}
        title="Explode building floors">
        <Layers className="w-3.5 h-3.5" />
        Explode Building
      </button>

      <button onClick={toggleUndergroundMode}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all"
        style={{
          background: isUndergroundMode ? "rgba(183,28,28,0.15)" : "var(--color-surface-3)",
          color: isUndergroundMode ? "#b71c1c" : "var(--color-text-secondary)",
          border: `1px solid ${isUndergroundMode ? "#b71c1c" : "var(--color-border-subtle)"}`,
        }}
        title="Toggle underground mode">
        <ArrowDownFromLine className="w-3.5 h-3.5" />
        Underground Mode
      </button>

      <div className="w-px h-5 mx-1" style={{ background: "var(--color-border)" }} />

      {/* AI Extract */}
      <button
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all"
        style={{ background: "rgba(123,31,162,0.15)", color: "#7b1fa2", border: "1px solid rgba(123,31,162,0.4)" }}
        title="AI building extraction (demo simulation)"
        onClick={() => alert("🤖 DEMO SIMULATION\n\nAI Building Extraction\n\nInput: Drone Orthophoto + DSM\nOutput: 6 buildings detected\n\n• Urban Tower A — 92.5% confidence\n• Residential Block B — 87.3% confidence\n• Commercial Plaza C — 78.9% confidence\n• Residential Villa D — 91.2% confidence\n• Industrial Unit E — 65.4% confidence\n• Government Office F — 95.1% confidence\n\nNote: This is a deterministic demo simulation, not a real ML model.")}>
        <Brain className="w-3.5 h-3.5" />
        AI Extract
      </button>

      {/* Conflict detect */}
      <button
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all"
        style={{ background: "rgba(183,28,28,0.15)", color: "#b71c1c", border: "1px solid rgba(183,28,28,0.4)" }}
        title="Run conflict detection"
        onClick={() => alert("⚠ CONFLICT DETECTION RESULTS\n\n1 spatial conflict detected:\n\n🔴 HIGH SEVERITY\nType: Utility/Property Intersection\nObject A: Main Sewer Line (elevation 47.5–50.5m)\nObject B: Urban Tower A — Basement 2 (47.5–50.5m)\nLocation: 25.5902°N, 85.0960°E\n\nDescription: 3D volume intersection detected. The sewer line passes through the registered property volume of Basement 2.\n\nAction Required: Surveyor review and resolution")}>
        <AlertTriangle className="w-3.5 h-3.5" />
        Detect Conflicts
      </button>

      <button onClick={resetView} className="ml-auto p-1.5 rounded transition-all" title="Reset view"
        style={{ color: "var(--color-text-muted)" }}>
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
