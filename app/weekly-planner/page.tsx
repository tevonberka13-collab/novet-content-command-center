import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function WeeklyPlannerPage() {
  return <PlaceholderPage eyebrow="Plan the rhythm" title="Weekly Planner" description="Choose the week’s focus, map each post, and protect the best filming windows." icon={CalendarDaysIcon} emptyTitle="Your next week starts with one clear focus." emptyDescription="Weekly planning arrives in the next build phase. For now, use the dashboard to see the structure this page will support." actionLabel="View dashboard" actionHref="/dashboard" />;
}
