"use client";

import Link from "next/link";
import {
  CalendarDaysIcon,
  ChevronDownIcon,
  LightBulbIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { pipelineStatuses } from "@/lib/constants";
import type { Campaign, ContentItem, PipelineStatus } from "@/types";

function humanize(value: string) {
  return value.replaceAll("_", " ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function statusCounts(items: ContentItem[]) {
  return pipelineStatuses.reduce<Record<PipelineStatus, number>>(
    (counts, status) => {
      counts[status] = items.filter((item) => item.status === status).length;
      return counts;
    },
    {
      idea: 0,
      planned: 0,
      filmed: 0,
      edited: 0,
      scheduled: 0,
      posted: 0,
      reviewed: 0,
    },
  );
}

const campaignStatusClass = {
  active: "bg-[var(--clay)] text-white",
  paused: "border border-[var(--clay)] text-[var(--clay)]",
  completed: "bg-[var(--espresso)] text-white",
} satisfies Record<Campaign["status"], string>;

export function CampaignCard({
  campaign,
  items,
  isDeleting,
  onEdit,
  onDelete,
}: {
  campaign: Campaign;
  items: ContentItem[];
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const counts = statusCounts(items);
  const canDelete = items.length === 0;

  return (
    <article className="flex min-w-0 flex-col border border-[var(--line)] bg-[var(--paper)]">
      <div className="flex-1 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <span
            className={`px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.12em] ${campaignStatusClass[campaign.status]}`}
          >
            {campaign.status}
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
            {items.length} {items.length === 1 ? "content item" : "content items"}
          </p>
        </div>

        <h2 className="font-display mt-5 text-3xl font-semibold leading-[1.02] sm:text-4xl">
          {campaign.name}
        </h2>
        <p className="mt-3 min-h-12 text-sm leading-6 text-[var(--muted)]">
          {campaign.goal || "No campaign goal added yet."}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-[var(--line)] py-4 text-xs">
          <div>
            <dt className="font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Starts</dt>
            <dd className="mt-1.5">{campaign.startDate ? formatDate(campaign.startDate) : "Not set"}</dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Ends</dt>
            <dd className="mt-1.5">{campaign.endDate ? formatDate(campaign.endDate) : "Not set"}</dd>
          </div>
        </dl>

        <div className="mt-5">
          <div className="flex items-end justify-between gap-3">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              Content progress
            </p>
            {items.length > 0 && (
              <p className="text-xs text-[var(--muted)]">
                {counts.posted + counts.reviewed} published
              </p>
            )}
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1" aria-label="Content counts by pipeline status">
            {pipelineStatuses.map((status) => (
              <div key={status} className="min-w-0 text-center">
                <div
                  className={`grid h-7 place-items-center text-xs font-semibold ${
                    counts[status] > 0
                      ? "bg-[var(--clay)] text-white"
                      : "bg-[var(--paper-deep)] text-[var(--muted)]"
                  }`}
                  title={`${humanize(status)}: ${counts[status]}`}
                >
                  {counts[status]}
                </div>
                <span className="mt-1.5 block truncate text-[0.54rem] font-semibold uppercase tracking-[0.04em] text-[var(--muted)]">
                  {status.slice(0, 3)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <details className="group mt-6 border-t border-[var(--line)] pt-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.11em] text-[var(--clay)] [&::-webkit-details-marker]:hidden">
            View campaign details
            <ChevronDownIcon className="size-4 transition-transform group-open:rotate-180" aria-hidden />
          </summary>

          <div className="mt-5 space-y-6">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Description</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                {campaign.description || "No description added yet."}
              </p>
            </div>

            {items.length === 0 ? (
              <div className="border border-dashed border-[var(--line)] p-5">
                <LightBulbIcon className="size-5 text-[var(--clay)]" aria-hidden />
                <p className="mt-3 text-sm font-semibold">No content is connected yet.</p>
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                  Assign this campaign when creating or editing an idea.
                </p>
                <Link
                  href="/ideas"
                  className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.1em] text-[var(--clay)] underline underline-offset-4"
                >
                  Open Idea Bank
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {pipelineStatuses.map((status) => {
                  const statusItems = items.filter((item) => item.status === status);
                  if (statusItems.length === 0) return null;

                  return (
                    <section key={status} aria-label={`${humanize(status)} content`}>
                      <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] pb-2">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.11em] capitalize">
                          {humanize(status)}
                        </h3>
                        <span className="text-xs text-[var(--muted)]">{statusItems.length}</span>
                      </div>
                      <div>
                        {statusItems.map((item) => (
                          <article
                            key={item.id}
                            className="flex flex-col gap-2 border-b border-[var(--line)] py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-semibold leading-5">{item.title}</p>
                              <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                                {item.platform} · {humanize(item.contentType)}
                              </p>
                            </div>
                            {item.plannedPostDate ? (
                              <p className="flex shrink-0 items-center gap-1.5 text-xs text-[var(--muted)]">
                                <CalendarDaysIcon className="size-4 text-[var(--clay)]" aria-hidden />
                                {formatDate(item.plannedPostDate)}
                              </p>
                            ) : (
                              <p className="shrink-0 text-xs text-[var(--muted)]">No post date</p>
                            )}
                          </article>
                        ))}
                      </div>
                    </section>
                  );
                })}
                <Link
                  href="/ideas"
                  className="inline-block text-xs font-semibold uppercase tracking-[0.1em] text-[var(--clay)] underline underline-offset-4"
                >
                  View or edit content in Idea Bank
                </Link>
              </div>
            )}
          </div>
        </details>
      </div>

      <div className="grid grid-cols-2 border-t border-[var(--line)]">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex min-h-12 items-center justify-center gap-2 border-r border-[var(--line)] text-xs font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-[var(--paper-deep)]"
        >
          <PencilSquareIcon className="size-4" aria-hidden /> Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={!canDelete || isDeleting}
          title={canDelete ? "Delete campaign" : "Remove related content before deleting this campaign"}
          className="inline-flex min-h-12 items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-red-800 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:bg-[var(--paper-deep)]/55 disabled:text-[var(--muted)]"
        >
          <TrashIcon className="size-4" aria-hidden />
          {isDeleting ? "Deleting…" : canDelete ? "Delete" : "In use"}
        </button>
      </div>
    </article>
  );
}
