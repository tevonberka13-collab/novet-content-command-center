"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { navigation } from "@/lib/navigation";

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="border-b border-white/15 px-7 pb-7 pt-8">
        <Link href="/dashboard" onNavigate={onNavigate} className="block rounded-sm focus-visible:outline-2">
          <span className="font-display block text-[2.25rem] font-semibold leading-none tracking-[0.08em] text-[#d65b30]">
            NOVET
          </span>
          <span className="mt-3 block text-[0.66rem] font-medium uppercase leading-relaxed tracking-[0.26em] text-[#f6f0e5]">
            Content<br />Command Center
          </span>
        </Link>
      </div>

      <nav aria-label="Primary navigation" className="flex-1 py-5">
        {navigation.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onNavigate={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-h-14 items-center gap-4 px-7 text-sm transition-colors focus-visible:outline-2 ${
                active
                  ? "bg-[#d65b30]/10 text-[#e2663a]"
                  : "text-[#e5dbcf] hover:bg-white/5 hover:text-white"
              }`}
            >
              {active && <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-[#d65b30]" />}
              <Icon className="size-[1.3rem]" aria-hidden />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/15 p-5">
        <Link
          href="/ideas"
          onNavigate={onNavigate}
          className="flex min-h-12 items-center justify-center gap-2 border border-[#d65b30] px-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#f47a4f] transition-colors hover:bg-[#d65b30] hover:text-white focus-visible:outline-2"
        >
          <PlusIcon className="size-[1.05rem]" aria-hidden />
          Quick add idea
        </Link>
      </div>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col bg-[var(--espresso)] lg:flex">
        <SidebarContent />
      </aside>

      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--line)] bg-[var(--paper)]/95 px-5 backdrop-blur lg:hidden">
        <Link href="/dashboard" className="font-display text-2xl font-semibold tracking-[0.08em] text-[var(--clay)]">
          NOVET
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label="Open navigation"
          className="grid size-11 place-items-center border border-[var(--line)] text-[var(--ink)]"
        >
          <Bars3Icon className="size-6" aria-hidden />
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          />
          <aside id="mobile-navigation" className="absolute inset-y-0 left-0 flex w-[min(84vw,20rem)] flex-col bg-[var(--espresso)] shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-3 z-10 grid size-11 place-items-center text-white"
            >
              <XMarkIcon className="size-6" aria-hidden />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <main className="min-h-screen lg:pl-60">{children}</main>
    </div>
  );
}
