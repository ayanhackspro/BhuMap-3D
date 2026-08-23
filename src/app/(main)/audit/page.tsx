"use client";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { formatTimestamp } from "@/lib/utils";
import { ScrollText } from "lucide-react";
export default function AuditPage() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(50);
      return data ?? [];
    },
  });
  return (
    <div className="p-6 h-full overflow-auto max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">Audit Log</h2>
        <p className="text-sm font-light text-slate-400">Complete immutable record of all system actions</p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-16 text-slate-500 text-sm font-light">Loading audit logs...</div>
      ) : !logs?.length ? (
        <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl">
          <ScrollText className="w-10 h-10 mx-auto mb-4 text-slate-600" />
          <div className="text-slate-400 text-sm font-light">No audit logs yet. Actions taken in the system will appear here.</div>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-background)]/50">
                  {["Timestamp", "User", "Role", "Action", "Entity Type", "Entity ID"].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)]">
                {logs?.map(log => (
                  <tr key={log.id} className="group hover:bg-[var(--color-surface-2)] transition-colors bg-[var(--color-surface)]">
                    <td className="px-5 py-4 text-[11px] font-mono text-slate-500">{formatTimestamp(log.created_at)}</td>
                    <td className="px-5 py-4 text-[13px] text-white font-medium">{log.user_email}</td>
                    <td className="px-5 py-4 text-[12px] text-slate-400">{log.user_role}</td>
                    <td className="px-5 py-4">
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-slate-400">{log.entity_type}</td>
                    <td className="px-5 py-4 font-mono text-[11px] text-slate-500">{log.entity_id?.slice(0, 8)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
