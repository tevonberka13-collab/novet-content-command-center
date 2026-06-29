import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { PlaceholderPage } from "@/components/placeholder-page";

export default function SettingsPage() {
  return <PlaceholderPage eyebrow="Keep the system yours" title="Settings" description="The future home for lightweight preferences that make weekly planning feel natural." icon={Cog6ToothIcon} emptyTitle="No setup required yet." emptyDescription="Authentication, integrations, and account settings are outside this scaffold. The app is ready to extend when the core workflow is proven." actionLabel="Return to dashboard" actionHref="/dashboard" />;
}
