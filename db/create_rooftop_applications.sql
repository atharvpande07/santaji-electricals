-- =============================================================================
-- Santaji Electricals — Rooftop Solar Applications Schema
-- Run once in your Supabase SQL Editor.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Main applications table
-- ---------------------------------------------------------------------------
create table if not exists rooftop_applications (
  id            uuid        primary key default gen_random_uuid(),
  name          text        not null,
  mobile        text        not null,
  email         text,
  consumer_no   text        not null,
  aadhar_no     text        not null,
  pan_no        text        not null,
  documents     jsonb,                          -- array of { field, storage_path, filename, size, mime }
  consent       boolean     not null default false,
  consent_at    timestamptz,
  status        text        not null default 'created'
                            check (status in ('created', 'submitted', 'rejected')),
  created_at    timestamptz not null default now(),
  submitted_at  timestamptz
);

-- Row-Level Security — only the service_role (Edge Functions) can read/write.
-- Anon/authenticated users have zero access.
alter table rooftop_applications enable row level security;

-- Drop the policy if it already exists, then recreate (idempotent)
drop policy if exists "service_role_only" on rooftop_applications;
create policy "service_role_only" on rooftop_applications
  using     ( (select current_setting('role')) = 'service_role' )
  with check( (select current_setting('role')) = 'service_role' );

-- ---------------------------------------------------------------------------
-- 2. Rate-limiting table (used by apply-create Edge Function)
--    Key: (client_ip, hour_bucket)  →  count
-- ---------------------------------------------------------------------------
create table if not exists rate_limits (
  ip           text        not null,
  window_start timestamptz not null
                           default date_trunc('hour', now()),
  count        int         not null default 1,
  primary key (ip, window_start)
);

alter table rate_limits enable row level security;

drop policy if exists "service_role_only" on rate_limits;
create policy "service_role_only" on rate_limits
  using     ( (select current_setting('role')) = 'service_role' )
  with check( (select current_setting('role')) = 'service_role' );

-- Optional: auto-prune rows older than 2 hours to keep the table small.
-- Run this via pg_cron (requires pg_cron extension):
--
-- select cron.schedule(
--   'prune_rate_limits',
--   '0 * * * *',   -- every hour
--   $$delete from rate_limits where window_start < now() - interval '2 hours'$$
-- );

-- ---------------------------------------------------------------------------
-- 3. Indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_applications_status
  on rooftop_applications(status);

create index if not exists idx_applications_created_at
  on rooftop_applications(created_at desc);

-- ---------------------------------------------------------------------------
-- 4. Admin helper view (readable only by service_role via Edge Function)
--    Lists submitted applications with document count.
-- ---------------------------------------------------------------------------
create or replace view submitted_applications as
  select
    id,
    name,
    mobile,
    email,
    consumer_no,
    aadhar_no,
    pan_no,
    status,
    jsonb_array_length(coalesce(documents, '[]'::jsonb)) as document_count,
    consent,
    consent_at,
    created_at,
    submitted_at
  from rooftop_applications
  where status = 'submitted'
  order by submitted_at desc;

-- ---------------------------------------------------------------------------
-- 5. Data-retention recommendation
-- ---------------------------------------------------------------------------
-- Recommendation: delete applications (and purge Storage files) after 24 months.
-- Add a pg_cron job:
--
-- select cron.schedule(
--   'delete_old_applications',
--   '0 2 * * *',   -- daily at 02:00
--   $$
--     delete from rooftop_applications
--     where submitted_at < now() - interval '24 months';
--   $$
-- );
--
-- NOTE: Storage objects are NOT automatically deleted by this. You must also
-- call the Supabase Storage API to delete files under
-- "applications/{application_id}/" for each deleted row.
-- See APPLY_README.md for a sample admin script.

-- =============================================================================
-- Done. Next: create Storage bucket "documents" (private) in Supabase Dashboard.
-- =============================================================================
