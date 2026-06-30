"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import { PageHeader } from "@/components/page-header";
import { PipelineCard } from "@/components/pipeline/pipeline-card";
import { contentTypes, pipelineStatuses, platforms } from "@/lib/constants";
import {
  type ContentItemRow,
  mapContentItem,
} from "@/lib/supabase/content-items";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import {
  fetchPipelineData,
  pipelineContentItemColumns,
} from "@/lib/supabase/pipeline";
import type {
  Campaign,
  ContentItem,
  ContentType,
  PipelineStatus,
  Platform,
  WeeklyPlan,
} from "@/types";

const allFilter = "__all";
const noneFilter = "__none";

const selectClass =
  "mt-2 min-h-11 w-full border border-[var(--line)] bg-[var(--paper)] px-3 text-sm normal-case tracking-normal outline-none focus:border-[var(--clay)]";

function humanize(value: string) {
  return value.replaceAll("_", " ");
}

function formatWeek(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function ContentPipeline() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState("");
  const [campaignFilter, setCampaignFilter] = useState(allFilter);
  const [platformFilter, setPlatformFilter] = useState<Platform | typeof allFilter>(allFilter);
  const [typeFilter, setTypeFilter] = useState<ContentType | typeof allFilter>(allFilter);
  const [weeklyPlanFilter, setWeeklyPlanFilter] = useState(allFilter);

  async function loadData() {
    if (!isSupabaseConfigured) return;

    setIsLoading(true);
    setLoadError("");
    try {
      const data = await fetchPipelineData();
      setItems(data.items);
      setCampaigns(data.campaigns);
      setWeeklyPlans(data.weeklyPlans);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unknown Supabase error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    if (isSupabaseConfigured) {
      void fetchPipelineData()
        .then((data) => {
          if (cancelled) return;
          setItems(data.items);
          setCampaigns(data.campaigns);
          setWeeklyPlans(data.weeklyPlans);
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

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          (campaignFilter === allFilter ||
            (campaignFilter === noneFilter
              ? item.campaignId === null
              : item.campaignId === campaignFilter)) &&
          (platformFilter === allFilter || item.platform === platformFilter) &&
          (typeFilter === allFilter || item.contentType === typeFilter) &&
          (weeklyPlanFilter === allFilter ||
            (weeklyPlanFilter === noneFilter
              ? item.weeklyPlanId === null
              : item.weeklyPlanId === weeklyPlanFilter)),
      ),
    [items, campaignFilter, platformFilter, typeFilter, weeklyPlanFilter],
  );

  const filtersActive =
    campaignFilter !== allFilter ||
    platformFilter !== allFilter ||
    typeFilter !== allFilter ||
    weeklyPlanFilter !== allFilter;

  function resetFilters() {
    setCampaignFilter(allFilter);
    setPlatformFilter(allFilter);
    setTypeFilter(allFilter);
    setWeeklyPlanFilter(allFilter);
  }

  async function moveItem(item: ContentItem, status: PipelineStatus) {
    setUpdatingItemId(item.id);
    setMessage("");

    const result = await getSupabaseBrowserClient()
      .from("content_items")
      .update({ status })
      .eq("id", item.id)
      .select(pipelineContentItemColumns)
      .single();

    if (result.error) {
      setMessage(`Couldn’t move “${item.title}”: ${result.error.message}`);
      setUpdatingItemId(null);
      return;
    }

    const savedItem = mapContentItem(result.data as ContentItemRow);
    setItems((current) =>
      current.map((currentItem) =>
        currentItem.id === savedItem.id ? savedItem : currentItem,
      ),
    );
    setMessage(`“${item.title}” moved to ${humanize(status)}.`);
    setUpdatingItemId(null);
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto w-full max-w-[100rem] px-5 py-8 sm:px-8 sm:py-10 xl:px-12">
        <PageHeader
          eyebrow="Know what moves next"
          title="Pipeline"
          description="Track each idea from raw thought to reviewed post with seven simple, dependable statuses."
        />
        <section className="mt-10 border-l-4 border-[var(--clay)] bg-[var(--paper-deep)] p-6 sm:p-8">
          <p className="eyebrow">Supabase setup needed</p>
          <h2 className="font-display mt-2 text-3xl font-semibold">Connect Supabase to load the pipeline.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Copy <code>.env.example</code> to <code>.env.local</code>, add your Supabase project URL and anon key, then restart the development server.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[100rem] px-5 py-8 sm:px-8 sm:py-10 xl:px-12">
      <div className="flex flex-col gap-5 border-b border-[var(--line)] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          eyebrow="Know what moves next"
          title="Pipeline"
          description="Track each idea from raw thought to reviewed post with seven simple, dependable statuses."
          bordered={false}
        />
        <div className="shrink-0 border-l-2 border-[var(--clay)] pl-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Visible content</p>
          <p className="font-display mt-1 text-4xl font-semibold leading-none">{filteredItems.length}</p>
        </div>
      </div>

      {message && (
        <p aria-live="polite" className="mt-6 border-l-2 border-[var(--clay)] pl-3 text-sm">
          {message}
        </p>
      )}

      {loadError && (
        <div role="alert" className="mt-8 border border-red-300 bg-red-50 p-5 text-sm text-red-900">
          <p className="font-semibold">The pipeline couldn’t load.</p>
          <p className="mt-1">{loadError}</p>
          <button type="button" onClick={() => void loadData()} className="mt-4 underline underline-offset-4">
            Try again
          </button>
        </div>
      )}

      {!loadError && (
        <>
          <section className="border-b border-[var(--line)] py-7" aria-label="Pipeline filters">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <AdjustmentsHorizontalIcon className="size-5 text-[var(--clay)]" aria-hidden />
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em]">Filter the board</h2>
              </div>
              {filtersActive && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex min-h-9 items-center gap-2 self-start text-xs font-semibold uppercase tracking-[0.1em] text-[var(--clay)] underline decoration-[var(--line)] underline-offset-4"
                >
                  <ArrowPathIcon className="size-4" aria-hidden /> Reset filters
                </button>
              )}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <label className="text-xs font-semibold uppercase tracking-[0.1em]">
                Campaign
                <select value={campaignFilter} onChange={(event) => setCampaignFilter(event.target.value)} className={selectClass}>
                  <option value={allFilter}>All campaigns</option>
                  <option value={noneFilter}>No campaign</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-semibold uppercase tracking-[0.1em]">
                Platform
                <select value={platformFilter} onChange={(event) => setPlatformFilter(event.target.value as Platform | typeof allFilter)} className={selectClass}>
                  <option value={allFilter}>All platforms</option>
                  {platforms.map((platform) => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-semibold uppercase tracking-[0.1em]">
                Content type
                <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as ContentType | typeof allFilter)} className={selectClass}>
                  <option value={allFilter}>All content types</option>
                  {contentTypes.map((type) => (
                    <option key={type} value={type}>{humanize(type)}</option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-semibold uppercase tracking-[0.1em]">
                Weekly plan
                <select value={weeklyPlanFilter} onChange={(event) => setWeeklyPlanFilter(event.target.value)} className={selectClass}>
                  <option value={allFilter}>All weekly plans</option>
                  <option value={noneFilter}>No weekly plan</option>
                  {weeklyPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      Week of {formatWeek(plan.weekStartDate)}{plan.mainFocus ? ` · ${plan.mainFocus}` : ""}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          {isLoading ? (
            <div className="mt-8 grid grid-flow-col auto-cols-[minmax(17rem,1fr)] gap-4 overflow-hidden" aria-label="Loading pipeline">
              {pipelineStatuses.map((status) => (
                <div key={status} className="h-[28rem] animate-pulse bg-[var(--paper-deep)]" />
              ))}
            </div>
          ) : (
            <section className="mt-8" aria-label="Content status pipeline">
              {items.length === 0 && (
                <div className="mb-6 flex items-start gap-4 border border-[var(--line)] bg-[var(--paper-deep)]/55 p-5">
                  <LightBulbIcon className="mt-0.5 size-6 shrink-0 text-[var(--clay)]" aria-hidden />
                  <div>
                    <p className="text-sm font-semibold">The pipeline is ready for its first idea.</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">Add content in the Idea Bank and it will appear in the idea column.</p>
                  </div>
                </div>
              )}

              <p className="mb-3 text-xs leading-5 text-[var(--muted)] xl:hidden">Swipe horizontally to see every stage.</p>
              <div className="overflow-x-auto pb-5">
                <div className="grid min-w-max grid-flow-col auto-cols-[minmax(17rem,19rem)] gap-4">
                  {pipelineStatuses.map((status, index) => {
                    const columnItems = filteredItems.filter((item) => item.status === status);
                    const previousStatus = pipelineStatuses[index - 1];
                    const nextStatus = pipelineStatuses[index + 1];

                    return (
                      <section key={status} className="flex min-h-[26rem] flex-col border border-[var(--line)] bg-[var(--paper-deep)]/45" aria-labelledby={`pipeline-${status}`}>
                        <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] bg-[var(--paper-deep)] px-4 py-4">
                          <div>
                            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[var(--clay)]">Stage {index + 1}</p>
                            <h2 id={`pipeline-${status}`} className="font-display mt-1 text-3xl font-semibold capitalize">{humanize(status)}</h2>
                          </div>
                          <span className="grid size-8 place-items-center border border-[var(--line)] bg-[var(--paper)] text-xs font-semibold" aria-label={`${columnItems.length} items`}>
                            {columnItems.length}
                          </span>
                        </div>

                        <div className="flex flex-1 flex-col gap-3 p-3">
                          {columnItems.map((item) => (
                            <PipelineCard
                              key={item.id}
                              item={item}
                              campaign={item.campaignId ? campaignById.get(item.campaignId) : undefined}
                              previousStatus={previousStatus}
                              nextStatus={nextStatus}
                              isUpdating={updatingItemId === item.id}
                              onMove={moveItem}
                            />
                          ))}

                          {columnItems.length === 0 && (
                            <div className="flex flex-1 flex-col items-center justify-center border border-dashed border-[var(--line)] px-5 py-10 text-center">
                              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Nothing here yet</p>
                              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                                {filtersActive ? "No content in this stage matches the current filters." : `Move content into ${humanize(status)} when it reaches this stage.`}
                              </p>
                            </div>
                          )}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
