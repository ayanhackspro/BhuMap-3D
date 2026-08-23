"use client";

import Link from "next/link";
import { Home, Map, FileText, Search, CreditCard } from "lucide-react";

export function PublicDashboard() {
  const property = {
    address: "Apt 402, Urban Tower A, Sector 4, Patna",
    spid: "3DSPID-PTN-402",
    area: "124 sqm",
    status: "Verified",
    lastTaxPaid: "2024-03-15",
  };

  return (
    <div className="p-6 space-y-6 overflow-auto h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">My Property Dashboard</h2>
        <p className="text-sm mt-2 text-[var(--color-text-secondary)]">
          View and manage your 3D spatial property records securely.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Property Card */}
        <div className="md:col-span-2 p-6 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-primary)]/10 to-transparent rounded-bl-full -mr-8 -mt-8" />
          
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Primary Residence</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{property.address}</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-full text-xs font-medium">
              {property.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-[var(--color-surface-2)] rounded-lg">
              <div className="text-xs text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">3D Property ID</div>
              <div className="font-mono font-medium text-[var(--color-text-primary)]">{property.spid}</div>
            </div>
            <div className="p-4 bg-[var(--color-surface-2)] rounded-lg">
              <div className="text-xs text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">Carpet Area</div>
              <div className="font-medium text-[var(--color-text-primary)]">{property.area}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/map" className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium transition-opacity hover:opacity-90">
              <Map className="w-4 h-4" />
              View in 3D Map
            </Link>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg font-medium hover:bg-[var(--color-surface)] transition-colors">
              <FileText className="w-4 h-4" />
              Download Title Deed
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl">
            <h3 className="text-md font-semibold text-[var(--color-text-primary)] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors border border-[var(--color-border-subtle)] group">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-[var(--color-info)]" />
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">Pay Property Tax</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors border border-[var(--color-border-subtle)] group">
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-[var(--color-info)]" />
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">Search Other Properties</span>
                </div>
              </button>
            </div>
          </div>

          <div className="p-6 bg-[var(--color-info)]/5 border border-[var(--color-info)]/20 rounded-xl">
            <h4 className="text-sm font-semibold text-[var(--color-info)] mb-2">Did you know?</h4>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Your 3DSPID acts as a single source of truth for your property, incorporating the exact vertical volume you own. This reduces property disputes by 90%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
