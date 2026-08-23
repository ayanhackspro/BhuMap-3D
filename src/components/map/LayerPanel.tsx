"use client";

import { useMapStore, LayerId } from "@/store/mapStore";
import { Eye, EyeOff, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface LayerGroup {
  label: string;
  layers: LayerId[];
}

const LAYER_GROUPS: LayerGroup[] = [
  { label: "Cadastral", layers: ["cadastral_parcels", "buildings", "floors", "properties"] },
  { label: "Survey", layers: ["gnss_points", "survey_control"] },
  { label: "Remote Sensing", layers: ["orthophoto", "dem", "dsm", "lidar"] },
  { label: "Infrastructure", layers: ["roads", "underground_utilities"] },
  { label: "Analysis", layers: ["conflicts"] },
];

const LAYER_COLORS: Record<string, string> = {
  "#1565c0": "bg-blue-700",
  "#0288d1": "bg-blue-500",
  "#26c6da": "bg-cyan-400",
  "#7c4dff": "bg-violet-500",
  "#546e7a": "bg-slate-500",
  "#8d6e63": "bg-amber-700",
  "#a1887f": "bg-amber-600",
  "#4caf50": "bg-green-500",
  "#ffd54f": "bg-yellow-300",
  "#ff5722": "bg-orange-600",
  "#f44336": "bg-red-500",
  "#ff9800": "bg-orange-500",
  "#e91e63": "bg-pink-500",
};

export function LayerPanel() {
  const { layers, toggleLayer, setLayerOpacity } = useMapStore();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["Cadastral", "Analysis"]));

  function toggleGroup(label: string) {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }

  return (
    <div className="h-full flex flex-col overflow-hidden"
      style={{ background: "var(--color-surface)", borderRight: "1px solid var(--color-border)", width: 268 }}>
      {/* Header */}
      <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div className="text-sm font-semibold text-white">Layer Control</div>
        <div className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>Toggle and configure map layers</div>
      </div>

      {/* Layer Groups */}
      <div className="flex-1 overflow-y-auto py-2">
        {LAYER_GROUPS.map((group) => {
          const isExpanded = expandedGroups.has(group.label);
          const visibleCount = group.layers.filter(id => layers[id]?.visible).length;

          return (
            <div key={group.label} className="mb-1">
              <button onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors item-hover"
                style={{ color: "var(--color-text-muted)" }}>
                <div className="flex items-center gap-2">
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  {group.label}
                </div>
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--color-surface-2)", color: "var(--color-text-secondary)" }}>
                  {visibleCount}/{group.layers.length}
                </span>
              </button>

              {isExpanded && (
                <div className="space-y-0.5 px-2">
                  {group.layers.map((layerId) => {
                    const layer = layers[layerId];
                    if (!layer) return null;
                    return (
                      <div key={layerId} className="rounded-lg p-2.5 transition-colors"
                        style={{ background: layer.visible ? "var(--color-surface-2)" : "transparent" }}>
                        <div className="flex items-center gap-2.5">
                          {/* Color dot */}
                          <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: layer.color }} />

                          {/* Label */}
                          <span className="text-xs flex-1 truncate" style={{ color: layer.visible ? "var(--color-text-primary)" : "var(--color-text-muted)" }}>
                            {layer.name}
                          </span>

                          {/* Toggle */}
                          <button onClick={() => toggleLayer(layerId)} className="p-0.5 rounded transition-colors"
                            style={{ color: layer.visible ? "var(--color-primary-light)" : "var(--color-text-muted)" }}>
                            {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Opacity */}
                        {layer.visible && (
                          <div className="flex items-center gap-2 mt-2">
                            <input type="range" min={0} max={1} step={0.05}
                              value={layer.opacity}
                              onChange={(e) => setLayerOpacity(layerId, parseFloat(e.target.value))}
                              className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                              style={{ accentColor: "var(--color-primary-light)" }}
                            />
                            <span className="text-xs w-8 text-right" style={{ color: "var(--color-text-muted)" }}>
                              {Math.round(layer.opacity * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex-shrink-0 p-3" style={{ borderTop: "1px solid var(--color-border)" }}>
        <div className="text-xs font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>APPROVAL STATUS</div>
        <div className="space-y-1">
          {[
            { label: "Verified", color: "#66bb6a" },
            { label: "Provisional", color: "#ffa726" },
            { label: "Requires Review", color: "#ce93d8" },
            { label: "Draft", color: "#78909c" },
            { label: "Rejected", color: "#ef5350" },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: item.color }} />
              <span style={{ color: "var(--color-text-secondary)" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
