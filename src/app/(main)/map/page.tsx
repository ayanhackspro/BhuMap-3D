"use client";

import { useEffect, useRef, useState } from "react";
import { useMapStore } from "@/store/mapStore";
import { supabase } from "@/lib/supabase";
import {
  Layers, ChevronLeft, ChevronRight, ArrowDownFromLine, AlertTriangle
} from "lucide-react";
import { LayerPanel } from "@/components/map/LayerPanel";
import { RightPanel } from "@/components/map/RightPanel";
import { MapStatusBar } from "@/components/map/MapStatusBar";
import { MapToolbar } from "@/components/map/MapToolbar";

// ---------------------------------------------------------------------------
// Property pins — overlaid on real buildings on BOTH render paths
// Coordinates correspond to structures visible in Patna satellite imagery.
// ---------------------------------------------------------------------------
const PROPERTY_PINS = [
  { name: "Urban Tower A",      spid: "3DSPID-IN-BR-0001-F02-U001", lon: 85.0960, lat: 25.5912, pinColor: "#4fc3f7", bgColor: "#0288d1", height: 180 },
  { name: "Residential Block B",spid: "3DSPID-IN-BR-0001-F01-U002", lon: 85.0935, lat: 25.5902, pinColor: "#26c6da", bgColor: "#0097a7", height: 90  },
  { name: "Commercial Plaza C", spid: "3DSPID-IN-BR-0001-F00-U003", lon: 85.0980, lat: 25.5898, pinColor: "#b39ddb", bgColor: "#7c4dff", height: 60  },
  { name: "Industrial Unit E",  spid: "3DSPID-IN-BR-0001-F00-U005", lon: 85.0950, lat: 25.5885, pinColor: "#ffb74d", bgColor: "#f57c00", height: 45  },
  { name: "Government Office F",spid: "3DSPID-IN-BR-0001-F02-U006", lon: 85.0972, lat: 25.5920, pinColor: "#66bb6a", bgColor: "#388e3c", height: 55  },
];

// ---------------------------------------------------------------------------
// Polygon footprints for the NO-TOKEN fallback.
// Approximate outlines digitised from OSM for the Patna demo area.
// TERRAIN_BASE = 60m accounts for Patna ground (~53m above WGS84) + buffer.
// ---------------------------------------------------------------------------
const TERRAIN_BASE = 60;
const BUILDING_FOOTPRINTS = [
  { name: "Urban Tower A",      h: 180, color: "#0288d1", outline: "#4fc3f7",
    coords: [85.09575, 25.59095, 85.09625, 25.59095, 85.09625, 25.59145, 85.09575, 25.59145] },
  { name: "Residential Block B",h: 90,  color: "#0097a7", outline: "#26c6da",
    coords: [85.09320, 25.58995, 85.09380, 25.58995, 85.09380, 25.59045, 85.09320, 25.59045] },
  { name: "Commercial Plaza C", h: 60,  color: "#7c4dff", outline: "#b39ddb",
    coords: [85.09765, 25.58950, 85.09835, 25.58950, 85.09835, 25.58985, 85.09765, 25.58985] },
  { name: "Industrial Unit E",  h: 45,  color: "#f57c00", outline: "#ffb74d",
    coords: [85.09460, 25.58820, 85.09540, 25.58820, 85.09540, 25.58880, 85.09460, 25.58880] },
  { name: "Government Office F",h: 55,  color: "#388e3c", outline: "#66bb6a",
    coords: [85.09690, 25.59175, 85.09750, 25.59175, 85.09750, 25.59225, 85.09690, 25.59225] },
];

export default function MapPage() {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<unknown>(null);
  const cesiumRef = useRef<unknown>(null);
  const osmBuildingsRef = useRef<unknown>(null);
  // Use a ref (not state) for osmActive so the render useEffect always reads
  // the current value without needing it as a dependency — avoids stale closure.
  const osmActiveRef = useRef(false);
  const [cesiumLoaded, setCesiumLoaded] = useState<number>(0);
  const [cesiumError, setCesiumError] = useState<string | null>(null);
  const [osmBadge, setOsmBadge] = useState(false); // UI-only copy for the badge
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const { isUndergroundMode, isExplodedView } = useMapStore();

  // ─── Main Cesium initialisation ─────────────────────────────────────────────────
  useEffect(() => {
    let viewer: unknown = null;
    let isMounted = true;

    async function initCesium() {
      try {
        (window as any).CESIUM_BASE_URL = "/cesium";

        const Cesium = await new Promise<any>((resolve, reject) => {
          if ((window as any).Cesium) return resolve((window as any).Cesium);
          const script = document.createElement("script");
          script.src = "/cesium/Cesium.js";
          script.onload = () => resolve((window as any).Cesium);
          script.onerror = () => reject(new Error("Failed to load Cesium script"));
          document.head.appendChild(script);
        });

        await import("cesium/Build/Cesium/Widgets/widgets.css");

        const token = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
        const hasToken = !!(token && token !== "your-cesium-ion-token-from-cesium.com");
        if (hasToken) Cesium.Ion.defaultAccessToken = token;

        if (!isMounted || !cesiumContainer.current) return;
        cesiumContainer.current.innerHTML = "";

        viewer = new Cesium.Viewer(cesiumContainer.current, {
          terrainProvider: hasToken
            ? await Cesium.createWorldTerrainAsync()
            : new Cesium.EllipsoidTerrainProvider(),
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          animation: false,
          timeline: false,
          fullscreenButton: false,
          infoBox: false,
          selectionIndicator: false,
          shadows: true,
          msaaSamples: 4,
        });

        if (!isMounted) {
          try { (viewer as any).destroy(); } catch (e) {}
          return;
        }

        const v = viewer as Record<string, unknown>;
        const scene = v.scene as any;

        scene.skyBox.show = false;
        scene.backgroundColor = { red: 0.043, green: 0.086, blue: 0.157, alpha: 1 };

        // Depth-test so entities don’t poke through terrain
        scene.globe.depthTestAgainstTerrain = true;

        viewerRef.current = viewer;
        cesiumRef.current = Cesium;

        // ── Load Cesium OSM Buildings (real building footprints from OpenStreetMap) ──
        // This global 3D tileset extrudes every OSM building polygon to its
        // real-world height, giving accurate footprint alignment with satellite
        // imagery and colour-coding by building usage tag.
        let osmLoaded = false;
        if (hasToken) {
          try {
            const osmTileset = await Cesium.createOsmBuildingsAsync({
              style: new Cesium.Cesium3DTileStyle({
                color: {
                  conditions: [
                    ["${feature['building']} === 'apartments' || ${feature['building']} === 'residential' || ${feature['building']} === 'house'", "color('#0288d1', 0.82)"],
                    ["${feature['building']} === 'commercial' || ${feature['building']} === 'retail' || ${feature['building']} === 'shop'",       "color('#7c4dff', 0.82)"],
                    ["${feature['building']} === 'office' || ${feature['building']} === 'government' || ${feature['building']} === 'public'",      "color('#388e3c', 0.82)"],
                    ["${feature['building']} === 'industrial' || ${feature['building']} === 'warehouse' || ${feature['building']} === 'factory'",  "color('#f57c00', 0.82)"],
                    ["${feature['building']} === 'hospital' || ${feature['building']} === 'school' || ${feature['building']} === 'university'",    "color('#e91e63', 0.82)"],
                    ["true", "color('#0097a7', 0.75)"],
                  ],
                },
              }),
            });
            
            if (isMounted) {
              scene.primitives.add(osmTileset);
              osmBuildingsRef.current = osmTileset;
              osmLoaded = true;
            } else {
              try { osmTileset.destroy(); } catch (e) {}
            }
          } catch (e) {
            console.warn("[BhuMap] OSM Buildings failed:", e);
          }
        }

        if (isMounted) {
          osmActiveRef.current = osmLoaded;
          setOsmBadge(osmLoaded); // trigger badge re-render only
        }

        // ── Camera ───────────────────────────────────────────────────────────────
        (v.camera as { flyTo: (opts: unknown) => void }).flyTo({
          destination: Cesium.Cartesian3.fromDegrees(85.0940, 25.5870, 500),
          orientation: {
            heading: Cesium.Math.toRadians(30),
            pitch: Cesium.Math.toRadians(-25),
            roll: 0,
          },
          duration: 2,
        });

        await loadDemoData();
        if (isMounted) setCesiumLoaded(Date.now());
      } catch (err) {
        console.error("Cesium init error:", err);
        if (isMounted) {
          setCesiumError("3D viewer failed. Check Cesium Ion token.");
          setCesiumLoaded(Date.now());
        }
      }
    }

    initCesium();

    return () => {
      isMounted = false;
      if (viewer && (viewer as Record<string, unknown>).destroy) {
        try { ((viewer as Record<string, unknown>).destroy as () => void)(); } catch (e) {}
      }
      viewerRef.current = null;
      cesiumRef.current = null;
      osmBuildingsRef.current = null;
    };
  }, []);

  // ─── Re-render entities + auto-fly when exploded-view changes ───────────
  useEffect(() => {
    if (!cesiumLoaded || !viewerRef.current || !cesiumRef.current) return;
    const Cesium = cesiumRef.current as any;
    const v = viewerRef.current as any;

    renderEntities(Cesium, viewerRef.current, isExplodedView, osmActiveRef.current);

    // When exploded view activates, fly the camera so the separated floors
    // are clearly visible front-and-centre.
    if (isExplodedView) {
      v.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(85.0958, 25.5895, 400),
        orientation: {
          heading: Cesium.Math.toRadians(10),
          pitch: Cesium.Math.toRadians(-15), // shallow angle shows floor separation
          roll: 0,
        },
        duration: 1.5,
      });
    }
  }, [isExplodedView, cesiumLoaded]);

  useEffect(() => {
    if (!viewerRef.current) return;
    const scene = (viewerRef.current as any).scene;
    if (!scene) return;
    scene.globe.translucency.enabled = isUndergroundMode;
    scene.globe.translucency.frontFaceAlpha = isUndergroundMode ? 0.3 : 1.0;
  }, [isUndergroundMode]);

  async function loadDemoData() {
    try {
      await supabase.from("parcels").select("ulpin");
    } catch (err) {
      console.warn("[BhuMap] Demo data fetch skipped (Supabase not configured):", err);
    }
  }

  return (
    <div className="flex h-full overflow-hidden relative" style={{ background: "var(--color-background)" }}>
      {/* Left sidebar */}
      <div className="flex-shrink-0 flex transition-all duration-200"
        style={{ width: leftOpen ? 268 : 0, overflow: "hidden" }}>
        <LayerPanel />
      </div>
      <button onClick={() => setLeftOpen(!leftOpen)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-r-md"
        style={{ left: leftOpen ? 268 : 0, background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderLeft: "none" }}>
        {leftOpen ? <ChevronLeft className="w-3 h-3" style={{ color: "var(--color-text-muted)" }} /> : <ChevronRight className="w-3 h-3" style={{ color: "var(--color-text-muted)" }} />}
      </button>

      {/* Main map area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Map toolbar */}
        <MapToolbar viewerRef={viewerRef} />

        {/* Cesium container */}
        <div className="flex-1 relative overflow-hidden">
          <div ref={cesiumContainer} id="cesium-container" className="w-full h-full" />

          {/* Loading overlay */}
          {!cesiumLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ background: "var(--color-background)" }}>
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
              <div className="text-white font-medium">Loading 3D Buildings...</div>
              <div className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>Connecting to Patna demo area</div>
            </div>
          )}

          {/* OSM buildings mode badge */}
          {cesiumLoaded > 0 && (
            <div className="absolute top-3 right-3 z-20">
              <div className="px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5"
                style={{
                  background: osmBadge ? "rgba(56,142,60,0.2)" : "rgba(245,127,23,0.15)",
                  border: `1px solid ${osmBadge ? "rgba(102,187,106,0.4)" : "rgba(245,127,23,0.3)"}`,
                  color: osmBadge ? "#66bb6a" : "#ffa726",
                }}>
                <div className={`w-1.5 h-1.5 rounded-full ${osmBadge ? "bg-green-400 animate-pulse" : "bg-orange-400"}`} />
                {osmBadge
                  ? "OSM 3D Buildings — Real footprints active"
                  : "Polygon mode — Add Ion token for real OSM buildings"}
              </div>
            </div>
          )}

          {/* Cesium error fallback */}
          {cesiumError && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 max-w-md">
              <div className="px-4 py-3 rounded-lg text-sm flex items-start gap-2"
                style={{ background: "rgba(245,127,23,0.15)", border: "1px solid rgba(245,127,23,0.3)", color: "#ffa726" }}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">No Cesium Ion Token</div>
                  <div className="text-xs mt-0.5 opacity-80">Add NEXT_PUBLIC_CESIUM_ION_TOKEN to .env.local for full 3D terrain. Demo data is loaded.</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode indicators — stacked so they never overlap */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
            {isUndergroundMode && (
              <div className="px-4 py-2 rounded-full text-sm flex items-center gap-2 whitespace-nowrap"
                style={{ background: "rgba(183,28,28,0.8)", color: "#ffcdd2", border: "1px solid rgba(239,83,80,0.5)" }}>
                <ArrowDownFromLine className="w-4 h-4" />
                Underground Mode Active — Terrain is transparent
              </div>
            )}
            {isExplodedView && (
              <div className="px-4 py-2 rounded-full text-sm flex items-center gap-2 whitespace-nowrap"
                style={{ background: "rgba(21,101,192,0.8)", color: "#bbdefb", border: "1px solid rgba(33,150,243,0.5)" }}>
                <Layers className="w-4 h-4" />
                Exploded Building View — Floors are separated
              </div>
            )}
          </div>
        </div>

        {/* Status bar */}
        <MapStatusBar />
      </div>

      {/* Right sidebar */}
      <button onClick={() => setRightOpen(!rightOpen)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-l-md"
        style={{ right: rightOpen ? 308 : 0, background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRight: "none" }}>
        {rightOpen ? <ChevronRight className="w-3 h-3" style={{ color: "var(--color-text-muted)" }} /> : <ChevronLeft className="w-3 h-3" style={{ color: "var(--color-text-muted)" }} />}
      </button>
      <div className="flex-shrink-0 transition-all duration-200"
        style={{ width: rightOpen ? 308 : 0, overflow: "hidden" }}>
        <RightPanel />
      </div>
    </div>
  );
}

// =============================================================================
// renderEntities — MODULE SCOPE (no closure over component state)
// Called from a useEffect with all values passed explicitly as arguments.
// Keeping it outside the component guarantees React never captures a stale
// version of the function — fixing the explode-view stale-closure bug.
// =============================================================================
function renderEntities(
  Cesium: any,
  viewer: unknown,
  exploded: boolean,
  hasOSM: boolean,
) {
  const v = viewer as Record<string, unknown>;
  const entities = v.entities as { removeAll: () => void; add: (e: unknown) => void };
  entities.removeAll();

  if (!hasOSM) {
    // ── Fallback: polygon extrusion on manually-digitised footprints ─────────
    for (const b of BUILDING_FOOTPRINTS) {
      entities.add({
        name: b.name,
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(
            Cesium.Cartesian3.fromDegreesArray(b.coords)
          ),
          height: TERRAIN_BASE,
          extrudedHeight: TERRAIN_BASE + b.h,
          material: Cesium.Color.fromCssColorString(b.color).withAlpha(0.88),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString(b.outline),
          outlineWidth: 2,
          closeTop: true,
          closeBottom: true,
        },
      });
    }
  }

  // ── Property PIN markers (always shown on both paths) ──────────────────────
  for (const pin of PROPERTY_PINS) {
    const pinH = TERRAIN_BASE + pin.height + 8;
    entities.add({
      name: pin.name,
      position: Cesium.Cartesian3.fromDegrees(pin.lon, pin.lat, pinH),
      point: {
        pixelSize: 10,
        color: Cesium.Color.fromCssColorString(pin.pinColor),
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        scaleByDistance: new Cesium.NearFarScalar(200, 1.5, 5000, 0.5),
      },
      label: {
        text: `${pin.name}\n${pin.spid}`,
        font: "bold 12px sans-serif",
        fillColor: Cesium.Color.WHITE,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -14),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        scaleByDistance: new Cesium.NearFarScalar(200, 1.1, 3000, 0.55),
        translucencyByDistance: new Cesium.NearFarScalar(1500, 1.0, 5000, 0.0),
        backgroundColor: Cesium.Color.fromCssColorString(pin.bgColor).withAlpha(0.75),
        showBackground: true,
        backgroundPadding: new Cesium.Cartesian2(6, 4),
      },
    });
  }

  // ── Exploded view: float detached floors above Urban Tower A ────────────
  // We draw separate polygon slabs. To avoid clipping with the solid OSM
  // building, we start the explosion BASE *above* the actual building height.
  if (exploded) {
    const towerFootprint = BUILDING_FOOTPRINTS.find((b) => b.name === "Urban Tower A");
    const towerCoords = towerFootprint?.coords ?? [
      85.09575, 25.59095, 85.09625, 25.59095,
      85.09625, 25.59145, 85.09575, 25.59145,
    ];
    const towerH = towerFootprint?.h ?? 180;
    
    const FLOOR_H = 15;      // height of each exploded slab
    const GAP = 12;          // gap between slabs
    // Start the stack completely above the OSM building!
    const BASE = TERRAIN_BASE + towerH + 20; 

    const FLOORS = [
      { label: "Ground Floor — Retail", color: "#f57c00" },
      { label: "1st Floor — Parking",   color: "#0097a7" },
      { label: "2nd Floor — Office",    color: "#388e3c" },
      { label: "3rd Floor — Residential", color: "#0288d1" },
      { label: "4th Floor — Residential", color: "#1565c0" },
      { label: "5th Floor — Penthouse",  color: "#7c4dff" },
    ];

    for (let i = 0; i < FLOORS.length; i++) {
      const slabBottom = BASE + i * (FLOOR_H + GAP);
      const slabTop = slabBottom + FLOOR_H;
      const slabMid = (slabBottom + slabTop) / 2;
      const floor = FLOORS[i];

      entities.add({
        name: `Urban Tower A — ${floor.label}`,
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(
            Cesium.Cartesian3.fromDegreesArray(towerCoords)
          ),
          height: slabBottom,
          extrudedHeight: slabTop,
          material: Cesium.Color.fromCssColorString(floor.color).withAlpha(0.92),
          outline: true,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          closeTop: true,
          closeBottom: true,
        },
      });

      // Label centred in the slab
      entities.add({
        name: `Label — ${floor.label}`,
        position: Cesium.Cartesian3.fromDegrees(85.0960, 25.5912, slabMid),
        label: {
          text: floor.label,
          font: "bold 11px sans-serif",
          fillColor: Cesium.Color.WHITE,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 2000, 0.4),
          translucencyByDistance: new Cesium.NearFarScalar(800, 1.0, 3000, 0.0),
          showBackground: true,
          backgroundColor: Cesium.Color.fromCssColorString(floor.color).withAlpha(0.8),
          backgroundPadding: new Cesium.Cartesian2(5, 3),
        },
      });
    }
  }
}
