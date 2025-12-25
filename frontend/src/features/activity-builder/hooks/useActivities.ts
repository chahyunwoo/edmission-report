import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { activityApi } from "../api/activity.api";
import type { Activity, Tier, Category } from "../types";
import type { ActivityFormData } from "../schemas/activity.schema";
import { calculateImpactScore } from "../utils";

export const activityKeys = {
  all: ["activities"] as const,
  detail: (id: string) => ["activities", id] as const,
};

export const useActivities = () => {
  return useQuery({
    queryKey: activityKeys.all,
    queryFn: activityApi.getAll,
  });
};

export const useActivity = (id: string) => {
  return useQuery({
    queryKey: activityKeys.detail(id),
    queryFn: () => activityApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activityApi.create,
    onMutate: async (newActivity) => {
      await queryClient.cancelQueries({ queryKey: activityKeys.all });

      const previousActivities = queryClient.getQueryData<Activity[]>(activityKeys.all);

      const optimisticActivity: Activity = {
        id: `temp-${Date.now()}`,
        name: newActivity.name,
        category: newActivity.category as Category,
        tier: newActivity.tier as Tier,
        description: newActivity.description,
        hoursPerWeek: newActivity.hoursPerWeek,
        isLeadership: newActivity.isLeadership,
        impactScore: calculateImpactScore(
          newActivity.tier as Tier,
          newActivity.isLeadership,
          newActivity.hoursPerWeek
        ),
      };

      queryClient.setQueryData<Activity[]>(activityKeys.all, (old) => [
        ...(old ?? []),
        optimisticActivity,
      ]);

      return { previousActivities };
    },
    onError: (_err, _newActivity, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData(activityKeys.all, context.previousActivities);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ActivityFormData> }) =>
      activityApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: activityKeys.all });

      const previousActivities = queryClient.getQueryData<Activity[]>(activityKeys.all);

      queryClient.setQueryData<Activity[]>(activityKeys.all, (old) =>
        old?.map((activity): Activity => {
          if (activity.id === id) {
            return {
              id: activity.id,
              name: data.name ?? activity.name,
              category: (data.category ?? activity.category) as Category,
              tier: (data.tier ?? activity.tier) as Tier,
              description: data.description ?? activity.description,
              hoursPerWeek: data.hoursPerWeek ?? activity.hoursPerWeek,
              isLeadership: data.isLeadership ?? activity.isLeadership,
              impactScore: calculateImpactScore(
                (data.tier ?? activity.tier) as Tier,
                data.isLeadership ?? activity.isLeadership,
                data.hoursPerWeek ?? activity.hoursPerWeek
              ),
            };
          }
          return activity;
        })
      );

      return { previousActivities };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData(activityKeys.all, context.previousActivities);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activityApi.delete,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: activityKeys.all });

      const previousActivities = queryClient.getQueryData<Activity[]>(activityKeys.all);

      queryClient.setQueryData<Activity[]>(activityKeys.all, (old) =>
        old?.filter((activity) => activity.id !== id)
      );

      return { previousActivities };
    },
    onError: (_err, _id, context) => {
      if (context?.previousActivities) {
        queryClient.setQueryData(activityKeys.all, context.previousActivities);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
};
