-- Per-court QR scan log for seattleballmachine.com /q/{slug} entry points.
-- Slug-keyed (no FK) so new QR campaigns can be added without schema changes.

create table public.ballmachine_qr_scans (
  id          bigint generated always as identity primary key,
  slug        text        not null,
  scanned_at  timestamptz not null default now(),
  user_agent  text,
  referer     text,
  ip          text,
  country     text,
  city        text
);

create index ballmachine_qr_scans_slug_scanned_at_idx
  on public.ballmachine_qr_scans (slug, scanned_at desc);

alter table public.ballmachine_qr_scans enable row level security;

-- Writes happen via service-role key from app/q/[slug]/route.ts, which
-- bypasses RLS. No public policies — reads are admin-only.

comment on table public.ballmachine_qr_scans is
  'QR-code scan log for seattleballmachine.com /q/{slug} entry points.';
