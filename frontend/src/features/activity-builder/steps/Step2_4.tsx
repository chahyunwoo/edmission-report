import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useActivityBuilderStore } from "../stores/activity-builder.store";
import { step2_4Schema } from "../schemas/activity.schema";
import { cn } from "@/lib/utils";

type Step2_4FormData = z.infer<typeof step2_4Schema>;

export function Step2_4() {
  const { formData, updateFormData, nextStep, prevStep, isDark } = useActivityBuilderStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<Step2_4FormData>({
    resolver: zodResolver(step2_4Schema),
    defaultValues: { description: formData.description },
    mode: "onChange",
  });

  const descriptionValue = watch("description");
  const charCount = descriptionValue?.length ?? 0;
  const isNearLimit = charCount > 130;
  const isOverLimit = charCount > 150;

  const getCounterColor = () => {
    if (isOverLimit) return "text-red-500";
    if (isNearLimit) return "text-yellow-500";
    return isDark ? "text-gray-400" : "text-gray-500";
  };

  const onSubmit = (data: Step2_4FormData) => {
    updateFormData("description", data.description);
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          Step 2-4: Activity Description
        </h1>
        <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Describe your activity and highlight your achievements
        </p>
      </div>

      <Card className={isDark ? "bg-gray-800 border-gray-700" : ""}>
        <CardHeader>
          <CardTitle className={isDark ? "text-white" : ""}>
            Tell us about your involvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label className={isDark ? "text-gray-200" : ""}>
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Describe your role, responsibilities, and key achievements..."
                {...register("description")}
                aria-invalid={!!errors.description}
                className={cn(
                  "min-h-[150px]",
                  isDark ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "",
                  errors.description ? "border-red-500 focus:ring-red-500" : ""
                )}
              />
              <div className="flex justify-between items-center">
                <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                  Be specific about your contributions and impact
                </p>
                <p className={cn("text-sm font-medium", getCounterColor())}>
                  {charCount}/150
                </p>
              </div>
              {errors.description && (
                <p className="text-sm text-red-500" role="alert">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className={cn("p-4 rounded-lg", isDark ? "bg-gray-700/50" : "bg-green-50")}>
              <h3 className={cn("font-medium mb-2", isDark ? "text-green-400" : "text-green-700")}>
                Writing Tips:
              </h3>
              <ul className={cn("text-sm space-y-2 list-disc list-inside", isDark ? "text-gray-300" : "text-gray-600")}>
                <li>Focus on your specific role and responsibilities</li>
                <li>Quantify achievements when possible (e.g., "led team of 15")</li>
                <li>Highlight any awards or recognition received</li>
                <li>Mention skills developed or lessons learned</li>
              </ul>
            </div>

            <div className={cn("p-4 rounded-lg", isDark ? "bg-gray-700/50" : "bg-gray-100")}>
              <h3 className={cn("font-medium mb-2", isDark ? "text-gray-300" : "text-gray-700")}>
                Example:
              </h3>
              <p className={cn("text-sm italic", isDark ? "text-gray-400" : "text-gray-600")}>
                "Captain of varsity team for 2 years. Led practice sessions, mentored 8 new players. Won regional championship 2023."
              </p>
              <p className={cn("text-xs mt-2", isDark ? "text-gray-500" : "text-gray-500")}>
                (89 characters - leaves room for more detail)
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit" disabled={!isValid} className="flex-1">
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
