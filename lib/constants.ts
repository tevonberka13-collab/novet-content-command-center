export const pipelineStatuses = [
  "idea",
  "planned",
  "filmed",
  "edited",
  "scheduled",
  "posted",
  "reviewed",
] as const;

export const campaignStatuses = ["active", "paused", "completed"] as const;

export const contentTypes = [
  "performance",
  "behind_the_scenes",
  "lifestyle",
  "promo",
  "personal_brand",
  "educational",
  "lyric_breakdown",
  "rehearsal",
  "announcement",
] as const;

export const platforms = [
  "TikTok",
  "Instagram",
  "YouTube Shorts",
  "All",
] as const;

export const preferredContentCreationDays = [
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const strongestContentCreationDays = ["Saturday", "Sunday"] as const;

export const defaultCampaigns = [
  "UMS July 24 Promotion",
  "New Music Rollout",
  "Novet Personal Brand",
  "Lifestyle / BTS",
] as const;
