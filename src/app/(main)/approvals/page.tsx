"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore, hasPermission } from "@/store/authStore";
import { getStatusBadgeClass, formatTimestamp } from "@/lib/utils";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function ApprovalsPage() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  const canApprove = user && hasPermission(user.role, "approve");

  const { data: pending, isLoading } = useQuery({
    queryKey: ["approvals-pending"],
    queryFn: async () => {
      const { data } = await supabase
        .from("properties")
        .select("*, buildings(name), floors(floor_name)")
        .in("approval_status", ["provisional", "requires_review"])
        .order("created_at", { ascending: true });
      return data ?? [];
    },
  });

  async function handleApprove(id: string) {
    setProcessing(id);
    await supabase.from("properties").update({ approval_status: "verified" }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["approvals-pending"] });
    qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    setProcessing(null);
  }

  async function handleReject(id: string) {
    const reason = rejectReason[id]?.trim();
    if (!reason) {
      // Highlight the input instead of silently submitting
      alert("Please enter a rejection reason before rejecting.");
      return;
    }
    setProcessing(id);
    await supabase.from("properties").update({ approval_status: "rejected", rejection_reason: reason }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["approvals-pending"] });
    qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    setProcessing(null);
  }

  return (
    <div className="p-6 h-full overflow-auto max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">Approval Workflow</h2>
        <p className="text-sm font-light text-slate-400">
          {pending?.length ?? 0} items pending · Government Authority review
        </p>
      </div>

      {!canApprove && (
        <div className="p-4 rounded-xl mb-6 flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-400">
            <strong className="font-semibold block mb-0.5">Authorization Required</strong>
            You need the Government Authority role to approve records. Login as <code className="text-amber-300 font-mono text-xs">authority@bhumap.gov.in</code>.
          </div>
        </div>
      )}

      {/* Status workflow diagram */}
      <div className="flex flex-wrap items-center gap-2 mb-8 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-sm">
        {["DRAFT", "PROCESSING", "PROVISIONAL", "REQUIRES_REVIEW", "VERIFIED / REJECTED"].map((status, i, arr) => (
          <div key={status} className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-[var(--color-surface-2)] text-slate-400 border border-[var(--color-border-subtle)] shadow-sm">
              {status}
            </div>
            {i < arr.length - 1 && <span className="text-slate-600 px-1">&rarr;</span>}
          </div>
        ))}
      </div>

      {/* Pending items */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-32 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]" />)
        ) : pending?.length === 0 ? (
          <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl">
            <CheckCircle className="w-10 h-10 mx-auto mb-4 text-slate-600" />
            <div className="text-slate-400 text-sm font-light">No items pending approval in your queue.</div>
          </div>
        ) : pending?.map(prop => (
          <div key={prop.id} className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-sm">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs font-medium bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded tracking-wider border border-blue-500/20">{prop.spid_3d}</span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${getStatusBadgeClass(prop.approval_status)}`}>
                    {prop.approval_status?.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="text-base text-white mb-1.5 font-medium truncate">
                  {(prop.buildings as { name?: string })?.name} · {(prop.floors as { floor_name?: string })?.floor_name} · Unit {prop.unit_number}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 font-light">
                  <span><strong className="text-slate-500 font-medium">ULPIN:</strong> {prop.parent_ulpin}</span>
                  <span><strong className="text-slate-500 font-medium">Area:</strong> {prop.area_sqm}m²</span>
                  <span><strong className="text-slate-500 font-medium">AI Conf:</strong> {prop.ai_confidence?.toFixed(1)}%</span>
                </div>

                {/* Reject reason input */}
                {canApprove && (
                  <input
                    placeholder="Enter rejection reason (required for rejection)..."
                    value={rejectReason[prop.id] || ""}
                    onChange={e => setRejectReason(prev => ({ ...prev, [prop.id]: e.target.value }))}
                    className="mt-4 w-full md:w-2/3 px-4 py-2.5 rounded-lg text-sm outline-none bg-[var(--color-background)]/50 border border-[var(--color-border-subtle)] text-white placeholder-slate-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                )}
              </div>

              {canApprove && (
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button onClick={() => handleApprove(prop.id)}
                    disabled={processing === prop.id}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 w-full md:w-auto">
                    <CheckCircle className="w-4 h-4" />
                    {processing === prop.id ? "Processing..." : "Approve"}
                  </button>
                  <button onClick={() => handleReject(prop.id)}
                    disabled={processing === prop.id || !rejectReason[prop.id]?.trim()}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 w-full md:w-auto disabled:opacity-40 disabled:cursor-not-allowed"
                    title={!rejectReason[prop.id]?.trim() ? "Enter a rejection reason first" : "Reject"}>
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
