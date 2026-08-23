import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole =
  | "super_admin"
  | "government_authority"
  | "surveyor"
  | "gis_analyst"
  | "utility_department"
  | "property_owner"
  | "public_viewer";

interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department?: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null }),
    }),
    { name: "bhumap-auth" }
  )
);

// Role permission helpers
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ["*"],
  government_authority: ["approve", "reject", "view_all", "generate_report"],
  surveyor: ["edit_geometry", "verify", "survey", "view_all"],
  gis_analyst: ["analyze", "import", "view_all", "run_conflict"],
  utility_department: ["view_underground", "edit_underground", "view_all"],
  property_owner: ["view_own", "submit_correction"],
  public_viewer: ["view_verified"],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  return perms.includes("*") || perms.includes(permission);
}
