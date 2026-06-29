-- Novet Content Command Center MVP schema
-- Run this file before db/seed.sql.

begin;

create extension if not exists pgcrypto;

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(trim(name)) > 0),
  description text not null default '',
  goal text not null default '',
  start_date date,
  end_date date,
  status text not null default 'active'
    check (status in ('active', 'paused', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date)
);

create table if not exists public.weekly_plans (
  id uuid primary key default gen_random_uuid(),
  week_start_date date not null unique,
  main_focus text not null default '',
  weekly_goal text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  campaign_id uuid references public.campaigns(id) on delete set null,
  weekly_plan_id uuid references public.weekly_plans(id) on delete set null,
  content_type text not null
    check (
      content_type in (
        'performance',
        'behind_the_scenes',
        'lifestyle',
        'promo',
        'personal_brand',
        'educational',
        'lyric_breakdown',
        'rehearsal',
        'announcement'
      )
    ),
  platform text not null default 'All'
    check (platform in ('TikTok', 'Instagram', 'YouTube Shorts', 'All')),
  status text not null default 'idea'
    check (
      status in (
        'idea',
        'planned',
        'filmed',
        'edited',
        'scheduled',
        'posted',
        'reviewed'
      )
    ),
  planned_post_date date,
  filming_date date,
  hook text not null default '',
  script text not null default '',
  caption text not null default '',
  cta text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  weekly_plan_id uuid not null unique
    references public.weekly_plans(id) on delete cascade,
  wins text not null default '',
  lessons text not null default '',
  next_actions text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_metrics (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null unique
    references public.content_items(id) on delete cascade,
  views integer not null default 0 check (views >= 0),
  likes integer not null default 0 check (likes >= 0),
  comments integer not null default 0 check (comments >= 0),
  shares integer not null default 0 check (shares >= 0),
  saves integer not null default 0 check (saves >= 0),
  follows_gained integer not null default 0 check (follows_gained >= 0),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_items_campaign_id_idx
  on public.content_items(campaign_id);

create index if not exists content_items_weekly_plan_id_idx
  on public.content_items(weekly_plan_id);

create index if not exists content_items_status_idx
  on public.content_items(status);

create index if not exists content_items_planned_post_date_idx
  on public.content_items(planned_post_date);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists campaigns_set_updated_at on public.campaigns;
create trigger campaigns_set_updated_at
before update on public.campaigns
for each row execute function public.set_updated_at();

drop trigger if exists weekly_plans_set_updated_at on public.weekly_plans;
create trigger weekly_plans_set_updated_at
before update on public.weekly_plans
for each row execute function public.set_updated_at();

drop trigger if exists content_items_set_updated_at on public.content_items;
create trigger content_items_set_updated_at
before update on public.content_items
for each row execute function public.set_updated_at();

drop trigger if exists weekly_reviews_set_updated_at on public.weekly_reviews;
create trigger weekly_reviews_set_updated_at
before update on public.weekly_reviews
for each row execute function public.set_updated_at();

drop trigger if exists content_metrics_set_updated_at on public.content_metrics;
create trigger content_metrics_set_updated_at
before update on public.content_metrics
for each row execute function public.set_updated_at();

commit;
