"use client";
import { useAuthStore } from "@/store/authStore";
import { Settings } from "lucide-react";
export default function SettingsPage() {
  const { user } = useAuthStore();
  return (
    <div className="p-6 h-full overflow-auto max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">System Settings</h2>
        <p className="text-sm font-light text-slate-400">System configuration and administration details</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { key: "Supabase Project", value: "kfzhmlolrmdkxkrypedk.supabase.co" },
          { key: "Database", value: "PostgreSQL + PostGIS (Supabase Cloud)" },
          { key: "Authentication", value: "Supabase Auth (demo mode)" },
          { key: "3D Viewer", value: "CesiumJS (add Ion token for terrain)" },
          { key: "AI Extraction", value: "Demo simulation (no ML runtime)" },
          { key: "Logged in as", value: user?.email ?? "—" },
          { key: "Role", value: user?.role ?? "—" },
          { key: "Version", value: "1.0.0-sih2026" },
          { key: "Deployment", value: "Vercel (planned) / localhost:3000 (dev)" },
          { key: "Data Coverage", value: "Patna, Bihar (synthetic demo data)" },
        ].map(item => (
          <div key={item.key} className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-sm hover:bg-[var(--color-surface-2)] transition-colors">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2">{item.key}</div>
            <div className="text-sm text-slate-200 font-medium">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
