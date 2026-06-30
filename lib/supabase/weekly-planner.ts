import {
  type ContentItemRow,
  type WeeklyPlanRow,
  mapContentItem,
  mapWeeklyPlan,
} from "@/lib/supabase/content-items";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export const weeklyPlanColumns =
  "id,week_start_date,main_focus,weekly_goal,notes,created_at,updated_at";

export const plannerContentItemColumns =
  "id,title,campaign_id,weekly_plan_id,content_type,platform,status,planned_post_date,filming_date,hook,script,caption,cta,notes,created_at,updated_at";

export async function fetchWeeklyPlannerData() {
  const supabase = getSupabaseBrowserClient();
  const [planResult, itemResult] = await Promise.all([
    supabase
      .from("weekly_plans")
      .select(weeklyPlanColumns)
      .order("week_start_date", { ascending: false }),
    supabase
      .from("content_items")
      .select(plannerContentItemColumns)
      .order("updated_at", { ascending: false }),
  ]);

  const firstError = planResult.error ?? itemResult.error;
  if (firstError) throw firstError;

  return {
    plans: ((planResult.data ?? []) as WeeklyPlanRow[]).map(mapWeeklyPlan),
    items: ((itemResult.data ?? []) as ContentItemRow[]).map(mapContentItem),
  };
}
