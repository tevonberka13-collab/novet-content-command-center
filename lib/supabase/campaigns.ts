import {
  type CampaignRow,
  type ContentItemRow,
  mapCampaign,
  mapContentItem,
} from "@/lib/supabase/content-items";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export const campaignColumns =
  "id,name,description,goal,start_date,end_date,status,created_at,updated_at";

export const campaignContentItemColumns =
  "id,title,campaign_id,weekly_plan_id,content_type,platform,status,planned_post_date,filming_date,hook,script,caption,cta,notes,created_at,updated_at";

export async function fetchCampaignsData() {
  const supabase = getSupabaseBrowserClient();
  const [campaignResult, itemResult] = await Promise.all([
    supabase.from("campaigns").select(campaignColumns).order("name"),
    supabase
      .from("content_items")
      .select(campaignContentItemColumns)
      .not("campaign_id", "is", null)
      .order("updated_at", { ascending: false }),
  ]);

  const firstError = campaignResult.error ?? itemResult.error;
  if (firstError) throw firstError;

  return {
    campaigns: ((campaignResult.data ?? []) as CampaignRow[]).map(mapCampaign),
    items: ((itemResult.data ?? []) as ContentItemRow[]).map(mapContentItem),
  };
}
