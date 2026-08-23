"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { MapPin, Shield, Eye, EyeOff, Loader2 } from "lucide-react";

const DEMO_USERS = [
  { email: "admin@bhumap.gov.in", password: "Admin@123", role: "Super Admin" },
  { email: "authority@bhumap.gov.in", password: "Auth@123", role: "Govt. Authority" },
  { email: "surveyor@bhumap.gov.in", password: "Survey@123", role: "Surveyor" },
  { email: "analyst@bhumap.gov.in", password: "Analyst@123", role: "GIS Analyst" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("authority@bhumap.gov.in");
  const [password, setPassword] = useState("Auth@123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuthStore();
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Demo mode: simulate auth without actual Supabase users
    const demoUser = DEMO_USERS.find(u => u.email === email);
    if (demoUser && password === demoUser.password) {
      const roleMap: Record<string, string> = {
        "Super Admin": "super_admin",
        "Govt. Authority": "government_authority",
        "Surveyor": "surveyor",
        "GIS Analyst": "gis_analyst",
      };
      setUser({
        id: `demo-${Date.now()}`,
        email,
        full_name: demoUser.role + " User",
        role: roleMap[demoUser.role] as never,
        department: "Demo Department",
      });
      router.push("/dashboard");
      return;
    }

    // Try real Supabase auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("Invalid credentials. Use demo credentials below.");
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      setUser({
        id: data.user.id,
        email: data.user.email!,
        full_name: profile?.full_name ?? "User",
        role: profile?.role ?? "public_viewer",
        department: profile?.department ?? undefined,
      });
      router.push("/dashboard");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-background)]">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-[var(--color-surface)]">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
          
        {/* Glow effect */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20 shadow-sm">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-white font-bold text-xl tracking-tight">3D-BhuMap</div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Government of India</div>
            </div>
          </div>

          <h1 className="text-5xl font-light text-[var(--color-text-primary)] mb-6 leading-[1.1] tracking-tight">
            3D ULPIN Generation &amp;<br />
            <span className="font-semibold text-[var(--color-primary)]">Vertical Property</span><br />
            Mapping System
          </h1>
          <p className="text-lg mb-10 text-slate-400 font-light max-w-lg">
            Extending 2D cadastral records into a comprehensive 3D volumetric cadastral framework for modern land governance.
          </p>

          <div className="space-y-5">
            {[
              "3D Spatial Property ID (3DSPID)",
              "AI-Assisted Building Extraction",
              "Underground Infrastructure Mapping",
              "Topology Validation Engine",
              "Government Approval Workflow",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-subtle)] flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </div>
                <span className="text-slate-300 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[11px] font-medium text-slate-400 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Smart India Hackathon 2026 · SIH-2026-GIS-042</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 relative">
        <div className="w-full max-w-[400px]">
          {/* Mobile branding */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-white font-bold text-xl tracking-tight">3D-BhuMap</div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">Welcome back</h2>
            <p className="text-sm font-light text-slate-400">
              Access the 3D cadastral management platform
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl text-sm font-medium text-white placeholder-slate-600 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                placeholder="user@bhumap.gov.in"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl text-sm font-medium text-white placeholder-slate-600 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none pr-12 transition-all shadow-sm"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg text-[13px] font-medium bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-2 shadow-sm">
                <Shield className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
              style={{ background: loading ? "var(--color-surface-3)" : "linear-gradient(135deg, var(--color-primary-light), var(--color-primary))" }}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1 bg-[var(--color-border-subtle)]" />
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Demo Credentials
              </div>
              <div className="h-px flex-1 bg-[var(--color-border-subtle)]" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {DEMO_USERS.map((u) => (
                <button key={u.email} onClick={() => { setEmail(u.email); setPassword(u.password); }}
                  className="p-3 rounded-xl text-left transition-all bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-2)] hover:border-slate-600 shadow-sm group">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-white mb-1 group-hover:text-blue-400 transition-colors">{u.role}</div>
                  <div className="text-[10px] font-mono text-slate-500 truncate">{u.email}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 text-[11px] font-medium tracking-wide text-center text-slate-500 bg-[var(--color-surface)] py-2 rounded-lg border border-[var(--color-border-subtle)]">
            <span className="text-amber-500 mr-1">⚠</span> DEMO MODE — This is a prototype for SIH 2026
          </div>
        </div>
      </div>
    </div>
  );
}
