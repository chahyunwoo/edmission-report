import { apiClient } from "@/lib/api/client";
import type {
  Activity,
  ActivityApiResponse,
  CreateActivityRequest,
  UpdateActivityRequest,
} from "../types";
import type { ActivityFormData } from "../schemas/activity.schema";

const mapResponseToActivity = (data: ActivityApiResponse): Activity => ({
  id: String(data.id),
  name: data.name,
  category: data.category as Activity["category"],
  tier: data.tier as Activity["tier"],
  description: data.description,
  hoursPerWeek: data.hours_per_week,
  isLeadership: data.is_leadership,
  impactScore: data.impact_score,
});

const mapFormToRequest = (data: ActivityFormData): CreateActivityRequest => ({
  name: data.name,
  category: data.category,
  tier: data.tier,
  description: data.description,
  hours_per_week: data.hoursPerWeek,
  is_leadership: data.isLeadership,
});

export const activityApi = {
  getAll: async (): Promise<Activity[]> => {
    const data = await apiClient.get("activities").json<ActivityApiResponse[]>();
    return data.map(mapResponseToActivity);
  },

  getById: async (id: string): Promise<Activity> => {
    const data = await apiClient.get(`activities/${id}`).json<ActivityApiResponse>();
    return mapResponseToActivity(data);
  },

  create: async (formData: ActivityFormData): Promise<Activity> => {
    const data = await apiClient
      .post("activities", { json: mapFormToRequest(formData) })
      .json<ActivityApiResponse>();
    return mapResponseToActivity(data);
  },

  update: async (id: string, formData: Partial<ActivityFormData>): Promise<Activity> => {
    const request: UpdateActivityRequest = {};
    if (formData.name !== undefined) request.name = formData.name;
    if (formData.category !== undefined) request.category = formData.category;
    if (formData.tier !== undefined) request.tier = formData.tier;
    if (formData.description !== undefined) request.description = formData.description;
    if (formData.hoursPerWeek !== undefined) request.hours_per_week = formData.hoursPerWeek;
    if (formData.isLeadership !== undefined) request.is_leadership = formData.isLeadership;

    const data = await apiClient
      .put(`activities/${id}`, { json: request })
      .json<ActivityApiResponse>();
    return mapResponseToActivity(data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`activities/${id}`);
  },
};
