import { campaignStatuses, defaultCampaigns } from "@/lib/constants";

export type CampaignStatus = (typeof campaignStatuses)[number];

export type DefaultCampaignName = (typeof defaultCampaigns)[number];

export type Campaign = {
  id: string;
  name: string;
  description: string;
  goal: string;
  startDate: string | null;
  endDate: string | null;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
};
