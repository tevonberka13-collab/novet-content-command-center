"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDaysIcon,
  FilmIcon,
  PencilSquareIcon,
  PlusIcon,
  SparklesIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { PlannerContentItem } from "@/components/weekly-planner/planner-content-item";
import {
  WeeklyPlanForm,
  type WeeklyPlanFormValues,
} from "@/components/weekly-planner/weekly-plan-form";
import { preferredContentCreationDays, strongestContentCreationDays } from "@/lib/constants";
import {
  fetchWeeklyPlannerData,
  plannerContentItemColumns,
  weeklyPlanColumns,
} from "@/lib/supabase/weekly-planner";
import {
  type ContentItemRow,
  type WeeklyPlanRow,
  mapContentItem,
  mapWeeklyPlan,
} from "@/lib/supabase/content-items";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import type { ContentItem, WeeklyPlan } from "@/types";

type PlannerDay = {
  date: string;
  dayName: string;
  dayNumber: string;
  monthName: string;
  preferred: boolean;
  strongest: boolean;
};

function addUtcDays(value: string, amount: number) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(
    "en-US",
    options
      ? { ...options, timeZone: "UTC" }
      : { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" },
  ).format(new Date(`${value}T00:00:00Z`));
}

function daysForWeek(weekStart: string): PlannerDay[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = addUtcDays(weekStart, index);
    const parsed = new Date(`${date}T00:00:00Z`);
    const dayName = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      timeZone: "UTC",
    }).format(parsed);

    return {
      date,
      dayName,
      dayNumber: new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        timeZone: "UTC",
      }).format(parsed),
      monthName: new Intl.DateTimeFormat("en-US", {
        month: "short",
        timeZone: "UTC",
      }).format(parsed),
      preferred: preferredContentCreationDays.some((day) => day === dayName),
      strongest: strongestContentCreationDays.some((day) => day === dayName),
    };
  });
}

export function WeeklyPlanner() {
  const [plans, setPlans] = useState<WeeklyPlan[]>([]);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<WeeklyPlan | null>(null);
  const [ideaSearch, setIdeaSearch] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  async function loadData() {
    if (!isSupabaseConfigured) return;

    setIsLoading(true);
    setLoadError("");
    try {
      const data = await fetchWeeklyPlannerData();
      setPlans(data.plans);
      setItems(data.items);
      setSelectedPlanId((current) =>
        current && data.plans.some((plan) => plan.id === current)
          ? current
          : (data.plans[0]?.id ?? ""),
      );
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unknown Supabase error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    if (isSupabaseConfigured) {
      void fetchWeeklyPlannerData()
        .then((data) => {
          if (cancelled) return;
          setPlans(data.plans);
          setItems(data.items);
          setSelectedPlanId(data.plans[0]?.id ?? "");
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

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? null,
    [plans, selectedPlanId],
  );
  const assignedItems = useMemo(
    () => items.filter((item) => item.weeklyPlanId === selectedPlanId),
    [items, selectedPlanId],
  );
  const availableItems = useMemo(() => {
    const search = ideaSearch.trim().toLowerCase();
    return items.filter(
      (item) =>
        item.weeklyPlanId === null &&
        (!search ||
          item.title.toLowerCase().includes(search) ||
          item.contentType.replaceAll("_", " ").includes(search) ||
          item.platform.toLowerCase().includes(search)),
    );
  }, [items, ideaSearch]);
  const weekDays = useMemo(
    () => (selectedPlan ? daysForWeek(selectedPlan.weekStartDate) : []),
    [selectedPlan],
  );
  const weekEnd = selectedPlan ? addUtcDays(selectedPlan.weekStartDate, 6) : "";
  const unscheduledItems = assignedItems.filter(
    (item) =>
      !item.plannedPostDate ||
      item.plannedPostDate < (selectedPlan?.weekStartDate ?? "") ||
      item.plannedPostDate > weekEnd,
  );
  const filmingItems = assignedItems
    .filter(
      (item) =>
        item.filmingDate &&
        item.filmingDate >= (selectedPlan?.weekStartDate ?? "") &&
        item.filmingDate <= weekEnd,
    )
    .sort((a, b) => (a.filmingDate ?? "").localeCompare(b.filmingDate ?? ""));

  function openCreateForm() {
    setEditingPlan(null);
    setFormOpen(true);
    setMessage("");
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth" }));
  }

  function openEditForm() {
    if (!selectedPlan) return;
    setEditingPlan(selectedPlan);
    setFormOpen(true);
    setMessage("");
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth" }));
  }

  function closeForm() {
    setFormOpen(false);
    setEditingPlan(null);
  }

  async function savePlan(values: WeeklyPlanFormValues) {
    setIsSaving(true);
    setMessage("");
    const payload = {
      week_start_date: values.weekStartDate,
      main_focus: values.mainFocus,
      weekly_goal: values.weeklyGoal,
      notes: values.notes,
    };
    const supabase = getSupabaseBrowserClient();
    const result = editingPlan
      ? await supabase
          .from("weekly_plans")
          .update(payload)
          .eq("id", editingPlan.id)
          .select(weeklyPlanColumns)
          .single()
      : await supabase
          .from("weekly_plans")
          .insert(payload)
          .select(weeklyPlanColumns)
          .single();

    if (result.error) {
      const duplicateWeek = result.error.code === "23505";
      setMessage(
        duplicateWeek
          ? "A weekly plan already exists for that start date. Choose the existing week or use another date."
          : `Couldn’t save the weekly plan: ${result.error.message}`,
      );
      setIsSaving(false);
      return;
    }

    const savedPlan = mapWeeklyPlan(result.data as WeeklyPlanRow);
    setPlans((current) =>
      editingPlan
        ? current
            .map((plan) => (plan.id === savedPlan.id ? savedPlan : plan))
            .sort((a, b) => b.weekStartDate.localeCompare(a.weekStartDate))
        : [savedPlan, ...current].sort((a, b) =>
            b.weekStartDate.localeCompare(a.weekStartDate),
          ),
    );
    setSelectedPlanId(savedPlan.id);
    setMessage(editingPlan ? "Weekly plan updated." : "Weekly plan created.");
    setIsSaving(false);
    closeForm();
  }

  async function deletePlan() {
    if (!selectedPlan) return;
    const confirmed = window.confirm(
      `Delete the week of ${formatDate(selectedPlan.weekStartDate)}? Assigned content will return to the Idea Bank.`,
    );
    if (!confirmed) return;

    setDeletingPlanId(selectedPlan.id);
    setMessage("");
    const { error } = await getSupabaseBrowserClient()
      .from("weekly_plans")
      .delete()
      .eq("id", selectedPlan.id);

    if (error) {
      setMessage(`Couldn’t delete the weekly plan: ${error.message}`);
      setDeletingPlanId(null);
      return;
    }

    const remainingPlans = plans.filter((plan) => plan.id !== selectedPlan.id);
    setPlans(remainingPlans);
    setItems((current) =>
      current.map((item) =>
        item.weeklyPlanId === selectedPlan.id ? { ...item, weeklyPlanId: null } : item,
      ),
    );
    setSelectedPlanId(remainingPlans[0]?.id ?? "");
    setMessage("Weekly plan deleted. Its content is available to assign again.");
    setDeletingPlanId(null);
    closeForm();
  }

  async function updateContentItem(
    item: ContentItem,
    payload: Record<string, string | null>,
    successMessage: string,
  ) {
    setUpdatingItemId(item.id);
    setMessage("");
    const result = await getSupabaseBrowserClient()
      .from("content_items")
      .update(payload)
      .eq("id", item.id)
      .select(plannerContentItemColumns)
      .single();

    if (result.error) {
      setMessage(`Couldn’t update “${item.title}”: ${result.error.message}`);
      setUpdatingItemId(null);
      return;
    }

    const savedItem = mapContentItem(result.data as ContentItemRow);
    setItems((current) =>
      current.map((currentItem) => (currentItem.id === savedItem.id ? savedItem : currentItem)),
    );
    setMessage(successMessage);
    setUpdatingItemId(null);
  }

  function assignItem(item: ContentItem) {
    if (!selectedPlan) return;
    void updateContentItem(
      item,
      { weekly_plan_id: selectedPlan.id },
      `“${item.title}” added to this week.`,
    );
  }

  function unassignItem(item: ContentItem) {
    void updateContentItem(
      item,
      { weekly_plan_id: null },
      `“${item.title}” returned to the Idea Bank.`,
    );
  }

  function changeItemDate(
    item: ContentItem,
    field: "plannedPostDate" | "filmingDate",
    value: string,
  ) {
    const column = field === "plannedPostDate" ? "planned_post_date" : "filming_date";
    void updateContentItem(
      item,
      { [column]: value || null },
      value
        ? `${field === "plannedPostDate" ? "Post" : "Filming"} date saved for “${item.title}.”`
        : `${field === "plannedPostDate" ? "Post" : "Filming"} date cleared for “${item.title}.”`,
    );
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto w-full max-w-[90rem] px-5 py-8 sm:px-8 sm:py-10 xl:px-12">
        <PageHeader
          eyebrow="Plan the rhythm"
          title="Weekly Planner"
          description="Choose the week’s focus, map each post, and protect the best filming windows."
        />
        <section className="mt-10 border-l-4 border-[var(--clay)] bg-[var(--paper-deep)] p-6 sm:p-8">
          <p className="eyebrow">Supabase setup needed</p>
          <h2 className="font-display mt-2 text-3xl font-semibold">Connect Supabase to plan your week.</h2>
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
          eyebrow="Plan the rhythm"
          title="Weekly Planner"
          description="Choose the week’s focus, map each post, and protect the best filming windows."
          bordered={false}
        />
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-[var(--clay)] px-5 text-sm font-medium text-white transition-colors hover:bg-[var(--clay-dark)]"
        >
          <PlusIcon className="size-[1.1rem]" aria-hidden /> New week
        </button>
      </div>

      <div ref={formRef} className="scroll-mt-20">
        {formOpen && (
          <WeeklyPlanForm
            key={editingPlan?.id ?? "new-week"}
            plan={editingPlan}
            isSaving={isSaving}
            onCancel={closeForm}
            onSubmit={savePlan}
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
          <p className="font-semibold">The weekly planner couldn’t load.</p>
          <p className="mt-1">{loadError}</p>
          <button type="button" onClick={() => void loadData()} className="mt-4 underline underline-offset-4">
            Try again
          </button>
        </div>
      )}

      {!loadError && !isLoading && plans.length === 0 && !formOpen && (
        <EmptyState
          icon={CalendarDaysIcon}
          title="Your next week starts with one clear focus."
          description="Create a weekly plan, then pull in ideas and choose when to post and film each one."
          actionLabel="Create your first week"
          onAction={openCreateForm}
        />
      )}

      {!loadError && isLoading && (
        <div className="mt-10 grid gap-4 md:grid-cols-3" aria-label="Loading weekly planner">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-36 animate-pulse bg-[var(--paper-deep)]" />
          ))}
        </div>
      )}

      {!loadError && !isLoading && selectedPlan && (
        <>
          <section className="mt-8 border-y border-[var(--line)] py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <label className="block max-w-xl flex-1 text-xs font-semibold uppercase tracking-[0.11em]">
                Planning week
                <select
                  value={selectedPlanId}
                  onChange={(event) => setSelectedPlanId(event.target.value)}
                  className="mt-2 min-h-12 w-full border border-[var(--line)] bg-[var(--paper)] px-3 text-sm normal-case tracking-normal outline-none focus:border-[var(--clay)]"
                >
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      Week of {formatDate(plan.weekStartDate)} · {plan.mainFocus || "Untitled focus"}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={openEditForm}
                  className="inline-flex min-h-11 items-center justify-center gap-2 border border-[var(--line)] px-4 text-xs font-semibold uppercase tracking-[0.1em] transition-colors hover:border-[var(--clay)]"
                >
                  <PencilSquareIcon className="size-4" aria-hidden /> Edit week
                </button>
                <button
                  type="button"
                  onClick={() => void deletePlan()}
                  disabled={deletingPlanId === selectedPlan.id}
                  className="inline-flex min-h-11 items-center justify-center gap-2 border border-red-300 px-4 text-xs font-semibold uppercase tracking-[0.1em] text-red-800 transition-colors hover:bg-red-50 disabled:cursor-wait disabled:opacity-50"
                >
                  <TrashIcon className="size-4" aria-hidden />
                  {deletingPlanId === selectedPlan.id ? "Deleting…" : "Delete week"}
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Main focus</p>
                <p className="font-display mt-1 text-3xl font-semibold leading-tight">{selectedPlan.mainFocus}</p>
              </div>
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Weekly goal</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">{selectedPlan.weeklyGoal || "No goal added yet."}</p>
              </div>
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Notes</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">{selectedPlan.notes || "No notes added yet."}</p>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">Daily posting plan</p>
                <h2 className="font-display mt-2 text-4xl font-semibold">Shape the week, day by day</h2>
              </div>
              <p className="max-w-sm text-xs leading-5 text-[var(--muted)]">
                Clay-tinted days are preferred creation windows. Weekends are the strongest.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {weekDays.map((day) => {
                const dayItems = assignedItems.filter((item) => item.plannedPostDate === day.date);
                return (
                  <section
                    key={day.date}
                    className={`min-w-0 border p-4 ${
                      day.strongest
                        ? "border-[var(--clay)] bg-[var(--paper-deep)]"
                        : day.preferred
                          ? "border-[var(--line)] bg-[var(--paper-deep)]/55"
                          : "border-[var(--line)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-[var(--line)] pb-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em]">{day.dayName}</p>
                        <p className="font-display mt-1 text-3xl font-semibold leading-none">{day.monthName} {day.dayNumber}</p>
                      </div>
                      {day.preferred && (
                        <span className="inline-flex items-center gap-1 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-[var(--clay)]">
                          <SparklesIcon className="size-3.5" aria-hidden />
                          {day.strongest ? "Strongest" : "Preferred"}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 space-y-3">
                      {dayItems.map((item) => (
                        <PlannerContentItem
                          key={item.id}
                          item={item}
                          weekStart={selectedPlan.weekStartDate}
                          weekEnd={weekEnd}
                          isUpdating={updatingItemId === item.id}
                          onDateChange={changeItemDate}
                          onUnassign={unassignItem}
                        />
                      ))}
                      {dayItems.length === 0 && (
                        <p className="py-4 text-xs leading-5 text-[var(--muted)]">No post planned for this day.</p>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>

            {unscheduledItems.length > 0 && (
              <section className="mt-5 border border-dashed border-[var(--line)] p-5">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em]">Assigned, not scheduled this week</h3>
                <p className="mt-1 text-xs text-[var(--muted)]">Choose a date inside this week to place each item into the daily plan.</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {unscheduledItems.map((item) => (
                    <PlannerContentItem
                      key={item.id}
                      item={item}
                      weekStart={selectedPlan.weekStartDate}
                      weekEnd={weekEnd}
                      isUpdating={updatingItemId === item.id}
                      onDateChange={changeItemDate}
                      onUnassign={unassignItem}
                    />
                  ))}
                </div>
              </section>
            )}
          </section>

          <div className="mt-12 grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.65fr)]">
            <section>
              <p className="eyebrow">Content Idea Bank</p>
              <h2 className="font-display mt-2 text-4xl font-semibold">Assign content to this week</h2>
              <input
                type="search"
                value={ideaSearch}
                onChange={(event) => setIdeaSearch(event.target.value)}
                placeholder="Search available ideas"
                className="mt-5 min-h-11 w-full border border-[var(--line)] bg-[var(--paper)] px-3 text-sm outline-none placeholder:text-[var(--muted)]/60 focus:border-[var(--clay)]"
              />
              <div className="mt-4 space-y-3">
                {availableItems.map((item) => (
                  <article key={item.id} className="flex flex-col gap-4 border border-[var(--line)] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-[var(--clay)]">{item.platform} · {item.contentType.replaceAll("_", " ")}</p>
                      <h3 className="mt-1 text-sm font-semibold">{item.title}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => assignItem(item)}
                      disabled={updatingItemId === item.id}
                      className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border border-[var(--clay)] px-4 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--clay)] transition-colors hover:bg-[var(--clay)] hover:text-white disabled:cursor-wait disabled:opacity-50"
                    >
                      <PlusIcon className="size-4" aria-hidden />
                      {updatingItemId === item.id ? "Adding…" : "Add to week"}
                    </button>
                  </article>
                ))}
                {availableItems.length === 0 && (
                  <div className="border-y border-[var(--line)] py-8">
                    <p className="text-sm font-semibold">{ideaSearch ? "No available ideas match that search." : "Every idea is already assigned."}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Add more content in the Idea Bank or unassign an item from another week.</p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2">
                <FilmIcon className="size-5 text-[var(--clay)]" aria-hidden />
                <p className="eyebrow">Filming plan</p>
              </div>
              <h2 className="font-display mt-2 text-4xl font-semibold">What needs to be filmed</h2>
              <div className="mt-5 border-y border-[var(--line)]">
                {filmingItems.map((item) => (
                  <article key={item.id} className="flex items-start gap-4 border-b border-[var(--line)] py-4 last:border-b-0">
                    <div className="min-w-16 border-r border-[var(--line)] pr-4 text-center">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[var(--clay)]">{formatDate(item.filmingDate ?? selectedPlan.weekStartDate, { weekday: "short" })}</p>
                      <p className="font-display mt-1 text-2xl font-semibold">{formatDate(item.filmingDate ?? selectedPlan.weekStartDate, { month: "short", day: "numeric" })}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold leading-5">{item.title}</h3>
                      <p className="mt-1 text-xs text-[var(--muted)]">{item.platform} · {item.contentType.replaceAll("_", " ")}</p>
                    </div>
                  </article>
                ))}
                {filmingItems.length === 0 && (
                  <div className="py-10">
                    <FilmIcon className="size-6 text-[var(--clay)]" aria-hidden />
                    <p className="mt-4 text-sm font-semibold">No filming dates set for this week.</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Use the film date on any assigned item to build this list.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
