"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MegaphoneIcon, PlusIcon } from "@heroicons/react/24/outline";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import {
  CampaignForm,
  type CampaignFormValues,
} from "@/components/campaigns/campaign-form";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import {
  campaignColumns,
  fetchCampaignsData,
} from "@/lib/supabase/campaigns";
import {
  type CampaignRow,
  mapCampaign,
} from "@/lib/supabase/content-items";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import type { Campaign, ContentItem } from "@/types";

export function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  async function loadData() {
    if (!isSupabaseConfigured) return;

    setIsLoading(true);
    setLoadError("");
    try {
      const data = await fetchCampaignsData();
      setCampaigns(data.campaigns);
      setItems(data.items);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unknown Supabase error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    if (isSupabaseConfigured) {
      void fetchCampaignsData()
        .then((data) => {
          if (cancelled) return;
          setCampaigns(data.campaigns);
          setItems(data.items);
          setIsLoading(false);
        })
        .catch((error: unknown) => {
          if (cancelled) return;
          setLoadError(error instanceof Error ? error.message : "Unknown Supabase error");
          setIsLoading(false);
        });
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const itemsByCampaign = useMemo(() => {
    const grouped = new Map<string, ContentItem[]>();
    for (const item of items) {
      if (!item.campaignId) continue;
      const campaignItems = grouped.get(item.campaignId) ?? [];
      campaignItems.push(item);
      grouped.set(item.campaignId, campaignItems);
    }
    return grouped;
  }, [items]);

  const activeCount = campaigns.filter((campaign) => campaign.status === "active").length;

  function scrollToForm() {
    requestAnimationFrame(() =>
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }

  function openCreateForm() {
    setEditingCampaign(null);
    setFormOpen(true);
    setMessage("");
    scrollToForm();
  }

  function openEditForm(campaign: Campaign) {
    setEditingCampaign(campaign);
    setFormOpen(true);
    setMessage("");
    scrollToForm();
  }

  function closeForm() {
    setFormOpen(false);
    setEditingCampaign(null);
  }

  async function saveCampaign(values: CampaignFormValues) {
    const duplicate = campaigns.some(
      (campaign) =>
        campaign.id !== editingCampaign?.id &&
        campaign.name.toLocaleLowerCase() === values.name.toLocaleLowerCase(),
    );
    if (duplicate) {
      setMessage("A campaign with that name already exists.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    const payload = {
      name: values.name,
      description: values.description,
      goal: values.goal,
      start_date: values.startDate || null,
      end_date: values.endDate || null,
      status: values.status,
    };

    const supabase = getSupabaseBrowserClient();
    const result = editingCampaign
      ? await supabase
          .from("campaigns")
          .update(payload)
          .eq("id", editingCampaign.id)
          .select(campaignColumns)
          .single()
      : await supabase
          .from("campaigns")
          .insert(payload)
          .select(campaignColumns)
          .single();

    if (result.error) {
      setMessage(`Couldn’t save the campaign: ${result.error.message}`);
      setIsSaving(false);
      return;
    }

    const savedCampaign = mapCampaign(result.data as CampaignRow);
    setCampaigns((current) =>
      (editingCampaign
        ? current.map((campaign) =>
            campaign.id === savedCampaign.id ? savedCampaign : campaign,
          )
        : [...current, savedCampaign]
      ).sort((a, b) => a.name.localeCompare(b.name)),
    );
    setMessage(editingCampaign ? "Campaign updated." : "Campaign created.");
    setIsSaving(false);
    closeForm();
  }

  async function deleteCampaign(campaign: Campaign) {
    if ((itemsByCampaign.get(campaign.id) ?? []).length > 0) {
      setMessage(
        `“${campaign.name}” still has related content. Reassign those items in the Idea Bank before deleting it.`,
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete “${campaign.name}”? This can’t be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(campaign.id);
    setMessage("");
    const supabase = getSupabaseBrowserClient();

    const relationCheck = await supabase
      .from("content_items")
      .select("id", { count: "exact", head: true })
      .eq("campaign_id", campaign.id);

    if (relationCheck.error) {
      setMessage(`Couldn’t verify related content: ${relationCheck.error.message}`);
      setDeletingId(null);
      return;
    }

    if ((relationCheck.count ?? 0) > 0) {
      setMessage(
        `“${campaign.name}” has related content and wasn’t deleted. Reassign those items first.`,
      );
      setDeletingId(null);
      await loadData();
      return;
    }

    const { error } = await supabase.from("campaigns").delete().eq("id", campaign.id);
    if (error) {
      setMessage(`Couldn’t delete the campaign: ${error.message}`);
      setDeletingId(null);
      return;
    }

    setCampaigns((current) =>
      current.filter((currentCampaign) => currentCampaign.id !== campaign.id),
    );
    setMessage("Campaign deleted.");
    setDeletingId(null);
    if (editingCampaign?.id === campaign.id) closeForm();
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto w-full max-w-[90rem] px-5 py-8 sm:px-8 sm:py-10 xl:px-12">
        <PageHeader
          eyebrow="Keep the story connected"
          title="Campaigns"
          description="Group content around releases, live shows, the Novet brand, and life behind the scenes."
        />
        <section className="mt-10 border-l-4 border-[var(--clay)] bg-[var(--paper-deep)] p-6 sm:p-8">
          <p className="eyebrow">Supabase setup needed</p>
          <h2 className="font-display mt-2 text-3xl font-semibold">Connect Supabase to manage campaigns.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Copy <code>.env.example</code> to <code>.env.local</code>, add your Supabase project URL and anon key, then restart the development server.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[90rem] px-5 py-8 sm:px-8 sm:py-10 xl:px-12">
      <div className="flex flex-col gap-6 border-b border-[var(--line)] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          eyebrow="Keep the story connected"
          title="Campaigns"
          description="Group content around releases, live shows, the Novet brand, and life behind the scenes."
          bordered={false}
        />
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-[var(--clay)] px-5 text-sm font-medium text-white transition-colors hover:bg-[var(--clay-dark)]"
        >
          <PlusIcon className="size-[1.1rem]" aria-hidden />
          Add campaign
        </button>
      </div>

      <div ref={formRef} className="scroll-mt-20">
        {formOpen && (
          <CampaignForm
            key={editingCampaign?.id ?? "new-campaign"}
            campaign={editingCampaign}
            isSaving={isSaving}
            onCancel={closeForm}
            onSubmit={saveCampaign}
          />
        )}
      </div>

      {message && (
        <p aria-live="polite" className="mt-6 border-l-2 border-[var(--clay)] pl-3 text-sm">
          {message}
        </p>
      )}

      {loadError && (
        <div role="alert" className="mt-8 border border-red-300 bg-red-50 p-5 text-sm text-red-900">
          <p className="font-semibold">Campaigns couldn’t load.</p>
          <p className="mt-1">{loadError}</p>
          <button type="button" onClick={() => void loadData()} className="mt-4 underline underline-offset-4">
            Try again
          </button>
        </div>
      )}

      {!loadError && (
        <>
          <section className="grid grid-cols-3 border-b border-[var(--line)] py-6" aria-label="Campaign summary">
            <div className="border-r border-[var(--line)] pr-4">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Campaigns</p>
              <p className="font-display mt-1 text-3xl font-semibold">{campaigns.length}</p>
            </div>
            <div className="border-r border-[var(--line)] px-4">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Active</p>
              <p className="font-display mt-1 text-3xl font-semibold">{activeCount}</p>
            </div>
            <div className="pl-4">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Related content</p>
              <p className="font-display mt-1 text-3xl font-semibold">{items.length}</p>
            </div>
          </section>

          {isLoading ? (
            <div className="grid gap-5 py-8 md:grid-cols-2" aria-label="Loading campaigns">
              {[0, 1, 2, 3].map((placeholder) => (
                <div key={placeholder} className="h-[28rem] animate-pulse bg-[var(--paper-deep)]" />
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <EmptyState
              icon={MegaphoneIcon}
              title="Create the first campaign and give the week a direction."
              description="Start with a release, show, brand story, or behind-the-scenes theme. Content can be connected from the Idea Bank."
              actionLabel="Create a campaign"
              onAction={openCreateForm}
            />
          ) : (
            <section className="grid gap-5 py-8 md:grid-cols-2" aria-label="Campaign list">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  items={itemsByCampaign.get(campaign.id) ?? []}
                  isDeleting={deletingId === campaign.id}
                  onEdit={() => openEditForm(campaign)}
                  onDelete={() => void deleteCampaign(campaign)}
                />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
