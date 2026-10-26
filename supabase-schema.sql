-- Run this in your Supabase SQL Editor to set up the database.
-- Mirrors the live "score-app" project (synced 2026-10-26).
-- The app only talks to Supabase with the service-role key (src/lib/supabase.ts).

-- Submissions: one row per completed assessment
create table submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  parent_name text,
  parent_mobile text,
  parent_email text,
  child_class text,
  child_school text,
  child_board text,
  total_score numeric not null,
  max_score integer not null,
  percentage integer not null,
  profile_name text not null,
  profile_id text not null,
  category_scores jsonb not null,
  has_booking boolean default false
);

-- Bookings: consultation requests from /booking
create table bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  submission_id uuid references submissions(id),
  parent_name text not null,
  parent_mobile text not null,
  parent_email text not null,
  child_name text not null,
  child_age text not null,
  academic_challenges text not null,
  career_goals text not null,
  preferred_time_slot text not null,
  additional_notes text
);

-- Message logs: every outreach email attempt from the admin dashboard
create table message_logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  submission_id uuid references submissions(id),
  parent_name text,
  parent_email text,
  template_id text not null,
  template_name text not null,
  meeting_link text,
  status text not null default 'sent',
  error text
);

-- Rate limits: fixed-window counters keyed by e.g. "submit:<ip>"
create table rate_limits (
  key text primary key,
  attempts integer not null default 1,
  window_start timestamptz not null default now()
);

-- Admin audit log: records admin deletions
create table admin_audit_log (
  id uuid default gen_random_uuid() primary key,
  action text not null,
  submission_ids text[] not null,
  performed_by text,
  created_at timestamptz not null default now()
);

-- Row Level Security: only the service role may touch any table
alter table submissions enable row level security;
alter table bookings enable row level security;
alter table message_logs enable row level security;
alter table rate_limits enable row level security;
alter table admin_audit_log enable row level security;

create policy "Service role reads submissions"
  on submissions for select using (auth.role() = 'service_role');

create policy "Service role updates submissions"
  on submissions for update using (auth.role() = 'service_role');

create policy "Service role reads bookings"
  on bookings for select using (auth.role() = 'service_role');

create policy "Service role only"
  on message_logs for all using (auth.role() = 'service_role');

create policy "Service role only"
  on rate_limits for all using (auth.role() = 'service_role');

create policy "Service role only"
  on admin_audit_log for all using (auth.role() = 'service_role');

-- Remove Supabase's default table grants so nothing is reachable (or listed in
-- the GraphQL schema) with the anon or a signed-in user key.
revoke all on table submissions, bookings, message_logs, rate_limits, admin_audit_log
  from anon, authenticated;
