import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, CheckCircle2, AlertCircle, Edit2, ArrowLeft, Save, Loader2 } from "lucide-react";
import { useActivityBuilderStore, type StepId } from "../stores/activity-builder.store";
import { useCreateActivity, useUpdateActivity } from "../hooks/useActivities";
import { activitySchema } from "../schemas/activity.schema";
import {
  calculateImpactScore,
  getImpactLevel,
  IMPACT_COLORS,
  type Tier,
} from "../types";
import { cn } from "@/lib/utils";

export function Step3_1() {
  const { formData, editingId, prevStep, setStep, resetForm, isDark } = useActivityBuilderStore();
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();

  const impactScore = useMemo(() => {
    if (!formData.tier) return 0;
    return calculateImpactScore(
      formData.tier as Tier,
      formData.isLeadership,
      formData.hoursPerWeek
    );
  }, [formData.tier, formData.isLeadership, formData.hoursPerWeek]);

  const impactLevel = getImpactLevel(impactScore);

  const validationResult = activitySchema.safeParse(formData);
  const isValid = validationResult.success;
  const validationErrors = !validationResult.success
    ? validationResult.error.issues.map((e) => e.message)
    : [];

  const isLoading = createActivity.isPending || updateActivity.isPending;

  const summaryItems: { label: string; value: string; step: StepId }[] = [
    { label: "Activity Name", value: formData.name, step: "2-1" },
    { label: "Category", value: formData.category, step: "2-2" },
    { label: "Tier", value: formData.tier, step: "2-3" },
    { label: "Description", value: formData.description, step: "2-4" },
    { label: "Hours/Week", value: `${formData.hoursPerWeek} hours`, step: "2-5" },
    { label: "Leadership", value: formData.isLeadership ? "Yes" : "No", step: "2-5" },
  ];

  const handleSubmit = async () => {
    if (!isValid) return;

    try {
      if (editingId) {
        await updateActivity.mutateAsync({ id: editingId, data: formData });
      } else {
        await createActivity.mutateAsync(formData);
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save activity:", error);
    }
  };

  const handleGoBack = (stepId: StepId) => {
    setStep(stepId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          Step 3-1: Review & Submit
        </h1>
        <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Review your activity details before submitting
        </p>
      </div>

      {/* Impact Score Summary */}
      <Card
        className={cn(
          "border-2",
          isDark ? "bg-gray-800 border-gray-700" : "",
          IMPACT_COLORS[impactLevel].replace("bg-", "border-")
        )}
      >
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn("p-4 rounded-full", IMPACT_COLORS[impactLevel])}>
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                  Total Impact Score
                </p>
                <p className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                  {impactScore} points
                </p>
              </div>
            </div>
            <Badge className={cn(IMPACT_COLORS[impactLevel], "text-white text-lg px-4 py-2")}>
              {impactLevel}
            </Badge>
          </div>

          <div className={cn("mt-4 p-3 rounded-lg", isDark ? "bg-gray-700/50" : "bg-gray-100")}>
            <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
              <span className="font-medium">Score breakdown:</span> Tier (
              {formData.tier
                ? `+${impactScore - (formData.isLeadership ? 2 : 0) - (formData.hoursPerWeek > 10 ? 1 : 0)}`
                : "0"}
              )
              {formData.isLeadership && " + Leadership (+2)"}
              {formData.hoursPerWeek > 10 && " + High commitment (+1)"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Validation Status */}
      {!isValid && (
        <Card className={cn("border-red-500", isDark ? "bg-red-900/20" : "bg-red-50")}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-500">Please fix the following issues:</p>
                <ul className="mt-2 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li
                      key={index}
                      className={cn("text-sm", isDark ? "text-red-300" : "text-red-600")}
                    >
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Card */}
      <Card className={isDark ? "bg-gray-800 border-gray-700" : ""}>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", isDark ? "text-white" : "")}>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Activity Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-start justify-between p-3 rounded-lg",
                  isDark ? "bg-gray-700/50" : "bg-gray-50"
                )}
              >
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", isDark ? "text-gray-400" : "text-gray-500")}>
                    {item.label}
                  </p>
                  <p
                    className={cn(
                      "mt-1",
                      isDark ? "text-white" : "text-gray-900",
                      item.label === "Description" ? "text-sm" : ""
                    )}
                  >
                    {item.value || (
                      <span className="text-red-500 italic">Not provided</span>
                    )}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleGoBack(item.step)}
                  aria-label={`Edit ${item.label}`}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={!isValid || isLoading} className="flex-1">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {editingId ? "Update Activity" : "Save Activity"}
            </>
          )}
        </Button>
      </div>

      {isValid && (
        <div className={cn("p-4 rounded-lg text-center", isDark ? "bg-green-900/20" : "bg-green-50")}>
          <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className={cn("text-sm", isDark ? "text-green-400" : "text-green-700")}>
            All fields are valid. You're ready to save this activity!
          </p>
        </div>
      )}
    </div>
  );
}
