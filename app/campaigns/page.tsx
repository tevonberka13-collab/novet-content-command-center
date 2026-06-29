import { MegaphoneIcon } from "@heroicons/react/24/outline";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function CampaignsPage() {
  return <PlaceholderPage eyebrow="Keep the story connected" title="Campaigns" description="Group content around releases, live shows, the Novet brand, and life behind the scenes." icon={MegaphoneIcon} emptyTitle="Campaigns will turn scattered posts into a clear story." emptyDescription="The default campaign structure is defined and ready for CRUD in a later phase. No campaign data is connected yet." actionLabel="Browse the idea bank" actionHref="/ideas" />;
}
