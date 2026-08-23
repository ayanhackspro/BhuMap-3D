"use client";

import Link from "next/link";
import {
  Map, Compass, Plus, MapPin, Navigation, Clock, CheckCircle2, CheckSquare
} from "lucide-react";

export function SurveyorDashboard() {
  const assignedSurveys = [
    { id: "SUR-2024-041", location: "Sector 4, Urban Tower A", type: "GNSS Boundary Survey", dueDate: "Today", status: "in-progress" },
    { id: "SUR-2024-042", location: "Commercial Plaza C", type: "3D Facade Scanning", dueDate: "Tomorrow", status: "pending" },
    { id: "SUR-2024-045", location: "Residential Block B", type: "Underground Utility Tracing", dueDate: "In 3 Days", status: "pending" },
  ];

  return (
    <div className="p-6 space-y-6 overflow-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Surveyor Field Dashboard</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
            Welcome back. You have 3 active assignments in Patna, Bihar.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-[var(--color-border-subtle)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] transition-all text-[var(--color-text-primary)]">
            <Plus className="w-4 h-4" />
            Upload Field Data
          </button>
          <Link href="/map"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: "var(--color-primary)" }}>
            <Map className="w-4 h-4" />
            Open 3D Map
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Left Column: Assigned Surveys */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">My Assigned Surveys</h3>
            <div className="space-y-3">
              {assignedSurveys.map(survey => (
                <div key={survey.id} className="flex items-center justify-between p-4 bg-[var(--color-surface-2)] rounded-lg border border-[var(--color-border-subtle)]">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-info)]/10 flex items-center justify-center text-[var(--color-info)]">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--color-text-primary)]">{survey.id} - {survey.type}</div>
                      <div className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {survey.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-[var(--color-text-primary)] flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3 text-[var(--color-warning)]" />
                      {survey.dueDate}
                    </div>
                    <button className="text-xs font-semibold text-[var(--color-info)] mt-2 hover:underline">
                      {survey.status === 'in-progress' ? 'Resume Survey →' : 'Start Survey →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl">
               <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-1">GNSS Points Collected</h4>
               <div className="text-3xl font-light text-[var(--color-text-primary)]">124</div>
            </div>
            <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl">
               <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-1">Pending Syncs</h4>
               <div className="text-3xl font-light text-[var(--color-text-primary)]">2</div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Tools */}
        <div className="space-y-6">
          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl">
            <h3 className="text-md font-semibold text-[var(--color-text-primary)] mb-4">Field Tools</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-[var(--color-surface-2)] transition-colors border border-transparent hover:border-[var(--color-border-subtle)] group">
                <div className="p-2 rounded bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--color-text-primary)]">Connect RTK Rover</div>
                  <div className="text-xs text-[var(--color-text-muted)]">Pair via Bluetooth</div>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-[var(--color-surface-2)] transition-colors border border-transparent hover:border-[var(--color-border-subtle)] group">
                <div className="p-2 rounded bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--color-text-primary)]">Validation Checklist</div>
                  <div className="text-xs text-[var(--color-text-muted)]">Pre-survey requirements</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
