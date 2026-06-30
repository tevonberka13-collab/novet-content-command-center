"use client";

import {
  CalendarDaysIcon,
  FilmIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";
import type { ContentItem } from "@/types";

const dateInputClass =
  "mt-2 min-h-10 w-full border border-[var(--line)] bg-[var(--paper)] px-2 text-xs outline-none focus:border-[var(--clay)]";

function humanize(value: string) {
  return value.replaceAll("_", " ");
}

export function PlannerContentItem({
  item,
  weekStart,
  weekEnd,
  isUpdating,
  onDateChange,
  onUnassign,
}: {
  item: ContentItem;
  weekStart: string;
  weekEnd: string;
  isUpdating: boolean;
  onDateChange: (
    item: ContentItem,
    field: "plannedPostDate" | "filmingDate",
    value: string,
  ) => void;
  onUnassign: (item: ContentItem) => void;
}) {
  return (
    <article className="border border-[var(--line)] bg-[var(--paper)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-[var(--clay)]">
            {item.platform} · {humanize(item.contentType)}
          </p>
          <h4 className="mt-1.5 text-sm font-semibold leading-5">{item.title}</h4>
        </div>
        <button
          type="button"
          onClick={() => onUnassign(item)}
          disabled={isUpdating}
          className="grid size-9 shrink-0 place-items-center text-[var(--muted)] transition-colors hover:text-red-800 disabled:cursor-wait disabled:opacity-40"
          aria-label={`Unassign ${item.title} from this week`}
          title="Unassign from week"
        >
          <MinusCircleIcon className="size-5" aria-hidden />
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <label className="text-[0.64rem] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDaysIcon className="size-3.5 text-[var(--clay)]" aria-hidden /> Post date
          </span>
          <input
            type="date"
            min={weekStart}
            max={weekEnd}
            value={item.plannedPostDate ?? ""}
            onChange={(event) => onDateChange(item, "plannedPostDate", event.target.value)}
            disabled={isUpdating}
            className={dateInputClass}
          />
        </label>
        <label className="text-[0.64rem] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
          <span className="inline-flex items-center gap-1.5">
            <FilmIcon className="size-3.5 text-[var(--clay)]" aria-hidden /> Film date
          </span>
          <input
            type="date"
            min={weekStart}
            max={weekEnd}
            value={item.filmingDate ?? ""}
            onChange={(event) => onDateChange(item, "filmingDate", event.target.value)}
            disabled={isUpdating}
            className={dateInputClass}
          />
        </label>
      </div>
    </article>
  );
}
