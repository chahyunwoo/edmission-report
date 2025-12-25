import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useActivityBuilderStore,
  STEPS,
  STEP_ORDER,
  type StepId,
} from "../stores/activity-builder.store";
import { activitySchema } from "../schemas/activity.schema";

export function Sidebar() {
  const { currentStep, setStep, setSidebarOpen, formData, isDark } = useActivityBuilderStore();

  const getStepCompletion = (stepId: StepId): boolean => {
    switch (stepId) {
      case "2-1":
        return activitySchema.shape.name.safeParse(formData.name).success;
      case "2-2":
        return !!formData.category;
      case "2-3":
        return !!formData.tier;
      case "2-4":
        return activitySchema.shape.description.safeParse(formData.description).success;
      case "2-5":
        return formData.hoursPerWeek > 0;
      case "3-1":
        return false;
      default:
        return false;
    }
  };

  const canAccessStep = (stepId: StepId): boolean => {
    const targetIndex = STEP_ORDER.indexOf(stepId);
    if (targetIndex === 0) return true;

    for (let i = 0; i < targetIndex; i++) {
      if (!getStepCompletion(STEP_ORDER[i])) {
        return false;
      }
    }
    return true;
  };

  const handleStepClick = (stepId: StepId) => {
    if (!canAccessStep(stepId)) return;
    setStep(stepId);
    setSidebarOpen(false);
  };

  return (
    <aside
      className={cn(
        "w-64 min-h-screen border-r p-4 transition-colors duration-300",
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}
      role="navigation"
      aria-label="Activity Builder Steps"
    >
      <div className="mb-6">
        <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>
          Activity Builder
        </h2>
        <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
          Complete each step to add your activities
        </p>
      </div>

      <nav>
        <ul className="space-y-2">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = getStepCompletion(step.id);
            const isAccessible = canAccessStep(step.id);

            return (
              <li key={step.id}>
                <button
                  onClick={() => handleStepClick(step.id)}
                  disabled={!isAccessible}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500",
                    !isAccessible && "opacity-50 cursor-not-allowed",
                    isAccessible && "hover:scale-[1.02]",
                    isActive
                      ? isDark
                        ? "bg-blue-900/50 border border-blue-700"
                        : "bg-blue-50 border border-blue-200"
                      : isAccessible
                        ? isDark
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-50"
                        : ""
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" aria-hidden="true" />
                    ) : (
                      <Circle
                        className={cn(
                          "w-5 h-5",
                          isActive
                            ? "text-blue-500"
                            : isDark
                              ? "text-gray-600"
                              : "text-gray-400"
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded",
                          isActive
                            ? "bg-blue-500 text-white"
                            : isDark
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-200 text-gray-600"
                        )}
                      >
                        {step.id}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "mt-1 text-sm font-medium truncate",
                        isActive
                          ? isDark
                            ? "text-white"
                            : "text-blue-900"
                          : isDark
                            ? "text-gray-300"
                            : "text-gray-700"
                      )}
                    >
                      {step.label}
                    </p>
                    <p className={cn("text-xs truncate", isDark ? "text-gray-500" : "text-gray-500")}>
                      {step.description}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
