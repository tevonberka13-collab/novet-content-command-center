import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function ReviewPage() {
  return <PlaceholderPage eyebrow="Learn the weekly lesson" title="Weekly Review" description="Record the wins, notice what worked, and choose the next action while the week is still fresh." icon={ClipboardDocumentCheckIcon} emptyTitle="Every useful week should leave a useful lesson." emptyDescription="Reviews and manual metrics are planned for a later phase. This page will remain intentionally quiet until then." actionLabel="Plan the next week" actionHref="/weekly-planner" />;
}
