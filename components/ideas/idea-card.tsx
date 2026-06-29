"use client";

import {
  CalendarDaysIcon,
  FilmIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { Campaign, ContentItem, WeeklyPlan } from "@/types";

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

export function IdeaCard({
  item,
  campaign,
  weeklyPlan,
  isDeleting,
  onEdit,
  onDelete,
}: {
  item: ContentItem;
  campaign?: Campaign;
  weeklyPlan?: WeeklyPlan;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="flex h-full flex-col border border-[var(--line)] bg-[var(--paper)]">
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em]">
          <span className="bg-[var(--clay)] px-2.5 py-1 text-white">{humanize(item.status)}</span>
          <span className="border border-[var(--line)] px-2.5 py-1">{item.platform}</span>
          <span className="text-[var(--muted)]">{humanize(item.contentType)}</span>
        </div>

        <h2 className="font-display mt-5 text-3xl font-semibold leading-[1.05]">{item.title}</h2>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--clay)]">
          {campaign?.name ?? "No campaign"}
        </p>

        {(item.plannedPostDate || item.filmingDate) && (
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-y border-[var(--line)] py-3 text-xs text-[var(--muted)]">
            {item.plannedPostDate && (
              <span className="inline-flex items-center gap-2">
                <CalendarDaysIcon className="size-4 text-[var(--clay)]" aria-hidden />
                Post {formatDate(item.plannedPostDate)}
              </span>
            )}
            {item.filmingDate && (
              <span className="inline-flex items-center gap-2">
                <FilmIcon className="size-4 text-[var(--clay)]" aria-hidden />
                Film {formatDate(item.filmingDate)}
              </span>
            )}
          </div>
        )}

        <div className="mt-5 space-y-4 text-sm leading-6">
          {item.hook && (
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Hook</p>
              <p className="mt-1 line-clamp-3">{item.hook}</p>
            </div>
          )}
          {item.caption && (
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Caption</p>
              <p className="mt-1 line-clamp-3 text-[var(--muted)]">{item.caption}</p>
            </div>
          )}
          {!item.hook && !item.caption && (
            <p className="text-[var(--muted)]">Add a hook or caption when this idea is ready to take shape.</p>
          )}
        </div>

        <details className="mt-6 border-t border-[var(--line)] pt-4">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.11em] text-[var(--clay)]">
            View all details
          </summary>
          <dl className="mt-5 space-y-4 text-sm leading-6">
            {weeklyPlan && (
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Weekly plan</dt>
                <dd className="mt-1">Week of {formatDate(weeklyPlan.weekStartDate)}{weeklyPlan.mainFocus ? ` · ${weeklyPlan.mainFocus}` : ""}</dd>
              </div>
            )}
            {item.hook && (
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Hook</dt>
                <dd className="mt-1 whitespace-pre-wrap">{item.hook}</dd>
              </div>
            )}
            {item.script && (
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Script</dt>
                <dd className="mt-1 whitespace-pre-wrap">{item.script}</dd>
              </div>
            )}
            {item.caption && (
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Caption</dt>
                <dd className="mt-1 whitespace-pre-wrap">{item.caption}</dd>
              </div>
            )}
            {item.cta && (
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">CTA</dt>
                <dd className="mt-1 whitespace-pre-wrap">{item.cta}</dd>
              </div>
            )}
            {item.notes && (
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Notes</dt>
                <dd className="mt-1 whitespace-pre-wrap text-[var(--muted)]">{item.notes}</dd>
              </div>
            )}
            {!weeklyPlan && !item.hook && !item.script && !item.caption && !item.cta && !item.notes && (
              <div>
                <dt className="sr-only">Details</dt>
                <dd className="text-[var(--muted)]">No extra details have been added yet.</dd>
              </div>
            )}
          </dl>
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
          disabled={isDeleting}
          className="inline-flex min-h-12 items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-red-800 transition-colors hover:bg-red-50 disabled:cursor-wait disabled:opacity-50"
        >
          <TrashIcon className="size-4" aria-hidden /> {isDeleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </article>
  );
}
