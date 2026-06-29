import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

type OutlineIcon = ComponentType<SVGProps<SVGSVGElement>>;

export function EmptyState({
  icon: IconComponent,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: {
  icon: OutlineIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}) {
  return (
    <section className="mt-10 border-y border-[var(--line)] py-16 sm:py-20">
      <IconComponent className="size-8 text-[var(--clay)]" aria-hidden />
      <p className="eyebrow mt-6">Ready when you are</p>
      <h2 className="font-display mt-2 max-w-xl text-4xl font-semibold leading-tight">{title}</h2>
      <p className="mt-4 max-w-lg text-sm leading-6 text-[var(--muted)]">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-7 inline-flex min-h-11 items-center border border-[var(--clay)] px-5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--clay)] transition-colors hover:bg-[var(--clay)] hover:text-white focus-visible:outline-2"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <button
          type="button"
          onClick={onAction}
          className="mt-7 inline-flex min-h-11 items-center border border-[var(--clay)] px-5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--clay)] transition-colors hover:bg-[var(--clay)] hover:text-white focus-visible:outline-2"
        >
          {actionLabel}
        </button>
      )}
    </section>
  );
}
