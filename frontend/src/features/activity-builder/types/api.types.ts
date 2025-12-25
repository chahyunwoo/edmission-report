export interface ActivityApiResponse {
  id: number;
  name: string;
  category: string;
  tier: string;
  description: string;
  hours_per_week: number;
  is_leadership: boolean;
  impact_score: number;
}

export interface CreateActivityRequest {
  name: string;
  category: string;
  tier: string;
  description: string;
  hours_per_week: number;
  is_leadership: boolean;
}

export type UpdateActivityRequest = Partial<CreateActivityRequest>;
