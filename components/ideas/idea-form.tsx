"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { contentTypes, pipelineStatuses, platforms } from "@/lib/constants";
import type {
  Campaign,
  ContentItem,
  ContentType,
  PipelineStatus,
  Platform,
  WeeklyPlan,
} from "@/types";

export type IdeaFormValues = {
  title: string;
  campaignId: string;
  weeklyPlanId: string;
  contentType: ContentType;
  platform: Platform;
  status: PipelineStatus;
  plannedPostDate: string;
  filmingDate: string;
  hook: string;
  script: string;
  caption: string;
  cta: string;
  notes: string;
};

const emptyValues: IdeaFormValues = {
  title: "",
  campaignId: "",
  weeklyPlanId: "",
  contentType: "performance",
  platform: "All",
  status: "idea",
  plannedPostDate: "",
  filmingDate: "",
  hook: "",
  script: "",
  caption: "",
  cta: "",
  notes: "",
};

function valuesForItem(item: ContentItem | null): IdeaFormValues {
  if (!item) return emptyValues;

  return {
    title: item.title,
    campaignId: item.campaignId ?? "",
    weeklyPlanId: item.weeklyPlanId ?? "",
    contentType: item.contentType,
    platform: item.platform,
    status: item.status,
    plannedPostDate: item.plannedPostDate ?? "",
    filmingDate: item.filmingDate ?? "",
    hook: item.hook,
    script: item.script,
    caption: item.caption,
    cta: item.cta,
    notes: item.notes,
  };
}

function humanize(value: string) {
  return value.replaceAll("_", " ");
}

const inputClass =
  "mt-2 min-h-11 w-full border border-[var(--line)] bg-[var(--paper)] px-3 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)]/60 focus:border-[var(--clay)]";
const labelClass = "text-xs font-semibold uppercase tracking-[0.11em]";

export function IdeaForm({
  campaigns,
  weeklyPlans,
  item,
  isSaving,
  onCancel,
  onSubmit,
}: {
  campaigns: Campaign[];
  weeklyPlans: WeeklyPlan[];
  item: ContentItem | null;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (values: IdeaFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<IdeaFormValues>(() => valuesForItem(item));
  const [validationError, setValidationError] = useState("");

  function update<Field extends keyof IdeaFormValues>(
    field: Field,
    value: IdeaFormValues[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!values.title.trim()) {
      setValidationError("Add a title before saving this idea.");
      return;
    }

    if (values.title.trim().length > 160) {
      setValidationError("Keep the title to 160 characters or fewer.");
      return;
    }

    setValidationError("");
    await onSubmit({ ...values, title: values.title.trim() });
  }

  return (
    <section className="border-b border-[var(--line)] bg-[var(--paper-deep)]/55 py-7 sm:py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{item ? "Edit idea" : "New idea"}</p>
          <h2 className="font-display mt-2 text-4xl font-semibold leading-none">
            {item ? "Shape the next draft" : "Capture it while it’s fresh"}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="grid size-11 shrink-0 place-items-center border border-[var(--line)] transition-colors hover:border-[var(--clay)] hover:text-[var(--clay)]"
          aria-label="Close idea form"
        >
          <XMarkIcon className="size-5" aria-hidden />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-7 space-y-7" noValidate>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <label className={`md:col-span-2 ${labelClass}`}>
            Title <span className="text-[var(--clay)]">*</span>
            <input
              autoFocus
              required
              maxLength={160}
              value={values.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="What’s the content idea?"
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Campaign
            <select
              value={values.campaignId}
              onChange={(event) => update("campaignId", event.target.value)}
              className={inputClass}
            >
              <option value="">No campaign</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Weekly plan
            <select
              value={values.weeklyPlanId}
              onChange={(event) => update("weeklyPlanId", event.target.value)}
              className={inputClass}
            >
              <option value="">Not assigned</option>
              {weeklyPlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  Week of {plan.weekStartDate}{plan.mainFocus ? ` · ${plan.mainFocus}` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Content type
            <select
              value={values.contentType}
              onChange={(event) => update("contentType", event.target.value as ContentType)}
              className={inputClass}
            >
              {contentTypes.map((type) => (
                <option key={type} value={type}>
                  {humanize(type)}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Platform
            <select
              value={values.platform}
              onChange={(event) => update("platform", event.target.value as Platform)}
              className={inputClass}
            >
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Status
            <select
              value={values.status}
              onChange={(event) => update("status", event.target.value as PipelineStatus)}
              className={inputClass}
            >
              {pipelineStatuses.map((status) => (
                <option key={status} value={status}>
                  {humanize(status)}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Planned post date
            <input
              type="date"
              value={values.plannedPostDate}
              onChange={(event) => update("plannedPostDate", event.target.value)}
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Filming date
            <input
              type="date"
              value={values.filmingDate}
              onChange={(event) => update("filmingDate", event.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <label className={labelClass}>
            Hook
            <textarea
              rows={3}
              value={values.hook}
              onChange={(event) => update("hook", event.target.value)}
              placeholder="The first line or opening beat"
              className={`${inputClass} resize-y py-3 normal-case leading-6 tracking-normal`}
            />
          </label>
          <label className={labelClass}>
            CTA
            <textarea
              rows={3}
              value={values.cta}
              onChange={(event) => update("cta", event.target.value)}
              placeholder="What should someone do next?"
              className={`${inputClass} resize-y py-3 normal-case leading-6 tracking-normal`}
            />
          </label>
          <label className={labelClass}>
            Script
            <textarea
              rows={5}
              value={values.script}
              onChange={(event) => update("script", event.target.value)}
              placeholder="Talking points or full script"
              className={`${inputClass} resize-y py-3 normal-case leading-6 tracking-normal`}
            />
          </label>
          <label className={labelClass}>
            Caption
            <textarea
              rows={5}
              value={values.caption}
              onChange={(event) => update("caption", event.target.value)}
              placeholder="Draft the post caption"
              className={`${inputClass} resize-y py-3 normal-case leading-6 tracking-normal`}
            />
          </label>
          <label className={`lg:col-span-2 ${labelClass}`}>
            Notes
            <textarea
              rows={3}
              value={values.notes}
              onChange={(event) => update("notes", event.target.value)}
              placeholder="Shot list, references, reminders, or anything else"
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
            {isSaving ? "Saving…" : item ? "Save changes" : "Add idea"}
          </button>
        </div>
      </form>
    </section>
  );
}
