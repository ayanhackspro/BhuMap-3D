"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { 
  Map, Layers, ShieldCheck, Database, 
  ArrowRight, Box, Cpu, AlertTriangle, Building2
} from "lucide-react";

export default function RootPage() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-[var(--color-background)] selection:bg-[var(--color-primary)] selection:text-white relative">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-info)]/5 blur-[120px] pointer-events-none" />

      {/* Navbar (Glassmorphism) */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[var(--color-surface)]/70 border-b border-[var(--color-border-subtle)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white font-bold shadow-lg shadow-[var(--color-primary)]/20">
              <Box className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              3D-BhuMap
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[var(--color-primary)]/30 hover:-translate-y-0.5 transition-all">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                  Log in
                </Link>
                <Link href="/login" className="px-5 py-2.5 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[var(--color-primary)]/30 hover:-translate-y-0.5 transition-all">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-info)]/10 text-[var(--color-info)] border border-[var(--color-info)]/20 text-sm font-medium mb-4 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-info)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-info)]"></span>
            </span>
            Next-Generation Cadastral Mapping System
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[var(--color-text-primary)] leading-[1.1]">
            The Future of Urban <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-info)]">
              Spatial Management
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed max-w-2xl mx-auto">
            A unified platform integrating surface parcels, volumetric property units, and underground utility networks into a single, high-fidelity spatial digital twin.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href={user ? "/dashboard" : "/login"} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[var(--color-primary)] text-white text-md font-semibold hover:shadow-xl hover:shadow-[var(--color-primary)]/30 hover:-translate-y-1 transition-all">
              Explore the Platform
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)] text-md font-medium hover:bg-[var(--color-surface)] hover:border-[var(--color-border-subtle)] transition-all">
              View Capabilities
            </a>
          </div>
        </div>

        {/* Bento Grid Features */}
        <div id="features" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]">Platform Capabilities</h2>
            <p className="text-[var(--color-text-secondary)] mt-4">Enterprise-grade tools for holistic urban planning.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            
            {/* 3DSPID Card (Large) */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--color-primary)]/5">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-8 md:p-10 h-full flex flex-col justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-6">
                  <Database className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">3DSPID Framework</h3>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed max-w-md">
                    Implement true volumetric property identification. 3DSPID establishes a unique 27-digit spatial identifier for individual apartments, floors, and commercial units within multi-story structures.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Extrusion Card */}
            <div className="group relative overflow-hidden rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-info)]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--color-info)]/5">
              <div className="absolute inset-0 bg-gradient-to-bl from-[var(--color-info)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-8 h-full flex flex-col justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-info)]/10 flex items-center justify-center text-[var(--color-info)] mb-6">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">AI-Powered Extrusion</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Automatically generate Level of Detail (LoD) 1 and 2 city models from 2D building footprints using deep learning and elevation data.
                  </p>
                </div>
              </div>
            </div>

            {/* Underground Tracking Card */}
            <div className="group relative overflow-hidden rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-warning)]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--color-warning)]/5">
               <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-warning)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="relative p-8 h-full flex flex-col justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-warning)]/10 flex items-center justify-center text-[var(--color-warning)] mb-6">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Underground Assets</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Map sub-surface infrastructure including metro corridors, sewer lines, and telecommunications natively in 3D space.
                  </p>
                </div>
              </div>
            </div>

            {/* Conflict Detection Card (Large) */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-danger)]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--color-danger)]/5">
              <div className="absolute inset-0 bg-gradient-to-tl from-[var(--color-danger)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-8 md:p-10 h-full flex flex-col justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-danger)]/10 flex items-center justify-center text-[var(--color-danger)] mb-6">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">Spatial Conflict Engine</h3>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed max-w-md">
                    Automatically detect topological violations, volumetric overlaps, and encroaching structures before they become real-world legal disputes using PostGIS 3D spatial analytics.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-12 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="font-bold text-[var(--color-text-primary)]">3D-BhuMap</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[var(--color-text-secondary)]">
            <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Documentation</a>
            <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Terms of Service</a>
          </div>
          <div className="text-sm text-[var(--color-text-muted)]">
            &copy; {new Date().getFullYear()} 3D-BhuMap System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
