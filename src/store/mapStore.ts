import { create } from "zustand";

export type LayerId =
  | "cadastral_parcels"
  | "buildings"
  | "floors"
  | "properties"
  | "roads"
  | "dem"
  | "dsm"
  | "lidar"
  | "orthophoto"
  | "gnss_points"
  | "underground_utilities"
  | "conflicts"
  | "survey_control";

export interface Layer {
  id: LayerId;
  name: string;
  visible: boolean;
  opacity: number;
  color: string;
  description: string;
}

export interface SelectedObject {
  type: "parcel" | "building" | "floor" | "property" | "underground" | "conflict";
  id: string;
  data: Record<string, unknown>;
}

interface MapStore {
  layers: Record<LayerId, Layer>;
  selectedObject: SelectedObject | null;
  isUndergroundMode: boolean;
  isExplodedView: boolean;
  explodeOffset: number;
  measureMode: "none" | "distance" | "area" | "height" | "volume";
  cursorCoords: { lng: number; lat: number; elevation: number } | null;
  zoom: number;

  toggleLayer: (id: LayerId) => void;
  setLayerOpacity: (id: LayerId, opacity: number) => void;
  selectObject: (obj: SelectedObject | null) => void;
  toggleUndergroundMode: () => void;
  toggleExplodedView: () => void;
  setExplodeOffset: (offset: number) => void;
  setMeasureMode: (mode: MapStore["measureMode"]) => void;
  setCursorCoords: (coords: MapStore["cursorCoords"]) => void;
  setZoom: (zoom: number) => void;
}

const DEFAULT_LAYERS: Record<LayerId, Layer> = {
  cadastral_parcels: { id: "cadastral_parcels", name: "Cadastral Parcels", visible: true, opacity: 0.8, color: "#1565c0", description: "2D cadastral parcel boundaries with ULPIN" },
  buildings: { id: "buildings", name: "Buildings", visible: true, opacity: 0.9, color: "#0288d1", description: "3D building footprints and volumes" },
  floors: { id: "floors", name: "Floor Levels", visible: true, opacity: 0.85, color: "#26c6da", description: "Individual floor extents" },
  properties: { id: "properties", name: "Properties (3DSPID)", visible: true, opacity: 0.8, color: "#7c4dff", description: "3D property units with 3DSPID identifiers" },
  roads: { id: "roads", name: "Roads", visible: true, opacity: 0.7, color: "#546e7a", description: "Road network" },
  dem: { id: "dem", name: "DEM (Terrain)", visible: false, opacity: 0.6, color: "#8d6e63", description: "Digital Elevation Model" },
  dsm: { id: "dsm", name: "DSM (Surface)", visible: false, opacity: 0.6, color: "#a1887f", description: "Digital Surface Model" },
  lidar: { id: "lidar", name: "LiDAR Point Cloud", visible: false, opacity: 0.8, color: "#4caf50", description: "LiDAR point cloud data" },
  orthophoto: { id: "orthophoto", name: "Drone Orthophoto", visible: false, opacity: 0.8, color: "#ffd54f", description: "Aerial drone orthophoto" },
  gnss_points: { id: "gnss_points", name: "GNSS Control Points", visible: true, opacity: 1.0, color: "#ff5722", description: "Survey GNSS/CORS control points" },
  underground_utilities: { id: "underground_utilities", name: "Underground Utilities", visible: false, opacity: 0.9, color: "#f44336", description: "Subsurface utility networks" },
  conflicts: { id: "conflicts", name: "Spatial Conflicts", visible: true, opacity: 1.0, color: "#ff9800", description: "Detected 3D spatial conflicts" },
  survey_control: { id: "survey_control", name: "Survey Control", visible: true, opacity: 0.9, color: "#e91e63", description: "Survey control network" },
};

export const useMapStore = create<MapStore>()((set) => ({
  layers: DEFAULT_LAYERS,
  selectedObject: null,
  isUndergroundMode: false,
  isExplodedView: false,
  explodeOffset: 10,
  measureMode: "none",
  cursorCoords: null,
  zoom: 17,

  toggleLayer: (id) =>
    set((s) => ({
      layers: { ...s.layers, [id]: { ...s.layers[id], visible: !s.layers[id].visible } },
    })),
  setLayerOpacity: (id, opacity) =>
    set((s) => ({
      layers: { ...s.layers, [id]: { ...s.layers[id], opacity } },
    })),
  selectObject: (selectedObject) => set({ selectedObject }),
  toggleUndergroundMode: () =>
    set((s) => ({
      isUndergroundMode: !s.isUndergroundMode,
      layers: {
        ...s.layers,
        underground_utilities: { ...s.layers.underground_utilities, visible: !s.isUndergroundMode },
      },
    })),
  toggleExplodedView: () => set((s) => ({ isExplodedView: !s.isExplodedView })),
  setExplodeOffset: (explodeOffset) => set({ explodeOffset }),
  setMeasureMode: (measureMode) => set({ measureMode }),
  setCursorCoords: (cursorCoords) => set({ cursorCoords }),
  setZoom: (zoom) => set({ zoom }),
}));
