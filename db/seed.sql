-- Novet Content Command Center MVP seed data
-- Run db/schema.sql before this file. Fixed UUIDs make repeated runs safe.

begin;

insert into public.campaigns (id, name, description, goal, status)
values
  (
    '00000000-0000-4000-8000-000000000001',
    'UMS July 24 Promotion',
    'Content supporting Novet''s July 24 UMS appearance.',
    'Build awareness and excitement for the UMS show.',
    'active'
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'New Music Rollout',
    'Release-focused content for new Novet music.',
    'Create a consistent story around upcoming and newly released music.',
    'active'
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    'Novet Personal Brand',
    'Content that introduces Novet''s perspective, story, and artist identity.',
    'Deepen the audience connection with Novet as an artist and person.',
    'active'
  ),
  (
    '00000000-0000-4000-8000-000000000004',
    'Lifestyle / BTS',
    'Lifestyle and behind-the-scenes moments from everyday artist life.',
    'Show the real process and rhythm behind the music.',
    'active'
  )
on conflict do nothing;

insert into public.content_items (
  id,
  title,
  campaign_id,
  content_type,
  platform,
  status
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    'Why UMS matters to me',
    (select id from public.campaigns where name = 'UMS July 24 Promotion'),
    'promo',
    'All',
    'idea'
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'Post-wedding reset as an artist',
    (select id from public.campaigns where name = 'Lifestyle / BTS'),
    'lifestyle',
    'All',
    'idea'
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'New song lyric breakdown',
    (select id from public.campaigns where name = 'New Music Rollout'),
    'lyric_breakdown',
    'All',
    'idea'
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    'Rehearsal clip: live version',
    (select id from public.campaigns where name = 'UMS July 24 Promotion'),
    'rehearsal',
    'All',
    'idea'
  ),
  (
    '10000000-0000-4000-8000-000000000005',
    'Day in the life: 9–5 to artist mode',
    (select id from public.campaigns where name = 'Novet Personal Brand'),
    'behind_the_scenes',
    'All',
    'idea'
  )
on conflict do nothing;

commit;
