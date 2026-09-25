-- 001 · entries table + row level security
-- Run this first, then 002, then 003 — or paste all three in order.
-- Safe to re-run (guards make every statement idempotent).

create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  players text not null,
  materials text,
  contributor_name text not null,
  photo_url text not null,
  created_at timestamptz not null default now(),
  owner uuid not null references auth.users (id)
);

alter table entries enable row level security;

-- The site reads through the publishable/anon key, so make sure anon and
-- authenticated can select. (RLS below decides what they may actually see.)
grant select on table entries to anon, authenticated;

do $$ begin
  create policy "anyone can read entries"
    on entries for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "owners add their own entries"
    on entries for insert with check (auth.uid() = owner);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "owners edit their own entries"
    on entries for update using (auth.uid() = owner);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "owners delete their own entries"
    on entries for delete using (auth.uid() = owner);
exception when duplicate_object then null; end $$;