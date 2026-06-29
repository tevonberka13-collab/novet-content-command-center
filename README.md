# Novet Content Command Center

A private weekly content planning web app for the artist Novet. The app now includes a Supabase-backed Content Idea Bank for capturing and shaping weekly content.

## Stack

- Next.js with the App Router
- TypeScript
- Tailwind CSS
- Heroicons
- Supabase

Authentication is intentionally deferred until the main app shell and CRUD flows are working.

## Getting started

```bash
npm install
npm run dev
```

### Supabase setup

1. Create a Supabase project.
2. Run `db/schema.sql`, then `db/seed.sql`, in the Supabase SQL editor.
3. Copy the environment example:

```bash
cp .env.example .env.local
```

4. In Supabase, open **Project Settings → API** and add the project URL and anon key to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Start or restart the app:

```bash
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

The anon key is designed for browser use. This MVP does not add authentication or Row Level Security; do not use a service-role key in browser environment variables.

## Available routes

- `/dashboard`
- `/weekly-planner`
- `/campaigns`
- `/ideas`
- `/pipeline`
- `/review`
- `/settings`

## Commands

```bash
npm run dev
npm run lint
npm run build
```

## Current scope

The current phase includes the responsive app shell, MVP routes, database schema and seed data, and full Content Idea Bank CRUD with campaign, status, platform, and content-type filters. It does not include authentication, social integrations, auto-posting, analytics sync, or AI generation.

See [docs/product-plan.md](docs/product-plan.md) for product scope and [AGENTS.md](AGENTS.md) for development rules.
