-- Run this in your Supabase SQL Editor before deploying

create table if not exists responses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  consent boolean not null,
  gender text,
  age_range text,
  university text,
  year text,
  subject text,
  financial_background text,
  ordinal_position text,
  q1 int, q2 int, q3 int, q4 int, q5 int,
  q6 int, q7 int, q8 int, q9 int, q10 int,
  q11 int, q12 int, q13 int, q14 int, q15 int,
  q16 int, q17 int, q18 int, q19 int, q20 int,
  total_score int,
  loneliness_level text
);

create table if not exists interview_requests (
  id uuid default gen_random_uuid() primary key,
  response_id uuid references responses(id),
  email text not null,
  phone text not null,
  name text,
  created_at timestamp with time zone default now()
);

-- Allow anonymous inserts (for the survey form)
alter table responses enable row level security;
alter table interview_requests enable row level security;

create policy "Allow anonymous insert" on responses
  for insert with check (true);

create policy "Allow anonymous insert" on interview_requests
  for insert with check (true);

-- Service role reads all (for admin dashboard via API)
create policy "Service role select" on responses
  for select using (auth.role() = 'service_role');

create policy "Service role select" on interview_requests
  for select using (auth.role() = 'service_role');
