export interface Activity {
  id: string;
  name: string;
  category: Category;
  tier: Tier;
  description: string;
  hoursPerWeek: number;
  isLeadership: boolean;
  impactScore: number;
}

export type Category =
  | "Sports"
  | "Arts"
  | "Academic"
  | "Community Service"
  | "Leadership"
  | "Other";

export type Tier =
  | "School"
  | "Regional"
  | "State"
  | "National"
  | "International";

export type ImpactLevel = "Low" | "Medium" | "High" | "Exceptional";
