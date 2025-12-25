import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useActivityBuilderStore } from "../stores/activity-builder.store";
import { step2_1Schema } from "../schemas/activity.schema";

type Step2_1FormData = z.infer<typeof step2_1Schema>;

export function Step2_1() {
  const { formData, updateFormData, nextStep, isDark } = useActivityBuilderStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<Step2_1FormData>({
    resolver: zodResolver(step2_1Schema),
    defaultValues: { name: formData.name },
    mode: "onChange",
  });

  const nameValue = watch("name");
  const nameLength = nameValue?.length ?? 0;

  const onSubmit = (data: Step2_1FormData) => {
    updateFormData("name", data.name);
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          Step 2-1: Activity Name
        </h1>
        <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Enter the name of your extracurricular activity
        </p>
      </div>

      <Card className={isDark ? "bg-gray-800 border-gray-700" : ""}>
        <CardHeader>
          <CardTitle className={isDark ? "text-white" : ""}>
            What is your activity called?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className={isDark ? "text-gray-200" : ""}>
                Activity Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Varsity Basketball Team Captain"
                {...register("name")}
                maxLength={50}
                aria-invalid={!!errors.name}
                aria-describedby="name-error name-counter"
                className={`${isDark ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : ""} ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              <div className="flex justify-between">
                {errors.name ? (
                  <p id="name-error" className="text-sm text-red-500" role="alert">
                    {errors.name.message}
                  </p>
                ) : (
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Choose a clear, descriptive name
                  </p>
                )}
                <p
                  id="name-counter"
                  className={`text-xs ${
                    nameLength > 45
                      ? "text-yellow-500"
                      : isDark
                        ? "text-gray-400"
                        : "text-gray-500"
                  }`}
                >
                  {nameLength}/50
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-blue-50"}`}>
              <h3 className={`font-medium mb-2 ${isDark ? "text-blue-400" : "text-blue-700"}`}>
                Tips for naming your activity:
              </h3>
              <ul className={`text-sm space-y-1 list-disc list-inside ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                <li>Include your role or position if applicable</li>
                <li>Be specific about the organization or team</li>
                <li>Keep it concise but descriptive</li>
              </ul>
            </div>

            <Button type="submit" disabled={!isValid} className="w-full">
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
