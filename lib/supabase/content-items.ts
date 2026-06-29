import type { Campaign, ContentItem, WeeklyPlan } from "@/types";

export type CampaignRow = {
  id: string;
  name: string;
  description: string;
  goal: string;
  start_date: string | null;
  end_date: string | null;
  status: Campaign["status"];
  created_at: string;
  updated_at: string;
};

export type WeeklyPlanRow = {
  id: string;
  week_start_date: string;
  main_focus: string;
  weekly_goal: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type ContentItemRow = {
  id: string;
  title: string;
  campaign_id: string | null;
  weekly_plan_id: string | null;
  content_type: ContentItem["contentType"];
  platform: ContentItem["platform"];
  status: ContentItem["status"];
  planned_post_date: string | null;
  filming_date: string | null;
  hook: string;
  script: string;
  caption: string;
  cta: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export function mapCampaign(row: CampaignRow): Campaign {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    goal: row.goal,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapWeeklyPlan(row: WeeklyPlanRow): WeeklyPlan {
  return {
    id: row.id,
    weekStartDate: row.week_start_date,
    mainFocus: row.main_focus,
    weeklyGoal: row.weekly_goal,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapContentItem(row: ContentItemRow): ContentItem {
  return {
    id: row.id,
    title: row.title,
    campaignId: row.campaign_id,
    weeklyPlanId: row.weekly_plan_id,
    contentType: row.content_type,
    platform: row.platform,
    status: row.status,
    plannedPostDate: row.planned_post_date,
    filmingDate: row.filming_date,
    hook: row.hook,
    script: row.script,
    caption: row.caption,
    cta: row.cta,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
