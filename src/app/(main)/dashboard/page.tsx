"use client";

import { useAuthStore } from "@/store/authStore";
import { GovernmentDashboard } from "@/components/dashboard/GovernmentDashboard";
import { SurveyorDashboard } from "@/components/dashboard/SurveyorDashboard";
import { AnalystDashboard } from "@/components/dashboard/AnalystDashboard";
import { PublicDashboard } from "@/components/dashboard/PublicDashboard";

export default function DashboardPage() {
  const { user } = useAuthStore();

  if (!user) return null;

  switch (user.role) {
    case "super_admin":
    case "government_authority":
      return <GovernmentDashboard />;
    
    case "surveyor":
      return <SurveyorDashboard />;
    
    case "gis_analyst":
    case "utility_department":
      return <AnalystDashboard />;
    
    case "property_owner":
    case "public_viewer":
    default:
      return <PublicDashboard />;
  }
}
