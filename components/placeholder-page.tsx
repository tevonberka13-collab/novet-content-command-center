import type { ComponentType, SVGProps } from "react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  icon,
  emptyTitle,
  emptyDescription,
  actionLabel,
  actionHref,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  emptyTitle: string;
  emptyDescription: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-[90rem] px-5 py-8 sm:px-8 sm:py-12 xl:px-12">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <EmptyState
        icon={icon}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={actionLabel}
        actionHref={actionHref}
      />
    </div>
  );
}
