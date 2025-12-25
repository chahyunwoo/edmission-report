import { z } from "zod";
import { CATEGORIES, TIERS } from "../constants";

export const activitySchema = z.object({
  name: z
    .string()
    .min(1, "Activity name is required")
    .max(50, "Activity name must be 50 characters or less"),
  category: z.enum(CATEGORIES as unknown as readonly [string, ...string[]], {
    message: "Category is required",
  }),
  tier: z.enum(TIERS as unknown as readonly [string, ...string[]], {
    message: "Tier is required",
  }),
  description: z
    .string()
    .min(1, "Description is required")
    .max(150, "Description must be 150 characters or less"),
  hoursPerWeek: z
    .number()
    .min(0, "Hours must be at least 0")
    .max(40, "Hours must be at most 40"),
  isLeadership: z.boolean(),
});

export type ActivityFormData = z.infer<typeof activitySchema>;

export const step2_1Schema = activitySchema.pick({ name: true });
export const step2_2Schema = activitySchema.pick({ category: true });
export const step2_3Schema = activitySchema.pick({ tier: true });
export const step2_4Schema = activitySchema.pick({ description: true });
export const step2_5Schema = activitySchema.pick({
  hoursPerWeek: true,
  isLeadership: true,
});
