import {
  type CampaignRow,
  type ContentItemRow,
  type WeeklyPlanRow,
  mapCampaign,
  mapContentItem,
  mapWeeklyPlan,
} from "@/lib/supabase/content-items";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export const pipelineContentItemColumns =
  "id,title,campaign_id,weekly_plan_id,content_type,platform,status,planned_post_date,filming_date,hook,script,caption,cta,notes,created_at,updated_at";

const campaignColumns =
  "id,name,description,goal,start_date,end_date,status,created_at,updated_at";

const weeklyPlanColumns =
  "id,week_start_date,main_focus,weekly_goal,notes,created_at,updated_at";

export async function fetchPipelineData() {
  const supabase = getSupabaseBrowserClient();
  const [campaignResult, weeklyPlanResult, itemResult] = await Promise.all([
    supabase.from("campaigns").select(campaignColumns).order("name"),
    supabase
      .from("weekly_plans")
      .select(weeklyPlanColumns)
      .order("week_start_date", { ascending: false }),
    supabase
      .from("content_items")
      .select(pipelineContentItemColumns)
      .order("updated_at", { ascending: false }),
  ]);

  const firstError = campaignResult.error ?? weeklyPlanResult.error ?? itemResult.error;
  if (firstError) throw firstError;

  return {
    campaigns: ((campaignResult.data ?? []) as CampaignRow[]).map(mapCampaign),
    weeklyPlans: ((weeklyPlanResult.data ?? []) as WeeklyPlanRow[]).map(mapWeeklyPlan),
    items: ((itemResult.data ?? []) as ContentItemRow[]).map(mapContentItem),
  };
}
