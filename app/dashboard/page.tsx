import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  MegaphoneIcon,
  MusicalNoteIcon,
  PlusIcon,
  UserIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { defaultCampaigns, pipelineStatuses } from "@/lib/constants";

type WeekDay = {
  day: string;
  date: string;
  mode: string;
  active?: boolean;
  strong?: boolean;
};

const week: WeekDay[] = [
  { day: "Sun", date: "29", mode: "Plan" },
  { day: "Mon", date: "30", mode: "Plan" },
  { day: "Tue", date: "1", mode: "Plan" },
  { day: "Wed", date: "2", mode: "Create", active: true },
  { day: "Thu", date: "3", mode: "Create", active: true },
  { day: "Fri", date: "4", mode: "Create", active: true },
  { day: "Sat", date: "5", mode: "Focus", active: true, strong: true },
];

const filmingTasks = [
  ["Wed, Jul 2", "Studio session", "B-roll + performance clip", "2:00–4:00 PM"],
  ["Fri, Jul 4", "Promo content", "Short-form reels + photos", "12:00–2:00 PM"],
  ["Sat, Jul 5", "Content day", "Deep creation + assets", "11:00 AM–4:00 PM"],
];

const counts = [2, 4, 3, 2, 1, 0, 1];
const campaignIcons = [MegaphoneIcon, MusicalNoteIcon, UserIcon, VideoCameraIcon];

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[90rem] px-5 py-8 sm:px-8 sm:py-10 xl:px-12">
      <header className="flex flex-col gap-5 border-b border-[var(--line)] pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em]">Current week</p>
          <h1 className="font-display mt-2 text-5xl font-semibold leading-none tracking-[-0.04em] sm:text-7xl">
            June 29–July 5
          </h1>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Week 27 <span className="mx-2 text-[var(--clay)]">•</span> 2025
          </p>
        </div>
        <Link
          href="/ideas"
          className="inline-flex min-h-12 items-center justify-center gap-2 bg-[var(--clay)] px-5 text-sm font-medium text-white transition-colors hover:bg-[var(--clay-dark)] focus-visible:outline-2"
        >
          <PlusIcon className="size-[1.1rem]" aria-hidden />
          Quick add idea
        </Link>
      </header>

      <section className="grid gap-8 border-b border-[var(--line)] py-8 xl:grid-cols-[1fr_1.35fr] xl:items-end">
        <div>
          <p className="eyebrow">Main focus</p>
          <h2 className="font-display mt-2 text-5xl font-semibold leading-none tracking-[-0.04em] sm:text-6xl">
            New music rollout
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted)]">
            Build momentum for the release, tease the record, and connect the story across every touchpoint.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4">Weekly creation plan</p>
          <div className="grid grid-cols-7 gap-px border border-[var(--line)] bg-[var(--line)]">
            {week.map((item) => (
              <div
                key={item.day}
                className={`min-h-24 bg-[var(--paper)] px-1.5 py-3 text-center sm:p-3 ${item.strong ? "bg-[#f2ded3]" : ""}`}
              >
                <p className="text-[0.63rem] font-semibold uppercase tracking-[0.12em]">{item.day}</p>
                <p className={`mt-1 text-xl font-semibold ${item.active ? "text-[var(--clay)]" : ""}`}>{item.date}</p>
                <p className={`mt-2 text-[0.68rem] ${item.active ? "font-medium text-[var(--clay)]" : "text-[var(--muted)]"}`}>
                  {item.mode}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 border-l-2 border-[var(--clay)] pl-3 text-xs text-[var(--muted)]">
            Creation days: <strong className="text-[var(--ink)]">Wed–Sun</strong> · Priority: <strong className="text-[var(--ink)]">weekends</strong>
          </p>
        </div>
      </section>

      <section className="grid border-b border-[var(--line)] lg:grid-cols-[1.05fr_0.95fr_0.95fr]">
        <article className="border-b border-[var(--line)] py-8 lg:border-b-0 lg:border-r lg:pr-8">
          <p className="eyebrow">Today&apos;s planned post</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-[10rem_1fr]">
            <Image
              src="/images/novet-release-tease.png"
              alt="Artist wearing a New Music Coming Soon jacket"
              width={800}
              height={1000}
              priority
              className="aspect-[4/5] w-full object-cover object-center"
            />
            <div className="flex flex-col justify-center">
              <h3 className="font-display text-3xl font-semibold leading-tight">Studio clip + caption tease</h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                Video · Reel / IG / TikTok
              </p>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                A raw studio moment. No lyrics—just the feeling and a hint of what is next.
              </p>
              <p className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--clay)]">
                <CalendarDaysIcon className="size-[1.05rem]" aria-hidden /> Wed, Jul 2
              </p>
              <Link href="/pipeline" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--clay)] hover:underline">
                In the pipeline <ArrowRightIcon className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </article>

        <article className="border-b border-[var(--line)] py-8 lg:border-b-0 lg:border-r lg:px-8">
          <p className="eyebrow">Active campaigns</p>
          <ul className="mt-5 divide-y divide-[var(--line)]">
            {defaultCampaigns.map((campaign, index) => {
              const CampaignIcon = campaignIcons[index];
              return (
              <li key={campaign} className="flex items-start gap-3 py-3 first:pt-0">
                <CampaignIcon className="mt-0.5 size-5 shrink-0 text-[var(--clay)]" aria-hidden />
                <div>
                  <p className="text-sm font-medium">{campaign}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {index === 0 ? "Build hype for the UMS performance" : index === 1 ? "Tease, announce, release, sustain" : index === 2 ? "Artist story, values, voice" : "Behind the scenes, real moments"}
                  </p>
                </div>
              </li>
              );
            })}
          </ul>
        </article>

        <article className="py-8 lg:pl-8">
          <p className="eyebrow">Upcoming filming schedule</p>
          <ul className="mt-5 divide-y divide-[var(--line)]">
            {filmingTasks.map(([date, title, detail, time]) => (
              <li key={title} className="grid grid-cols-[5rem_1fr] gap-4 py-3 first:pt-0">
                <p className="text-xs font-semibold uppercase leading-5 tracking-[0.08em]">{date}</p>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{detail}<br />{time}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="py-8">
        <p className="eyebrow">Pipeline overview</p>
        <div className="mt-5 grid grid-cols-2 gap-px border-y border-[var(--line)] bg-[var(--line)] sm:grid-cols-4 xl:grid-cols-7">
          {pipelineStatuses.map((status, index) => (
            <div key={status} className="bg-[var(--paper)] px-4 py-5 text-center">
              <p className="font-display text-4xl font-semibold text-[var(--clay)]">{counts[index]}</p>
              <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em]">{status}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
