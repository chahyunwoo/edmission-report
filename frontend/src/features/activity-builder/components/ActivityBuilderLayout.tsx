import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActivityBuilderStore } from "../stores/activity-builder.store";
import { useActivities } from "../hooks/useActivities";
import { Sidebar } from "./Sidebar";
import { ActivityList } from "./ActivityList";
import { Step2_1, Step2_2, Step2_3, Step2_4, Step2_5, Step3_1 } from "../steps";

export function ActivityBuilderLayout() {
  const {
    currentStep,
    editingId,
    cancelEdit,
    isDark,
    toggleDark,
    isSidebarOpen,
    toggleSidebar,
    setSidebarOpen,
  } = useActivityBuilderStore();

  const { data: activities = [] } = useActivities();

  const renderStep = () => {
    switch (currentStep) {
      case "2-1":
        return <Step2_1 />;
      case "2-2":
        return <Step2_2 />;
      case "2-3":
        return <Step2_3 />;
      case "2-4":
        return <Step2_4 />;
      case "2-5":
        return <Step2_5 />;
      case "3-1":
        return <Step3_1 />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("min-h-screen flex transition-colors duration-300", isDark ? "dark" : "")}>
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:transform-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-colors duration-300",
          isDark ? "bg-gray-900" : "bg-gray-50"
        )}
      >
        {/* Header */}
        <header
          className={cn(
            "sticky top-0 z-30 border-b px-4 py-3 flex items-center justify-between",
            isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          )}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <X className={cn("w-5 h-5", isDark ? "text-white" : "text-gray-900")} />
              ) : (
                <Menu className={cn("w-5 h-5", isDark ? "text-white" : "text-gray-900")} />
              )}
            </Button>
            <div>
              <h1 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>
                Activity Builder
              </h1>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                Step {currentStep}
                {editingId && " (Editing)"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {editingId && (
              <Button variant="outline" size="sm" onClick={cancelEdit}>
                Cancel Edit
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDark}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </Button>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-3xl mx-auto">
            {renderStep()}

            {/* Activities list */}
            {activities.length > 0 && (
              <div
                className={cn(
                  "mt-12 pt-8 border-t",
                  isDark ? "border-gray-700" : "border-gray-200"
                )}
              >
                <h2
                  className={cn(
                    "text-xl font-semibold mb-4 flex items-center gap-2",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  Your Activities
                  <Badge variant="secondary">{activities.length}</Badge>
                </h2>
                <ActivityList />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
