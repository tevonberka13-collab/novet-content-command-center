# Database

The MVP database is a small Supabase/Postgres schema for planning content, moving it through the execution pipeline, and reviewing results. The Phase 4 app connects with the public Supabase URL and anon key; authentication and Row Level Security (RLS) are still intentionally deferred. The MVP does not include social integrations or automated analytics.

## Setup

Run the SQL files in this order in the Supabase SQL editor or with `psql`:

1. `db/schema.sql`
2. `db/seed.sql`

The schema uses the `pgcrypto` extension for `gen_random_uuid()`. Supabase supports this extension. The seed uses fixed UUIDs and `on conflict do nothing`, so it can be run more than once without duplicating its records.

After running the SQL, copy `.env.example` to `.env.local` and add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. See `README.md` for the complete app setup.

## Seed data

`db/seed.sql` adds the four default active campaigns:

- UMS July 24 Promotion
- New Music Rollout
- Novet Personal Brand
- Lifestyle / BTS

It also adds five content items in the `idea` status:

- Why UMS matters to me
- Post-wedding reset as an artist
- New song lyric breakdown
- Rehearsal clip: live version
- Day in the life: 9–5 to artist mode

The sample ideas are associated with a relevant default campaign. Their weekly plan and scheduling dates remain null so they begin as unplanned ideas.

## Tables

### `campaigns`

Groups content around an objective or promotion.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `name` | `text` | Required and unique |
| `description` | `text` | Defaults to an empty string |
| `goal` | `text` | Defaults to an empty string |
| `start_date` | `date` | Optional |
| `end_date` | `date` | Optional; cannot be before `start_date` |
| `status` | `text` | `active`, `paused`, or `completed` |
| `created_at` | `timestamptz` | Set automatically |
| `updated_at` | `timestamptz` | Set automatically on insert and update |

### `weekly_plans`

Stores the focus and goal for one planning week.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `week_start_date` | `date` | Required and unique |
| `main_focus` | `text` | Defaults to an empty string |
| `weekly_goal` | `text` | Defaults to an empty string |
| `notes` | `text` | Defaults to an empty string |
| `created_at` | `timestamptz` | Set automatically |
| `updated_at` | `timestamptz` | Set automatically on insert and update |

### `content_items`

Stores both unplanned ideas and content assigned to a week. `campaign_id` and `weekly_plan_id` are nullable so an idea can be captured before it is organized.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `title` | `text` | Required and cannot be blank |
| `campaign_id` | `uuid` | Optional FK to `campaigns.id`; becomes null if the campaign is deleted |
| `weekly_plan_id` | `uuid` | Optional FK to `weekly_plans.id`; becomes null if the plan is deleted |
| `content_type` | `text` | Expected values listed below |
| `platform` | `text` | `TikTok`, `Instagram`, `YouTube Shorts`, or `All` |
| `status` | `text` | Expected pipeline values listed below; defaults to `idea` |
| `planned_post_date` | `date` | Optional |
| `filming_date` | `date` | Optional |
| `hook` | `text` | Defaults to an empty string |
| `script` | `text` | Defaults to an empty string |
| `caption` | `text` | Defaults to an empty string |
| `cta` | `text` | Defaults to an empty string |
| `notes` | `text` | Defaults to an empty string |
| `created_at` | `timestamptz` | Set automatically |
| `updated_at` | `timestamptz` | Set automatically on insert and update |

Expected content types match `lib/constants.ts`:

- `performance`
- `behind_the_scenes`
- `lifestyle`
- `promo`
- `personal_brand`
- `educational`
- `lyric_breakdown`
- `rehearsal`
- `announcement`

Expected pipeline statuses match `lib/constants.ts`:

- `idea`
- `planned`
- `filmed`
- `edited`
- `scheduled`
- `posted`
- `reviewed`

### `weekly_reviews`

Stores the retrospective for a weekly plan. Each weekly plan can have one review.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `weekly_plan_id` | `uuid` | Required, unique FK to `weekly_plans.id`; cascades on plan deletion |
| `wins` | `text` | Defaults to an empty string |
| `lessons` | `text` | Defaults to an empty string |
| `next_actions` | `text` | Defaults to an empty string |
| `notes` | `text` | Defaults to an empty string |
| `created_at` | `timestamptz` | Set automatically |
| `updated_at` | `timestamptz` | Set automatically on insert and update |

### `content_metrics`

Stores one manually maintained aggregate metrics record for a content item.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `content_item_id` | `uuid` | Required, unique FK to `content_items.id`; cascades on content deletion |
| `views` | `integer` | Non-negative; defaults to `0` |
| `likes` | `integer` | Non-negative; defaults to `0` |
| `comments` | `integer` | Non-negative; defaults to `0` |
| `shares` | `integer` | Non-negative; defaults to `0` |
| `saves` | `integer` | Non-negative; defaults to `0` |
| `follows_gained` | `integer` | Non-negative; defaults to `0` |
| `notes` | `text` | Defaults to an empty string |
| `created_at` | `timestamptz` | Set automatically |
| `updated_at` | `timestamptz` | Set automatically on insert and update |

## Relationships

- A campaign can have many content items.
- A weekly plan can have many content items.
- A weekly plan can have one weekly review.
- A content item can have one aggregate metrics record.

Indexes support foreign-key joins and common pipeline-status and posting-date lookups used by the planned MVP screens.

## Naming and validation

Database columns use `snake_case`; the existing TypeScript types use `camelCase`. A later Supabase data-access layer should map between them.

Workflow fields use Postgres `text` columns rather than enum types so the schema remains straightforward. Check constraints keep their current MVP values aligned with the Phase 2 constants. If a value is added later, update both `lib/constants.ts` and the corresponding database check constraint.

RLS is not enabled in Phase 3. It should be designed alongside authentication after the main shell and CRUD flow are working.
