-- 002 · extend entries with the full archive fields from data/games.js
-- (slug for URLs, Khmer name, tagline, description, place, steps)
-- Idempotent: `add column if not exists` + `create index if not exists`.

alter table entries add column if not exists slug text;
alter table entries add column if not exists name_khmer text;
alter table entries add column if not exists tagline text;
alter table entries add column if not exists description text;
alter table entries add column if not exists place text;
alter table entries add column if not exists steps text[];

-- Natural key so the seed can upsert safely and /games/[slug] stays friendly.
create unique index if not exists entries_slug_key on entries (slug);