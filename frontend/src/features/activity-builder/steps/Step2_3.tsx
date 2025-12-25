import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChevronRight, ChevronLeft, Building2, MapPin, Flag, Globe2, Award } from "lucide-react";
import { useActivityBuilderStore } from "../stores/activity-builder.store";
import { step2_3Schema } from "../schemas/activity.schema";
import { TIERS, TIER_SCORES, TIER_COLORS, type Tier } from "../types";
import { cn } from "@/lib/utils";

type Step2_3FormData = z.infer<typeof step2_3Schema>;

const tierIcons: Record<Tier, React.ReactNode> = {
  School: <Building2 className="w-5 h-5" />,
  Regional: <MapPin className="w-5 h-5" />,
  State: <Flag className="w-5 h-5" />,
  National: <Award className="w-5 h-5" />,
  International: <Globe2 className="w-5 h-5" />,
};

const tierDescriptions: Record<Tier, string> = {
  School: "Within your school only",
  Regional: "Multiple schools in your region/district",
  State: "State-level recognition or competition",
  National: "National level recognition",
  International: "International scope or recognition",
};

export function Step2_3() {
  const { formData, updateFormData, nextStep, prevStep, isDark } = useActivityBuilderStore();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<Step2_3FormData>({
    resolver: zodResolver(step2_3Schema),
    defaultValues: { tier: formData.tier || undefined },
    mode: "onChange",
  });

  const selectedTier = watch("tier");

  const onSubmit = (data: Step2_3FormData) => {
    updateFormData("tier", data.tier);
    nextStep();
  };

  const handleTierClick = (tier: Tier) => {
    setValue("tier", tier, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          Step 2-3: Activity Tier
        </h1>
        <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Select the level or scope of your activity
        </p>
      </div>

      <Card className={isDark ? "bg-gray-800 border-gray-700" : ""}>
        <CardHeader>
          <CardTitle className={isDark ? "text-white" : ""}>
            What is the scope of this activity?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label className={isDark ? "text-gray-200" : ""}>
                Tier Level <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="tier"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={cn(
                        isDark ? "bg-gray-700 border-gray-600 text-white" : "",
                        errors.tier ? "border-red-500" : ""
                      )}
                    >
                      <SelectValue placeholder="Select a tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIERS.map((tier) => (
                        <SelectItem key={tier} value={tier}>
                          <div className="flex items-center gap-2">
                            {tierIcons[tier]}
                            <span>{tier}</span>
                            <Badge className={`${TIER_COLORS[tier]} text-white ml-2`}>
                              +{TIER_SCORES[tier]} pts
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tier && (
                <p className="text-sm text-red-500" role="alert">
                  {errors.tier.message}
                </p>
              )}
            </div>

            <div className="space-y-3 mt-6">
              {TIERS.map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => handleTierClick(tier)}
                  className={cn(
                    "w-full p-4 rounded-lg border text-left transition-all duration-200",
                    "hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500",
                    selectedTier === tier
                      ? isDark
                        ? "bg-blue-900/50 border-blue-700"
                        : "bg-blue-50 border-blue-300"
                      : isDark
                        ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          selectedTier === tier
                            ? `${TIER_COLORS[tier]} text-white`
                            : isDark
                              ? "bg-gray-600 text-gray-300"
                              : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {tierIcons[tier]}
                      </div>
                      <div>
                        <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                          {tier}
                        </p>
                        <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                          {tierDescriptions[tier]}
                        </p>
                      </div>
                    </div>
                    <Badge className={cn(TIER_COLORS[tier], "text-white")}>
                      +{TIER_SCORES[tier]} impact
                    </Badge>
                  </div>
                </button>
              ))}
            </div>

            <div className={cn("p-4 rounded-lg mt-4", isDark ? "bg-gray-700/50" : "bg-amber-50")}>
              <h3 className={cn("font-medium mb-2", isDark ? "text-amber-400" : "text-amber-700")}>
                Impact on Admission Chances
              </h3>
              <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                Higher tier activities show broader impact and are valued more by admissions officers.
                However, depth of involvement at any tier matters more than breadth.
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
