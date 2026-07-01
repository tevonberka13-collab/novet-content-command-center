"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { campaignStatuses } from "@/lib/constants";
import type { Campaign, CampaignStatus } from "@/types";

export type CampaignFormValues = {
  name: string;
  description: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
};

const emptyValues: CampaignFormValues = {
  name: "",
  description: "",
  goal: "",
  startDate: "",
  endDate: "",
  status: "active",
};

function valuesForCampaign(campaign: Campaign | null): CampaignFormValues {
  if (!campaign) return emptyValues;

  return {
    name: campaign.name,
    description: campaign.description,
    goal: campaign.goal,
    startDate: campaign.startDate ?? "",
    endDate: campaign.endDate ?? "",
    status: campaign.status,
  };
}

function humanize(value: string) {
  return value.replaceAll("_", " ");
}

const inputClass =
  "mt-2 min-h-11 w-full border border-[var(--line)] bg-[var(--paper)] px-3 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)]/60 focus:border-[var(--clay)]";
const labelClass = "text-xs font-semibold uppercase tracking-[0.11em]";

export function CampaignForm({
  campaign,
  isSaving,
  onCancel,
  onSubmit,
}: {
  campaign: Campaign | null;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (values: CampaignFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<CampaignFormValues>(() =>
    valuesForCampaign(campaign),
  );
  const [validationError, setValidationError] = useState("");

  function update<Field extends keyof CampaignFormValues>(
    field: Field,
    value: CampaignFormValues[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = values.name.trim();
    if (!name) {
      setValidationError("Add a campaign name before saving.");
      return;
    }

    if (name.length > 120) {
      setValidationError("Keep the campaign name to 120 characters or fewer.");
      return;
    }

    if (values.startDate && values.endDate && values.endDate < values.startDate) {
      setValidationError("The end date can’t be before the start date.");
      return;
    }

    setValidationError("");
    await onSubmit({
      ...values,
      name,
      description: values.description.trim(),
      goal: values.goal.trim(),
    });
  }

  return (
    <section className="border-b border-[var(--line)] bg-[var(--paper-deep)]/55 py-7 sm:py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{campaign ? "Edit campaign" : "New campaign"}</p>
          <h2 className="font-display mt-2 text-4xl font-semibold leading-none">
            {campaign ? "Refine the campaign" : "Give the work a clear purpose"}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="grid size-11 shrink-0 place-items-center border border-[var(--line)] transition-colors hover:border-[var(--clay)] hover:text-[var(--clay)]"
          aria-label="Close campaign form"
        >
          <XMarkIcon className="size-5" aria-hidden />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-7 space-y-6" noValidate>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <label className={`md:col-span-2 ${labelClass}`}>
            Name <span className="text-[var(--clay)]">*</span>
            <input
              autoFocus
              required
              maxLength={120}
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="New music rollout"
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Status
            <select
              value={values.status}
              onChange={(event) =>
                update("status", event.target.value as CampaignStatus)
              }
              className={inputClass}
            >
              {campaignStatuses.map((status) => (
                <option key={status} value={status}>
                  {humanize(status)}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Start date
            <input
              type="date"
              value={values.startDate}
              onChange={(event) => update("startDate", event.target.value)}
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            End date
            <input
              type="date"
              min={values.startDate || undefined}
              value={values.endDate}
              onChange={(event) => update("endDate", event.target.value)}
              className={inputClass}
            />
          </label>

          <label className={`md:col-span-2 xl:col-span-3 ${labelClass}`}>
            Goal
            <input
              value={values.goal}
              onChange={(event) => update("goal", event.target.value)}
              placeholder="What should this campaign accomplish?"
              className={inputClass}
            />
          </label>

          <label className={`md:col-span-2 xl:col-span-4 ${labelClass}`}>
            Description
            <textarea
              rows={4}
              value={values.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="Add the context that will keep this campaign focused."
              className={`${inputClass} resize-y py-3`}
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
            className="min-h-11 border border-[var(--line)] px-5 text-xs font-semibold uppercase tracking-[0.11em] transition-colors hover:border-[var(--ink)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="min-h-11 bg-[var(--clay)] px-5 text-xs font-semibold uppercase tracking-[0.11em] text-white transition-colors hover:bg-[var(--clay-dark)] disabled:cursor-wait disabled:opacity-60"
          >
            {isSaving ? "Saving…" : campaign ? "Save changes" : "Create campaign"}
          </button>
        </div>
      </form>
    </section>
  );
}
