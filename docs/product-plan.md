# Novet Content Command Center — Product Plan

## Product Summary

**Novet Content Command Center** is a private web app for Novet to plan, organize, execute, and review weekly content.

The app exists to help Novet stay consistent with content creation around:

* New music releases
* UMS show promotion, especially the July 24 UMS show
* Personal brand building
* Lifestyle and behind-the-scenes content
* Post-wedding / mini-break consistency
* Repeatable weekly content workflows

This is not meant to be a public platform, social media scheduler, or complex marketing system. The first version should be simple, private, and useful every week.

## Core Weekly Questions

The app should help answer:

1. What am I promoting this week?
2. What content do I need to film?
3. What should I post today?
4. What captions, hooks, scripts, and CTAs should I use?
5. What is the status of each content idea?
6. What worked last week, and what should I do next?

## MVP Goal

The MVP should help Novet complete a weekly content planning session in under 30 minutes.

A successful MVP allows Novet to:

1. Pick the week’s focus.
2. Choose active campaigns.
3. Add or select content ideas.
4. Assign content to posting days.
5. Plan filming/editing days.
6. Move content through a status pipeline.
7. Review what worked.
8. Decide what to do next week.

## Product Principles

* Keep it practical.
* Do not overbuild.
* Manual workflows are acceptable.
* Prioritize weekly usability.
* Make the app feel like a private command center.
* Avoid complex automation in version 1.
* Build CRUD first.
* Keep the UI clean, fast, and dashboard-like.
* Do not add social media API integrations in MVP.
* Do not build AI generation features in MVP.

## Target User

Primary user: **Novet**

Novet is an artist building consistency around music releases, live shows, personal brand content, and lifestyle/BTS storytelling.

## Current Content Focus Areas

1. New music rollout
2. UMS July 24 show promotion
3. Personal brand building
4. Lifestyle / behind-the-scenes content

## Preferred Content Creation Days

Novet’s best content creation windows are:

* Wednesday
* Thursday
* Friday
* Saturday
* Sunday

Weekends are the strongest creation days. Middle/end of week is also preferred.

## MVP Features

### 1. Dashboard

The Dashboard should show the current week at a glance.

It should include:

* Current week
* Main weekly focus
* Active campaigns
* Today’s planned post
* Upcoming filming tasks
* Pipeline status counts
* Quick add content idea button

### 2. Weekly Planner

The Weekly Planner helps Novet plan what to post and film each week.

It should include:

* Week start date
* Main focus
* Weekly goal
* Notes
* Daily posting plan
* Filming dates
* Preferred creation day indicators

### 3. Campaigns

Campaigns group content around specific objectives.

Default campaigns:

* UMS July 24 Promotion
* New Music Rollout
* Novet Personal Brand
* Lifestyle / BTS

Campaigns should include:

* Name
* Description
* Goal
* Start date
* End date
* Status
* Related content items

Campaign statuses:

* active
* paused
* completed

### 4. Content Idea Bank

The Content Idea Bank stores all content ideas.

Each content idea should include:

* Title
* Campaign
* Content type
* Platform
* Status
* Planned post date
* Filming date
* Hook
* Script
* Caption
* CTA
* Notes

Users should be able to:

* Create content ideas
* Edit content ideas
* Delete content ideas
* Filter by campaign
* Filter by platform
* Filter by content type
* Filter by status

### 5. Scripts & Captions

Scripts and captions can live inside each content item.

Each content item should support:

* Hook
* Script
* Caption
* CTA
* Notes

This should not be a separate complex module in MVP unless needed later.

### 6. Content Status Pipeline

The pipeline tracks content execution.

Pipeline statuses:

1. idea
2. planned
3. filmed
4. edited
5. scheduled
6. posted
7. reviewed

The MVP should use simple status update buttons. Drag-and-drop is not required for version 1.

### 7. Weekly Review

The Weekly Review helps Novet learn from each week.

Each review should include:

* Weekly plan
* Wins
* Lessons learned
* Next actions
* Notes

Manual content metrics should include:

* Views
* Likes
* Comments
* Shares
* Saves
* Follows gained

## MVP Data Model

### campaigns

Fields:

* id
* name
* description
* goal
* start_date
* end_date
* status
* created_at
* updated_at

### weekly_plans

Fields:

* id
* week_start_date
* main_focus
* weekly_goal
* notes
* created_at
* updated_at

### content_items

Fields:

* id
* title
* campaign_id
* weekly_plan_id
* content_type
* platform
* status
* planned_post_date
* filming_date
* hook
* script
* caption
* cta
* notes
* created_at
* updated_at

### weekly_reviews

Fields:

* id
* weekly_plan_id
* wins
* lessons
* next_actions
* notes
* created_at
* updated_at

### content_metrics

Fields:

* id
* content_item_id
* views
* likes
* comments
* shares
* saves
* follows_gained
* notes
* created_at
* updated_at

## Content Types

Initial content types:

* performance
* behind_the_scenes
* lifestyle
* promo
* personal_brand
* educational
* lyric_breakdown
* rehearsal
* announcement

## Platforms

Initial platforms:

* TikTok
* Instagram
* YouTube Shorts
* All

## Routes

The app should include these routes:

* `/dashboard`
* `/weekly-planner`
* `/campaigns`
* `/ideas`
* `/pipeline`
* `/review`
* `/settings`

## Suggested Navigation

Sidebar navigation:

1. Dashboard
2. Weekly Planner
3. Campaigns
4. Idea Bank
5. Pipeline
6. Weekly Review
7. Settings

## Version 1 Non-Goals

Do not build these in MVP:

* Social media API integrations
* Auto-posting
* TikTok/Instagram analytics sync
* AI caption generation inside the app
* Team collaboration
* Complex permissions
* Public profiles
* Drag-and-drop pipeline
* Full calendar sync
* Native mobile app

## Tech Stack

Recommended stack:

* Next.js
* TypeScript
* Tailwind CSS
* Supabase
* GitHub
* Codex

Use Supabase for the database because this is a private web app that may eventually need auth, hosted data, and access from multiple devices.

## Build Phases

### Phase 1 — App Shell

Build:

* Next.js app
* TypeScript setup
* Tailwind CSS
* Sidebar navigation
* Dashboard layout
* Placeholder pages for all MVP routes

No database yet.

### Phase 2 — Types and Constants

Build:

* TypeScript types for core entities
* Constants for statuses, platforms, content types, and default campaigns

### Phase 3 — Database Schema

Build:

* Supabase schema
* Seed campaigns
* Seed example content ideas
* Database documentation

### Phase 4 — Content Idea Bank

Build:

* Create idea
* Edit idea
* Delete idea
* Filter ideas
* View idea details
* Add hook/script/caption/CTA

### Phase 5 — Weekly Planner

Build:

* Create weekly plan
* Set weekly focus and goal
* Assign content to days
* Add filming dates
* Display preferred creation days

### Phase 6 — Pipeline

Build:

* Status-based pipeline board
* Content cards by status
* Simple buttons to move content forward

### Phase 7 — Campaigns

Build:

* Campaign list
* Campaign detail page
* Campaign progress summary
* Related content items

### Phase 8 — Weekly Review

Build:

* Weekly review form
* Manual metrics
* Lessons learned
* Next actions

### Phase 9 — Polish

Build:

* Empty states
* Better dashboard cards
* Quick-add idea flow
* Mobile responsive layout
* Basic private access
* README

## MVP Success Criteria

The app is successful when Novet can open it weekly and clearly know:

* What he is promoting
* What content he needs to film
* What he should post today
* Which captions/hooks/scripts to use
* What status each content idea is in
* What worked last week
* What to do next week

## Guiding Product Statement

This app should help Novet stop guessing and start executing.

The goal is not to create a perfect content system.

The goal is to create a repeatable weekly rhythm for releasing music, promoting shows, building the Novet brand, and staying consistent.
