-- Run this in your Supabase SQL Editor to set up the database

-- Submissions table
create table submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  child_class text not null,
  child_school text not null,
  child_board text not null,
  total_score integer not null,
  max_score integer not null,
  percentage integer not null,
  profile_name text not null,
  profile_id text not null,
  category_scores jsonb not null,
  has_booking boolean default false
);

-- Bookings table
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

-- Enable Row Level Security
alter table submissions enable row level security;
alter table bookings enable row level security;

-- Allow public inserts (parents submitting)
create policy "Allow public insert on submissions"
  on submissions for insert to anon with check (true);

create policy "Allow public insert on bookings"
  on bookings for insert to anon with check (true);

-- Only service role can read (admin dashboard uses service key)
create policy "Service role reads submissions"
  on submissions for select using (auth.role() = 'service_role');

create policy "Service role reads bookings"
  on bookings for select using (auth.role() = 'service_role');

create policy "Service role updates submissions"
  on submissions for update using (auth.role() = 'service_role');

-- Add extended booking columns if they don't already exist
-- (these columns support the admin dashboard booking detail panel)
alter table bookings
  add column if not exists parent_name text,
  add column if not exists mobile_number text,
  add column if not exists email text,
  add column if not exists child_name text,
  add column if not exists child_age text,
  add column if not exists academic_challenges text,
  add column if not exists career_goals text,
  add column if not exists preferred_time_slot text,
  add column if not exists additional_notes text;
