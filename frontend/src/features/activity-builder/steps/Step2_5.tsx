import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Clock, Crown, Zap, Check } from "lucide-react";
import { useActivityBuilderStore } from "../stores/activity-builder.store";
import { step2_5Schema } from "../schemas/activity.schema";
import { cn } from "@/lib/utils";

type Step2_5FormData = z.infer<typeof step2_5Schema>;

export function Step2_5() {
  const { formData, updateFormData, nextStep, prevStep, isDark } = useActivityBuilderStore();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step2_5FormData>({
    resolver: zodResolver(step2_5Schema),
    defaultValues: {
      hoursPerWeek: formData.hoursPerWeek,
      isLeadership: formData.isLeadership,
    },
    mode: "onChange",
  });

  const hoursValue = watch("hoursPerWeek");
  const leadershipValue = watch("isLeadership");
  const hoursBonus = hoursValue > 10;
  const totalBonus = (hoursBonus ? 1 : 0) + (leadershipValue ? 2 : 0);

  const onSubmit = (data: Step2_5FormData) => {
    updateFormData("hoursPerWeek", data.hoursPerWeek);
    updateFormData("isLeadership", data.isLeadership);
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          Step 2-5: Time Commitment & Leadership
        </h1>
        <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Tell us about your time investment and leadership role
        </p>
      </div>

      <Card className={isDark ? "bg-gray-800 border-gray-700" : ""}>
        <CardHeader>
          <CardTitle className={cn("flex items-center justify-between", isDark ? "text-white" : "")}>
            <span>Additional Details</span>
            {totalBonus > 0 && (
              <Badge className="bg-green-500 text-white">
                <Zap className="w-3 h-3 mr-1" />
                +{totalBonus} bonus points
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Hours per week */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className={isDark ? "w-5 h-5 text-blue-400" : "w-5 h-5 text-blue-600"} />
                <Label className={cn("text-base font-medium", isDark ? "text-gray-200" : "")}>
                  Hours per Week
                </Label>
              </div>

              <div className="space-y-2">
                <Input
                  type="number"
                  min={0}
                  max={40}
                  {...register("hoursPerWeek", { valueAsNumber: true })}
                  aria-invalid={!!errors.hoursPerWeek}
                  className={cn(
                    "w-32",
                    isDark ? "bg-gray-700 border-gray-600 text-white" : "",
                    errors.hoursPerWeek ? "border-red-500" : ""
                  )}
                />
                {errors.hoursPerWeek ? (
                  <p className="text-sm text-red-500" role="alert">
                    {errors.hoursPerWeek.message}
                  </p>
                ) : (
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                    Enter a value between 0 and 40 hours
                  </p>
                )}
              </div>

              <div
                className={cn(
                  "p-4 rounded-lg flex items-center justify-between",
                  hoursBonus
                    ? isDark
                      ? "bg-green-900/30 border border-green-800"
                      : "bg-green-50 border border-green-200"
                    : isDark
                      ? "bg-gray-700/50"
                      : "bg-gray-100"
                )}
              >
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      hoursBonus
                        ? isDark
                          ? "text-green-400"
                          : "text-green-700"
                        : isDark
                          ? "text-gray-300"
                          : "text-gray-700"
                    )}
                  >
                    {hoursBonus ? "High commitment detected!" : "Commit 10+ hours for bonus"}
                  </p>
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                    Activities with 10+ hours/week show significant dedication
                  </p>
                </div>
                {hoursBonus && <Badge className="bg-green-500 text-white">+1 point</Badge>}
              </div>
            </div>

            {/* Leadership position */}
            <div className={cn("space-y-4 pt-4 border-t", isDark ? "border-gray-700" : "border-gray-200")}>
              <div className="flex items-center gap-2">
                <Crown className={isDark ? "w-5 h-5 text-purple-400" : "w-5 h-5 text-purple-600"} />
                <span className={cn("text-base font-medium", isDark ? "text-gray-200" : "")}>
                  Leadership Role
                </span>
              </div>

              <Controller
                name="isLeadership"
                control={control}
                render={({ field }) => (
                  <div
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-all duration-200",
                      field.value
                        ? isDark
                          ? "bg-purple-900/30 border-purple-700"
                          : "bg-purple-50 border-purple-300"
                        : isDark
                          ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                    )}
                    onClick={() => field.onChange(!field.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                            field.value
                              ? "bg-purple-500 border-purple-500"
                              : isDark
                                ? "border-gray-500 bg-gray-700"
                                : "border-gray-300 bg-white"
                          )}
                        >
                          {field.value && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <Label className={cn("text-base font-medium cursor-pointer", isDark ? "text-gray-200" : "")}>
                            I hold a leadership position
                          </Label>
                          <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                            Captain, President, Founder, Editor-in-Chief, etc.
                          </p>
                        </div>
                      </div>
                      {field.value && <Badge className="bg-purple-500 text-white">+2 points</Badge>}
                    </div>
                  </div>
                )}
              />

              <div className={cn("p-4 rounded-lg", isDark ? "bg-gray-700/50" : "bg-purple-50")}>
                <h3 className={cn("font-medium mb-2", isDark ? "text-purple-400" : "text-purple-700")}>
                  Examples of Leadership Positions:
                </h3>
                <ul className={cn("text-sm space-y-1 list-disc list-inside", isDark ? "text-gray-300" : "text-gray-600")}>
                  <li>Team Captain or Co-Captain</li>
                  <li>Club President, Vice President, or Treasurer</li>
                  <li>Founder or Co-Founder of an organization</li>
                  <li>Editor-in-Chief or Section Editor</li>
                  <li>Student Government representative</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit" className="flex-1">
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
