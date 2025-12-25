import type { Category, Tier, ImpactLevel } from "../types/activity.types";

export const CATEGORIES: Category[] = [
  "Sports",
  "Arts",
  "Academic",
  "Community Service",
  "Leadership",
  "Other",
];

export const TIERS: Tier[] = [
  "School",
  "Regional",
  "State",
  "National",
  "International",
];

export const TIER_SCORES: Record<Tier, number> = {
  School: 1,
  Regional: 2,
  State: 3,
  National: 4,
  International: 5,
};

export const CATEGORY_COLORS: Record<Category, string> = {
  Sports: "bg-blue-500",
  Arts: "bg-pink-500",
  Academic: "bg-green-500",
  "Community Service": "bg-orange-500",
  Leadership: "bg-purple-500",
  Other: "bg-gray-500",
};

export const TIER_COLORS: Record<Tier, string> = {
  School: "bg-slate-500",
  Regional: "bg-blue-500",
  State: "bg-cyan-500",
  National: "bg-emerald-500",
  International: "bg-violet-500",
};

export const IMPACT_COLORS: Record<ImpactLevel, string> = {
  Low: "bg-gray-500",
  Medium: "bg-yellow-500",
  High: "bg-green-500",
  Exceptional: "bg-purple-500",
};
