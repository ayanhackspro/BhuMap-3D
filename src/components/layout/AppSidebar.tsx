"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  MapPin, LayoutDashboard, Map, FileText, Building2,
  Home, Compass, Database, Cpu, CheckSquare, AlertTriangle,
  ClipboardCheck, BarChart2, ScrollText, Settings, ChevronLeft,
  ChevronRight, LogOut, User, Layers
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/map", icon: Map, label: "3D Map", highlight: true },
  { divider: true, label: "Data" },
  { href: "/parcels", icon: FileText, label: "Parcels" },
  { href: "/buildings", icon: Building2, label: "Buildings" },
  { href: "/properties", icon: Home, label: "Properties" },
  { href: "/surveys", icon: Compass, label: "Surveys" },
  { divider: true, label: "Processing" },
  { href: "/datasets", icon: Database, label: "Datasets" },
  { href: "/processing", icon: Cpu, label: "Processing" },
  { divider: true, label: "Quality" },
  { href: "/validation", icon: CheckSquare, label: "Validation" },
  { href: "/conflicts", icon: AlertTriangle, label: "Conflicts" },
  { href: "/approvals", icon: ClipboardCheck, label: "Approvals" },
  { divider: true, label: "Administration" },
  { href: "/reports", icon: BarChart2, label: "Reports" },
  { href: "/audit", icon: ScrollText, label: "Audit Log" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const roleColors: Record<string, string> = {
    super_admin: "#ef5350",
    government_authority: "#42a5f5",
    surveyor: "#66bb6a",
    gis_analyst: "#ab47bc",
    utility_department: "#ffa726",
    property_owner: "#26c6da",
    public_viewer: "#78909c",
  };

  const roleColor = roleColors[user?.role ?? "public_viewer"] ?? "#78909c";

  return (
    <aside
      className="flex flex-col h-full flex-shrink-0 sidebar-transition overflow-hidden z-20"
      style={{
        width: collapsed ? 64 : 240,
        background: "var(--color-background)",
        borderRight: "1px solid var(--color-border-subtle)",
      }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-6 py-5 ${collapsed ? 'justify-center px-4' : ''}`}>
        <div 
          className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0 cursor-pointer shadow-md shadow-[var(--color-primary)]/20 hover:scale-105 transition-transform"
          onClick={() => setCollapsed(!collapsed)}
          title="Toggle Sidebar"
        >
          <Map className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-lg text-[var(--color-text-primary)] tracking-tight">3D-BhuMap</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 hidden-scrollbar">
        {NAV_ITEMS.map((item, idx) => {
          if ("divider" in item) {
            return collapsed ? (
              <div key={idx} className="my-3 mx-2 border-t border-[var(--color-border-subtle)]" />
            ) : (
              <div key={idx} className="px-3 pt-4 pb-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  {item.label}
                </span>
              </div>
            );
          }
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          const Icon = item.icon!;
          return (
            <Link key={item.href} href={item.href!}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group relative overflow-hidden ${isActive ? "bg-[var(--color-surface-2)]" : "hover:bg-[var(--color-surface)]"}`}
              title={collapsed ? item.label : undefined}
            >
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-blue-500 rounded-r-full" />}
              <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"}`} />
              {!collapsed && (
                <span className={`text-sm font-medium truncate transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}>
                  {item.label}
                </span>
              )}
              {!collapsed && item.highlight && !isActive && (
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">Live</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="flex-shrink-0 p-3 mt-auto">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer group">
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white shadow-sm"
            style={{ background: roleColor }}>
            {user?.full_name?.[0] ?? "U"}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-white truncate leading-none mb-1">{user?.full_name}</div>
              <div className="text-[10px] font-medium uppercase tracking-wider truncate" style={{ color: roleColor }}>
                {user?.role?.replace(/_/g, " ")}
              </div>
            </div>
          )}
          {!collapsed && (
            <button onClick={(e) => { e.preventDefault(); handleLogout(); }} className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
