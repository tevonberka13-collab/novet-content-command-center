import { ViewColumnsIcon } from "@heroicons/react/24/outline";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function PipelinePage() {
  return <PlaceholderPage eyebrow="Know what moves next" title="Pipeline" description="Track each idea from raw thought to reviewed post with seven simple, dependable statuses." icon={ViewColumnsIcon} emptyTitle="A simple button-based pipeline comes before drag-and-drop." emptyDescription="The status model is already defined: idea, planned, filmed, edited, scheduled, posted, and reviewed." actionLabel="Return to dashboard" actionHref="/dashboard" />;
}
