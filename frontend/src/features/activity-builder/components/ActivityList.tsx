import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Edit2, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActivities, useDeleteActivity } from "../hooks/useActivities";
import { useActivityBuilderStore } from "../stores/activity-builder.store";
import {
  getImpactLevel,
  IMPACT_COLORS,
  CATEGORY_COLORS,
  TIER_COLORS,
  type Activity,
  type Category,
  type Tier,
} from "../types";

export function ActivityList() {
  const { data: activities = [], isLoading, isError } = useActivities();
  const deleteActivity = useDeleteActivity();
  const { startEdit, editingId, isDark } = useActivityBuilderStore();

  const handleEdit = (activity: Activity) => {
    startEdit(activity.id, {
      name: activity.name,
      category: activity.category,
      tier: activity.tier,
      description: activity.description,
      hoursPerWeek: activity.hoursPerWeek,
      isLeadership: activity.isLeadership,
    });
  };

  const handleDelete = async (id: string) => {
    await deleteActivity.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className={cn("w-8 h-8 animate-spin", isDark ? "text-gray-400" : "text-gray-500")} />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className={cn("text-center py-12", isDark ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200")}>
        <CardContent>
          <p className="text-red-500">Failed to load activities. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card className={cn("text-center py-12", isDark ? "bg-gray-800 border-gray-700" : "")}>
        <CardContent>
          <Award
            className={cn("w-12 h-12 mx-auto mb-4", isDark ? "text-gray-600" : "text-gray-400")}
            aria-hidden="true"
          />
          <p className={isDark ? "text-gray-400" : "text-gray-500"}>
            No activities added yet. Complete the steps above to add your first activity!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {activities.map((activity, index) => {
        const level = getImpactLevel(activity.impactScore);
        const isBeingEdited = editingId === activity.id;

        return (
          <Card
            key={activity.id}
            className={cn(
              "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-in",
              isDark ? "bg-gray-800 border-gray-700" : "",
              isBeingEdited ? "ring-2 ring-blue-500" : ""
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className={cn("text-lg", isDark ? "text-white" : "")}>
                    {activity.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={cn(CATEGORY_COLORS[activity.category as Category], "text-white text-xs")}>
                      {activity.category}
                    </Badge>
                    <Badge className={cn(TIER_COLORS[activity.tier as Tier], "text-white text-xs")}>
                      {activity.tier}
                    </Badge>
                    <Badge
                      className={cn(IMPACT_COLORS[level], "text-white text-xs")}
                      aria-label={`Impact: ${activity.impactScore} points, ${level} level`}
                    >
                      <Award className="w-3 h-3 mr-1" aria-hidden="true" />
                      {activity.impactScore} pts
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(activity)}
                    disabled={deleteActivity.isPending}
                    aria-label={`Edit ${activity.name}`}
                  >
                    <Edit2 className="w-4 h-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(activity.id)}
                    disabled={deleteActivity.isPending}
                    aria-label={`Delete ${activity.name}`}
                  >
                    {deleteActivity.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                {activity.description}
              </p>
              <div className={cn("mt-3 flex items-center gap-4 text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                <span>{activity.hoursPerWeek} hrs/week</span>
                {activity.isLeadership && (
                  <Badge variant="outline" className="text-xs">
                    Leadership
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
