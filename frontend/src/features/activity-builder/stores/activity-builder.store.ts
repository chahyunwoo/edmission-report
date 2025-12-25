import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ActivityFormData } from "../schemas/activity.schema";

export type StepId = "2-1" | "2-2" | "2-3" | "2-4" | "2-5" | "3-1";

export const STEPS: { id: StepId; label: string; description: string }[] = [
  { id: "2-1", label: "Activity Name", description: "Name your activity" },
  { id: "2-2", label: "Category", description: "Select a category" },
  { id: "2-3", label: "Tier", description: "Choose the tier level" },
  { id: "2-4", label: "Description", description: "Describe your activity" },
  { id: "2-5", label: "Details", description: "Hours & leadership" },
  { id: "3-1", label: "Review", description: "Review and submit" },
];

export const STEP_ORDER: StepId[] = ["2-1", "2-2", "2-3", "2-4", "2-5", "3-1"];

interface ActivityBuilderState {
  currentStep: StepId;
  formData: ActivityFormData;
  editingId: string | null;
  isDark: boolean;
  isSidebarOpen: boolean;

  setStep: (step: StepId) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: <K extends keyof ActivityFormData>(field: K, value: ActivityFormData[K]) => void;
  setFormData: (data: Partial<ActivityFormData>) => void;
  resetForm: () => void;
  setEditingId: (id: string | null) => void;
  startEdit: (id: string, data: ActivityFormData) => void;
  cancelEdit: () => void;
  toggleDark: () => void;
  setDark: (isDark: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const initialFormData: ActivityFormData = {
  name: "",
  category: "" as ActivityFormData["category"],
  tier: "" as ActivityFormData["tier"],
  description: "",
  hoursPerWeek: 0,
  isLeadership: false,
};

export const useActivityBuilderStore = create<ActivityBuilderState>()(
  devtools(
    (set, get) => ({
      currentStep: "2-1",
      formData: initialFormData,
      editingId: null,
      isDark: false,
      isSidebarOpen: false,

      setStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep } = get();
        const currentIndex = STEP_ORDER.indexOf(currentStep);
        if (currentIndex < STEP_ORDER.length - 1) {
          set({ currentStep: STEP_ORDER[currentIndex + 1] });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        const currentIndex = STEP_ORDER.indexOf(currentStep);
        if (currentIndex > 0) {
          set({ currentStep: STEP_ORDER[currentIndex - 1] });
        }
      },

      updateFormData: (field, value) =>
        set((state) => ({
          formData: { ...state.formData, [field]: value },
        })),

      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      resetForm: () =>
        set({
          formData: initialFormData,
          currentStep: "2-1",
          editingId: null,
        }),

      setEditingId: (id) => set({ editingId: id }),

      startEdit: (id, data) =>
        set({
          editingId: id,
          formData: data,
          currentStep: "2-1",
        }),

      cancelEdit: () =>
        set({
          editingId: null,
          formData: initialFormData,
          currentStep: "2-1",
        }),

      toggleDark: () => set((state) => ({ isDark: !state.isDark })),
      setDark: (isDark) => set({ isDark }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    }),
    { name: "activity-builder" }
  )
);

export const selectCanGoNext = (state: ActivityBuilderState) => {
  const currentIndex = STEP_ORDER.indexOf(state.currentStep);
  return currentIndex < STEP_ORDER.length - 1;
};

export const selectCanGoPrev = (state: ActivityBuilderState) => {
  const currentIndex = STEP_ORDER.indexOf(state.currentStep);
  return currentIndex > 0;
};

export const selectCurrentStepIndex = (state: ActivityBuilderState) => {
  return STEP_ORDER.indexOf(state.currentStep);
};
