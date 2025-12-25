import type { Tier, ImpactLevel } from "../types/activity.types";
import { TIER_SCORES } from "../constants";

export const getImpactLevel = (score: number): ImpactLevel => {
  if (score <= 2) return "Low";
  if (score <= 4) return "Medium";
  if (score <= 6) return "High";
  return "Exceptional";
};

export const calculateImpactScore = (
  tier: Tier,
  isLeadership: boolean,
  hoursPerWeek: number
): number => {
  let score = TIER_SCORES[tier] ?? 0;
  if (isLeadership) score += 2;
  if (hoursPerWeek > 10) score += 1;
  return score;
};
