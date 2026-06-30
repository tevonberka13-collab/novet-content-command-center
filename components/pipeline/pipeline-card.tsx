"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  FilmIcon,
} from "@heroicons/react/24/outline";
import type { Campaign, ContentItem, PipelineStatus } from "@/types";

function humanize(value: string) {
  return value.replaceAll("_", " ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function PipelineCard({
  item,
  campaign,
  previousStatus,
  nextStatus,
  isUpdating,
  onMove,
}: {
  item: ContentItem;
  campaign?: Campaign;
  previousStatus?: PipelineStatus;
  nextStatus?: PipelineStatus;
  isUpdating: boolean;
  onMove: (item: ContentItem, status: PipelineStatus) => void;
}) {
  return (
    <article className="border border-[var(--line)] bg-[var(--paper)]">
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.11em]">
          <span className="border border-[var(--line)] px-2 py-1">{item.platform}</span>
          <span className="text-[var(--muted)]">{humanize(item.contentType)}</span>
        </div>

        <h3 className="font-display mt-4 text-2xl font-semibold leading-[1.05]">
          {item.title}
        </h3>

        {campaign && (
          <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[var(--clay)]">
            {campaign.name}
          </p>
        )}

        {(item.plannedPostDate || item.filmingDate) && (
          <div className="mt-4 space-y-2 border-t border-[var(--line)] pt-3 text-xs text-[var(--muted)]">
            {item.plannedPostDate && (
              <p className="flex items-center gap-2">
                <CalendarDaysIcon className="size-4 shrink-0 text-[var(--clay)]" aria-hidden />
                Post {formatDate(item.plannedPostDate)}
              </p>
            )}
            {item.filmingDate && (
              <p className="flex items-center gap-2">
                <FilmIcon className="size-4 shrink-0 text-[var(--clay)]" aria-hidden />
                Film {formatDate(item.filmingDate)}
              </p>
            )}
          </div>
        )}
      </div>

      <div className={`grid border-t border-[var(--line)] ${previousStatus && nextStatus ? "grid-cols-2" : "grid-cols-1"}`}>
        {previousStatus && (
          <button
            type="button"
            onClick={() => onMove(item, previousStatus)}
            disabled={isUpdating}
            className={`inline-flex min-h-11 items-center justify-center gap-1.5 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-[var(--muted)] transition-colors hover:bg-[var(--paper-deep)] hover:text-[var(--ink)] disabled:cursor-wait disabled:opacity-50 ${nextStatus ? "border-r border-[var(--line)]" : ""}`}
            aria-label={`Move ${item.title} back to ${humanize(previousStatus)}`}
          >
            <ArrowLeftIcon className="size-3.5" aria-hidden />
            {isUpdating ? "Moving…" : humanize(previousStatus)}
          </button>
        )}
        {nextStatus && (
          <button
            type="button"
            onClick={() => onMove(item, nextStatus)}
            disabled={isUpdating}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 bg-[var(--clay)] px-3 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[var(--clay-dark)] disabled:cursor-wait disabled:opacity-50"
            aria-label={`Move ${item.title} forward to ${humanize(nextStatus)}`}
          >
            {isUpdating ? "Moving…" : humanize(nextStatus)}
            <ArrowRightIcon className="size-3.5" aria-hidden />
          </button>
        )}
      </div>
    </article>
  );
}
