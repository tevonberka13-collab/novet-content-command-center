import {
  contentTypes,
  pipelineStatuses,
  platforms,
} from "@/lib/constants";

export type PipelineStatus = (typeof pipelineStatuses)[number];

export type ContentType = (typeof contentTypes)[number];

export type Platform = (typeof platforms)[number];

export type ContentItem = {
  id: string;
  title: string;
  campaignId: string | null;
  weeklyPlanId: string | null;
  contentType: ContentType;
  platform: Platform;
  status: PipelineStatus;
  plannedPostDate: string | null;
  filmingDate: string | null;
  hook: string;
  script: string;
  caption: string;
  cta: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};
