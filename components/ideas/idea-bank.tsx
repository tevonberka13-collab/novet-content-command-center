"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AdjustmentsHorizontalIcon,
  LightBulbIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { EmptyState } from "@/components/empty-state";
import { IdeaCard } from "@/components/ideas/idea-card";
import { IdeaForm, type IdeaFormValues } from "@/components/ideas/idea-form";
import { PageHeader } from "@/components/page-header";
import { contentTypes, pipelineStatuses, platforms } from "@/lib/constants";
import {
  type CampaignRow,
  type ContentItemRow,
  type WeeklyPlanRow,
  mapCampaign,
  mapContentItem,
  mapWeeklyPlan,
} from "@/lib/supabase/content-items";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import type {
  Campaign,
  ContentItem,
  ContentType,
  PipelineStatus,
  Platform,
  WeeklyPlan,
} from "@/types";

const campaignColumns =
  "id,name,description,goal,start_date,end_date,status,created_at,updated_at";
const weeklyPlanColumns =
  "id,week_start_date,main_focus,weekly_goal,notes,created_at,updated_at";
const contentItemColumns =
  "id,title,campaign_id,weekly_plan_id,content_type,platform,status,planned_post_date,filming_date,hook,script,caption,cta,notes,created_at,updated_at";

async function fetchIdeaBankData() {
  const supabase = getSupabaseBrowserClient();
  const [campaignResult, weeklyPlanResult, itemResult] = await Promise.all([
    supabase.from("campaigns").select(campaignColumns).order("name"),
    supabase
      .from("weekly_plans")
      .select(weeklyPlanColumns)
      .order("week_start_date", { ascending: false }),
    supabase
      .from("content_items")
      .select(contentItemColumns)
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

function humanize(value: string) {
  return value.replaceAll("_", " ");
}

const selectClass =
  "mt-2 min-h-11 w-full border border-[var(--line)] bg-[var(--paper)] px-3 text-sm outline-none focus:border-[var(--clay)]";

export function IdeaBank() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<PipelineStatus | "all">("all");
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ContentType | "all">("all");
  const formRef = useRef<HTMLDivElement>(null);

  async function loadData() {
    if (!isSupabaseConfigured) return;

    setIsLoading(true);
    setLoadError("");

    try {
      const data = await fetchIdeaBankData();
      setCampaigns(data.campaigns);
      setWeeklyPlans(data.weeklyPlans);
      setItems(data.items);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unknown Supabase error");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    if (isSupabaseConfigured) {
      void fetchIdeaBankData()
        .then((data) => {
          if (cancelled) return;
          setCampaigns(data.campaigns);
          setWeeklyPlans(data.weeklyPlans);
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

  const campaignById = useMemo(
    () => new Map(campaigns.map((campaign) => [campaign.id, campaign])),
    [campaigns],
  );
  const weeklyPlanById = useMemo(
    () => new Map(weeklyPlans.map((plan) => [plan.id, plan])),
    [weeklyPlans],
  );

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          (campaignFilter === "all" ||
            (campaignFilter === "none" ? item.campaignId === null : item.campaignId === campaignFilter)) &&
          (statusFilter === "all" || item.status === statusFilter) &&
          (platformFilter === "all" || item.platform === platformFilter) &&
          (typeFilter === "all" || item.contentType === typeFilter),
      ),
    [items, campaignFilter, statusFilter, platformFilter, typeFilter],
  );

  const filtersActive =
    campaignFilter !== "all" ||
    statusFilter !== "all" ||
    platformFilter !== "all" ||
    typeFilter !== "all";

  function openCreateForm() {
    setEditingItem(null);
    setFormOpen(true);
    setMessage("");
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function openEditForm(item: ContentItem) {
    setEditingItem(item);
    setFormOpen(true);
    setMessage("");
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function closeForm() {
    setFormOpen(false);
    setEditingItem(null);
  }

  function resetFilters() {
    setCampaignFilter("all");
    setStatusFilter("all");
    setPlatformFilter("all");
    setTypeFilter("all");
  }

  async function saveIdea(values: IdeaFormValues) {
    setIsSaving(true);
    setMessage("");

    const payload = {
      title: values.title,
      campaign_id: values.campaignId || null,
      weekly_plan_id: values.weeklyPlanId || null,
      content_type: values.contentType,
      platform: values.platform,
      status: values.status,
      planned_post_date: values.plannedPostDate || null,
      filming_date: values.filmingDate || null,
      hook: values.hook.trim(),
      script: values.script.trim(),
      caption: values.caption.trim(),
      cta: values.cta.trim(),
      notes: values.notes.trim(),
    };

    const supabase = getSupabaseBrowserClient();
    const result = editingItem
      ? await supabase
          .from("content_items")
          .update(payload)
          .eq("id", editingItem.id)
          .select(contentItemColumns)
          .single()
      : await supabase
          .from("content_items")
          .insert(payload)
          .select(contentItemColumns)
          .single();

    if (result.error) {
      setMessage(`Couldn’t save the idea: ${result.error.message}`);
      setIsSaving(false);
      return;
    }

    const savedItem = mapContentItem(result.data as ContentItemRow);
    setItems((current) =>
      editingItem
        ? current.map((item) => (item.id === savedItem.id ? savedItem : item))
        : [savedItem, ...current],
    );
    setMessage(editingItem ? "Idea updated." : "Idea added to the bank.");
    setIsSaving(false);
    closeForm();
  }

  async function deleteIdea(item: ContentItem) {
    const confirmed = window.confirm(`Delete “${item.title}”? This can’t be undone.`);
    if (!confirmed) return;

    setDeletingId(item.id);
    setMessage("");
    const { error } = await getSupabaseBrowserClient()
      .from("content_items")
      .delete()
      .eq("id", item.id);

    if (error) {
      setMessage(`Couldn’t delete the idea: ${error.message}`);
      setDeletingId(null);
      return;
    }

    setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
    setMessage("Idea deleted.");
    setDeletingId(null);
    if (editingItem?.id === item.id) closeForm();
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto w-full max-w-[90rem] px-5 py-8 sm:px-8 sm:py-10 xl:px-12">
        <PageHeader
          eyebrow="Capture before it disappears"
          title="Idea Bank"
          description="Keep every content spark in one place, then shape it into a post when the timing is right."
        />
        <section className="mt-10 border-l-4 border-[var(--clay)] bg-[var(--paper-deep)] p-6 sm:p-8">
          <p className="eyebrow">Supabase setup needed</p>
          <h2 className="font-display mt-2 text-3xl font-semibold">Connect the idea bank to load your content.</h2>
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
          eyebrow="Capture before it disappears"
          title="Idea Bank"
          description="Keep every content spark in one place, then shape it into a post when the timing is right."
          bordered={false}
        />
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-[var(--clay)] px-5 text-sm font-medium text-white transition-colors hover:bg-[var(--clay-dark)]"
        >
          <PlusIcon className="size-[1.1rem]" aria-hidden />
          Add idea
        </button>
      </div>

      <div ref={formRef} className="scroll-mt-20">
        {formOpen && (
          <IdeaForm
            key={editingItem?.id ?? "new-idea"}
            campaigns={campaigns}
            weeklyPlans={weeklyPlans}
            item={editingItem}
            isSaving={isSaving}
            onCancel={closeForm}
            onSubmit={saveIdea}
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
          <p className="font-semibold">The idea bank couldn’t load.</p>
          <p className="mt-1">{loadError}</p>
          <button type="button" onClick={() => void loadData()} className="mt-4 underline underline-offset-4">
            Try again
          </button>
        </div>
      )}

      {!loadError && (
        <>
          <section className="border-b border-[var(--line)] py-7" aria-label="Idea filters">
            <div className="flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="size-5 text-[var(--clay)]" aria-hidden />
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em]">Filter the bank</h2>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <label className="text-xs font-semibold uppercase tracking-[0.1em]">
                Campaign
                <select value={campaignFilter} onChange={(event) => setCampaignFilter(event.target.value)} className={selectClass}>
                  <option value="all">All campaigns</option>
                  <option value="none">No campaign</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.1em]">
                Status
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as PipelineStatus | "all")} className={selectClass}>
                  <option value="all">All statuses</option>
                  {pipelineStatuses.map((status) => <option key={status} value={status}>{humanize(status)}</option>)}
                </select>
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.1em]">
                Platform
                <select value={platformFilter} onChange={(event) => setPlatformFilter(event.target.value as Platform | "all")} className={selectClass}>
                  <option value="all">All platforms</option>
                  {platforms.map((platform) => <option key={platform} value={platform}>{platform}</option>)}
                </select>
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.1em]">
                Content type
                <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as ContentType | "all")} className={selectClass}>
                  <option value="all">All content types</option>
                  {contentTypes.map((type) => <option key={type} value={type}>{humanize(type)}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 text-xs text-[var(--muted)]">
              <p>{filteredItems.length} of {items.length} {items.length === 1 ? "idea" : "ideas"}</p>
              {filtersActive && (
                <button type="button" onClick={resetFilters} className="font-semibold text-[var(--clay)] underline underline-offset-4">
                  Clear filters
                </button>
              )}
            </div>
          </section>

          {isLoading ? (
            <p className="py-16 text-sm text-[var(--muted)]">Loading the idea bank…</p>
          ) : items.length === 0 ? (
            <EmptyState
              icon={LightBulbIcon}
              title="The bank is ready for the first good idea."
              description="Capture the title now. Campaigns, scripts, captions, and dates can take shape when you’re ready."
              actionLabel="Add the first idea"
              onAction={openCreateForm}
            />
          ) : filteredItems.length === 0 ? (
            <section className="py-16">
              <p className="eyebrow">No matches</p>
              <h2 className="font-display mt-2 text-4xl font-semibold">Nothing fits those filters yet.</h2>
              <button type="button" onClick={resetFilters} className="mt-5 text-sm font-semibold text-[var(--clay)] underline underline-offset-4">
                Show every idea
              </button>
            </section>
          ) : (
            <section className="grid gap-5 py-8 md:grid-cols-2 2xl:grid-cols-3" aria-label="Content ideas">
              {filteredItems.map((item) => (
                <IdeaCard
                  key={item.id}
                  item={item}
                  campaign={item.campaignId ? campaignById.get(item.campaignId) : undefined}
                  weeklyPlan={item.weeklyPlanId ? weeklyPlanById.get(item.weeklyPlanId) : undefined}
                  isDeleting={deletingId === item.id}
                  onEdit={() => openEditForm(item)}
                  onDelete={() => void deleteIdea(item)}
                />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
