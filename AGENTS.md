# AGENTS.md

## Project

Novet Content Command Center

## Purpose

This is a private content planning web app for the artist Novet.

The app helps Novet plan, organize, execute, and review weekly content around:

- New music releases
- UMS show promotion
- Personal brand building
- Lifestyle and behind-the-scenes content
- Repeatable weekly content workflows

## Primary Goal

Build a simple, usable weekly content planning system.

Do not overbuild.

## Product Principles

- Prioritize speed, clarity, and weekly usability.
- Keep the UI clean and dashboard-like.
- Build simple CRUD before advanced automation.
- Manual workflows are acceptable for MVP.
- Avoid unnecessary abstractions.
- Avoid complex state management unless needed.
- Avoid third-party APIs unless explicitly requested.
- Do not add AI generation features in version 1.
- Prefer small, reviewable changes.
- Make the app feel useful every week.

## Tech Stack

Use:

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- GitHub

## Core Modules

The MVP includes:

1. Dashboard
2. Weekly Planner
3. Campaigns
4. Content Idea Bank
5. Scripts & Captions
6. Content Status Pipeline
7. Weekly Review

## Routes

Create routes for:

- `/dashboard`
- `/weekly-planner`
- `/campaigns`
- `/ideas`
- `/pipeline`
- `/review`
- `/settings`

## Pipeline Statuses

Use these statuses:

- idea
- planned
- filmed
- edited
- scheduled
- posted
- reviewed

Do not add extra statuses unless explicitly requested.

## Default Campaigns

Seed these default campaigns:

- UMS July 24 Promotion
- New Music Rollout
- Novet Personal Brand
- Lifestyle / BTS

## Preferred Content Creation Days

Highlight these days in planning views:

- Wednesday
- Thursday
- Friday
- Saturday
- Sunday

Weekends should be treated as the strongest creation days.

## Development Rules

- Every page should have a useful empty state.
- Every form should have basic validation.
- Every major entity should have a TypeScript type.
- Keep components small and readable.
- Use clear names.
- Keep styling clean and minimal.
- Do not build drag-and-drop until a simple button-based pipeline works.
- Do not add authentication until the main app shell and CRUD flow are working.
- Do not integrate TikTok, Instagram, or YouTube APIs in MVP.
- Do not build auto-posting in MVP.
- Do not add analytics syncing in MVP.
- Manual metric entry is enough.

## UI Direction

The interface should feel like a private artist command center.

Style direction:

- Clean
- Focused
- Modern
- Minimal
- Dashboard-like
- Slightly bold
- Easy to scan

Avoid clutter.

## MVP Definition of Done

The MVP is done when Novet can:

1. Create a weekly plan.
2. Add active campaigns.
3. Add content ideas.
4. Assign content to posting days.
5. Add hooks, scripts, captions, and CTAs.
6. Move content through the pipeline.
7. Review the week.
8. Add manual performance metrics.
9. Decide what to do next week.

## Important Reminder

This app should help Novet execute consistently.

Do not turn this into a complex social media management platform.
