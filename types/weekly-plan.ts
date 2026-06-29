import { preferredContentCreationDays } from "@/lib/constants";

export type PreferredContentCreationDay =
  (typeof preferredContentCreationDays)[number];

export type WeeklyPlan = {
  id: string;
  weekStartDate: string;
  mainFocus: string;
  weeklyGoal: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};
