"use client";

import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Government Dashboard", subtitle: "Overview of 3D cadastral mapping progress" },
  "/map": { title: "3D GIS Map", subtitle: "Interactive 3D cadastral viewer — Patna, Bihar demo area" },
  "/parcels": { title: "Cadastral Parcels", subtitle: "ULPIN-indexed land parcel registry" },
  "/buildings": { title: "Buildings", subtitle: "3D building footprints and volumes" },
  "/properties": { title: "3D Properties", subtitle: "Vertical property units with 3DSPID identifiers" },
  "/surveys": { title: "Survey Management", subtitle: "Field surveys and GNSS observations" },
  "/datasets": { title: "Datasets", subtitle: "Imported geospatial datasets" },
  "/datasets/upload": { title: "Data Import Wizard", subtitle: "Upload and process geospatial data" },
  "/processing": { title: "Processing Queue", subtitle: "Background AI and data processing jobs" },
  "/validation": { title: "Topology Validation", subtitle: "Geometric and spatial validation results" },
  "/conflicts": { title: "Conflict Detection", subtitle: "3D spatial conflicts between objects" },
  "/approvals": { title: "Approval Workflow", subtitle: "Government authority review and approval" },
  "/reports": { title: "Reports", subtitle: "Generate cadastral reports and exports" },
  "/audit": { title: "Audit Log", subtitle: "Complete record of all system actions" },
  "/settings": { title: "Settings", subtitle: "System configuration and administration" },
};

export function AppTopbar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const pageInfo = PAGE_TITLES[pathname ?? ""] ?? { title: "3D-BhuMap", subtitle: "3D Cadastral Mapping System" };

  return (
    <header className="flex items-center gap-4 px-6 flex-shrink-0 z-10 bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-border-subtle)]"
      style={{ height: 64 }}>
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-medium text-[var(--color-text-primary)] truncate tracking-tight">{pageInfo.title}</h1>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-400" />
          <span className="text-sm hidden sm:inline truncate text-[var(--color-text-secondary)] font-light">
            {pageInfo.subtitle}
          </span>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) router.push(`/map?search=${encodeURIComponent(searchQuery)}`); }}
        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)]/50 hover:bg-[var(--color-surface-2)] focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all"
        style={{ width: 260 }}>
        <Search className="w-4 h-4 text-[var(--color-text-muted)]" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search ULPIN, 3DSPID..."
          className="flex-1 bg-transparent text-sm outline-none min-w-0 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
        />
      </form>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* System status */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full border border-green-500/20 bg-green-500/10 text-xs font-medium text-green-400">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          DB Live
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-[var(--color-surface-2)] transition-colors text-slate-400 hover:text-white">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 border-2 border-[var(--color-background)]" />
        </button>
      </div>
    </header>
  );
}
