import {
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  HomeIcon,
  LightBulbIcon,
  MegaphoneIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";

export const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { label: "Weekly Planner", href: "/weekly-planner", icon: CalendarDaysIcon },
  { label: "Campaigns", href: "/campaigns", icon: MegaphoneIcon },
  { label: "Idea Bank", href: "/ideas", icon: LightBulbIcon },
  { label: "Pipeline", href: "/pipeline", icon: ViewColumnsIcon },
  { label: "Weekly Review", href: "/review", icon: ClipboardDocumentCheckIcon },
  { label: "Settings", href: "/settings", icon: Cog6ToothIcon },
] as const;
