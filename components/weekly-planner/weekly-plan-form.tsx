"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { WeeklyPlan } from "@/types";

export type WeeklyPlanFormValues = {
  weekStartDate: string;
  mainFocus: string;
  weeklyGoal: string;
  notes: string;
};

function valuesForPlan(plan: WeeklyPlan | null): WeeklyPlanFormValues {
  return {
    weekStartDate: plan?.weekStartDate ?? "",
    mainFocus: plan?.mainFocus ?? "",
    weeklyGoal: plan?.weeklyGoal ?? "",
    notes: plan?.notes ?? "",
  };
}

const inputClass =
  "mt-2 min-h-11 w-full border border-[var(--line)] bg-[var(--paper)] px-3 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)]/60 focus:border-[var(--clay)]";
const labelClass = "text-xs font-semibold uppercase tracking-[0.11em]";

export function WeeklyPlanForm({
  plan,
  isSaving,
  onCancel,
  onSubmit,
}: {
  plan: WeeklyPlan | null;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (values: WeeklyPlanFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState(() => valuesForPlan(plan));
  const [validationError, setValidationError] = useState("");

  function update<Field extends keyof WeeklyPlanFormValues>(
    field: Field,
    value: WeeklyPlanFormValues[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!values.weekStartDate) {
      setValidationError("Choose a start date for this week.");
      return;
    }

    if (!values.mainFocus.trim()) {
      setValidationError("Add a main focus so the week has a clear direction.");
      return;
    }

    if (values.mainFocus.trim().length > 160) {
      setValidationError("Keep the main focus to 160 characters or fewer.");
      return;
    }

    setValidationError("");
    await onSubmit({
      weekStartDate: values.weekStartDate,
      mainFocus: values.mainFocus.trim(),
      weeklyGoal: values.weeklyGoal.trim(),
      notes: values.notes.trim(),
    });
  }

  return (
    <section className="border-b border-[var(--line)] bg-[var(--paper-deep)]/55 py-7 sm:py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{plan ? "Edit weekly plan" : "New weekly plan"}</p>
          <h2 className="font-display mt-2 text-4xl font-semibold leading-none">
            {plan ? "Refine the week" : "Set the week’s direction"}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="grid size-11 shrink-0 place-items-center border border-[var(--line)] transition-colors hover:border-[var(--clay)] hover:text-[var(--clay)]"
          aria-label="Close weekly plan form"
        >
          <XMarkIcon className="size-5" aria-hidden />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-7 space-y-6" noValidate>
        <div className="grid gap-5 lg:grid-cols-2">
          <label className={labelClass}>
            Week start date <span className="text-[var(--clay)]">*</span>
            <input
              type="date"
              required
              value={values.weekStartDate}
              onChange={(event) => update("weekStartDate", event.target.value)}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Main focus <span className="text-[var(--clay)]">*</span>
            <input
              autoFocus
              required
              maxLength={160}
              value={values.mainFocus}
              onChange={(event) => update("mainFocus", event.target.value)}
              placeholder="What matters most this week?"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Weekly goal
            <textarea
              rows={3}
              value={values.weeklyGoal}
              onChange={(event) => update("weeklyGoal", event.target.value)}
              placeholder="What does a successful week look like?"
              className={`${inputClass} resize-y py-3 normal-case leading-6 tracking-normal`}
            />
          </label>
          <label className={labelClass}>
            Notes
            <textarea
              rows={3}
              value={values.notes}
              onChange={(event) => update("notes", event.target.value)}
              placeholder="Deadlines, reminders, or context for the week"
              className={`${inputClass} resize-y py-3 normal-case leading-6 tracking-normal`}
            />
          </label>
        </div>

        {validationError && (
          <p role="alert" className="border-l-2 border-red-700 pl-3 text-sm text-red-800">
            {validationError}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 border border-[var(--line)] px-5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:border-[var(--ink)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="min-h-11 bg-[var(--clay)] px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[var(--clay-dark)] disabled:cursor-wait disabled:opacity-60"
          >
            {isSaving ? "Saving…" : plan ? "Save changes" : "Create week"}
          </button>
        </div>
      </form>
    </section>
  );
}
