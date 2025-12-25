import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChevronRight, ChevronLeft, Trophy, Palette, GraduationCap, Heart, Users, MoreHorizontal } from "lucide-react";
import { useActivityBuilderStore } from "../stores/activity-builder.store";
import { step2_2Schema } from "../schemas/activity.schema";
import { CATEGORIES, type Category } from "../types";
import { cn } from "@/lib/utils";

type Step2_2FormData = z.infer<typeof step2_2Schema>;

const categoryIcons: Record<Category, React.ReactNode> = {
  Sports: <Trophy className="w-5 h-5" />,
  Arts: <Palette className="w-5 h-5" />,
  Academic: <GraduationCap className="w-5 h-5" />,
  "Community Service": <Heart className="w-5 h-5" />,
  Leadership: <Users className="w-5 h-5" />,
  Other: <MoreHorizontal className="w-5 h-5" />,
};

const categoryDescriptions: Record<Category, string> = {
  Sports: "Athletics, fitness, and competitive sports",
  Arts: "Visual arts, music, theater, and creative pursuits",
  Academic: "Clubs, competitions, and scholarly activities",
  "Community Service": "Volunteering and community involvement",
  Leadership: "Student government, club leadership roles",
  Other: "Activities that don't fit other categories",
};

export function Step2_2() {
  const { formData, updateFormData, nextStep, prevStep, isDark } = useActivityBuilderStore();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<Step2_2FormData>({
    resolver: zodResolver(step2_2Schema),
    defaultValues: { category: formData.category || undefined },
    mode: "onChange",
  });

  const selectedCategory = watch("category");

  const onSubmit = (data: Step2_2FormData) => {
    updateFormData("category", data.category);
    nextStep();
  };

  const handleCategoryClick = (cat: Category) => {
    setValue("category", cat, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          Step 2-2: Activity Category
        </h1>
        <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Select the category that best describes your activity
        </p>
      </div>

      <Card className={isDark ? "bg-gray-800 border-gray-700" : ""}>
        <CardHeader>
          <CardTitle className={isDark ? "text-white" : ""}>
            What type of activity is this?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label className={isDark ? "text-gray-200" : ""}>
                Category <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={cn(
                        isDark ? "bg-gray-700 border-gray-600 text-white" : "",
                        errors.category ? "border-red-500" : ""
                      )}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          <div className="flex items-center gap-2">
                            {categoryIcons[cat]}
                            <span>{cat}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-sm text-red-500" role="alert">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryClick(cat)}
                  className={cn(
                    "p-4 rounded-lg border text-left transition-all duration-200",
                    "hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500",
                    selectedCategory === cat
                      ? isDark
                        ? "bg-blue-900/50 border-blue-700"
                        : "bg-blue-50 border-blue-300"
                      : isDark
                        ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        selectedCategory === cat
                          ? "bg-blue-500 text-white"
                          : isDark
                            ? "bg-gray-600 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {categoryIcons[cat]}
                    </div>
                    <div>
                      <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                        {cat}
                      </p>
                      <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                        {categoryDescriptions[cat]}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
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
