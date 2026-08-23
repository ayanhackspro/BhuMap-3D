import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatArea(sqm: number): string {
  if (sqm >= 10000) return `${(sqm / 10000).toFixed(2)} ha`;
  return `${sqm.toFixed(2)} m²`;
}

export function formatVolume(cbm: number): string {
  return `${cbm.toFixed(2)} m³`;
}

export function formatCoordinate(val: number, decimals = 6): string {
  return val.toFixed(decimals);
}

export function getConfidenceClass(confidence: number): string {
  if (confidence >= 90) return "confidence-very-high";
  if (confidence >= 80) return "confidence-high";
  if (confidence >= 60) return "confidence-moderate";
  return "confidence-low";
}

export function getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    verified: "badge-verified",
    provisional: "badge-provisional",
    draft: "badge-draft",
    rejected: "badge-rejected",
    requires_review: "badge-requires-review",
    processing: "badge-processing",
    archived: "badge-draft",
  };
  return map[status] ?? "badge-draft";
}

export function getSeverityClass(severity: string): string {
  const map: Record<string, string> = {
    critical: "severity-critical",
    high: "severity-high",
    medium: "severity-medium",
    low: "severity-low",
  };
  return map[severity] ?? "severity-low";
}

export function calculateQualityScore(params: {
  geometryQuality: number;
  surveyAccuracy: number;
  aiConfidence: number;
  topologyValid: boolean;
  sourceCompleteness: number;
}): number {
  const { geometryQuality, surveyAccuracy, aiConfidence, topologyValid, sourceCompleteness } = params;
  return (
    geometryQuality * 0.25 +
    surveyAccuracy * 0.25 +
    aiConfidence * 0.2 +
    (topologyValid ? 100 : 0) * 0.2 +
    sourceCompleteness * 0.1
  );
}

export function generate3DSPID(params: {
  stateCode: string;
  districtCode: string;
  ulpinShort: string;
  floorNumber: number;
  unitNumber: number;
}): string {
  const { stateCode, districtCode, ulpinShort, floorNumber, unitNumber } = params;
  const floorStr = floorNumber < 0
    ? `B${Math.abs(floorNumber)}`
    : `F${String(Math.abs(floorNumber)).padStart(2, "0")}`;
  const unitStr = `U${String(unitNumber).padStart(3, "0")}`;
  return `3DSPID-IN-${stateCode}-${districtCode}-${ulpinShort}-${floorStr}-${unitStr}`;
}

export function formatTimestamp(ts: string): string {
  return new Date(ts).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}
