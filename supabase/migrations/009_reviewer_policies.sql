-- 009 · row level security for the existing `reviewers` table
--
-- The `reviewers` table already exists in Supabase (created manually, no
-- rows yet — you assign reviewers yourself from the Supabase dashboard).
-- This migration does NOT create or alter that table. It only turns on
-- RLS and adds policies so the table is safe to query through the app's
-- anon/authenticated keys.
--
-- Column assumed: `user_id uuid`, one row per reviewer, linking to
-- auth.users. Run in the Supabase SQL editor. Safe to re-run.

alter table reviewers enable row level security;

-- PostgREST checks table grants before RLS, so without this the API can't
-- reach the table at all. Only SELECT is granted — no INSERT/UPDATE/DELETE
-- through the API, since reviewers are assigned manually in the dashboard.
revoke all on table reviewers from anon, authenticated;
grant select on table reviewers to authenticated;

-- A signed-in user may check their own row only — never anyone else's.
drop policy if exists "users read own reviewer row" on reviewers;

create policy "users read own reviewer row"
  on reviewers for select
  using (user_id = auth.uid());

-- Defense in depth below: the grants above already block every write and
-- block anon entirely, so none of this should ever be reachable. It exists
-- so the "no one can self-promote" rule is explicit in the policy list
-- itself, not just implied by what's absent — and so a future edit (e.g.
-- someone copying an "owners can insert their own row" pattern from the
-- entries table) can't quietly reopen this table without also removing an
-- obvious, named, commented policy first.

-- RLS normally doesn't apply to the table's owner role. FORCE makes it
-- apply to every role, including the owner — so even a future
-- SECURITY DEFINER function running as the table owner is still subject
-- to these policies unless it explicitly bypasses RLS on its own.
alter table reviewers force row level security;

-- Logged-out visitors get nothing at all, not even their "own" row
-- (they have none). Explicit, rather than relying only on the missing
-- grant above.
drop policy if exists "anon has no access to reviewers" on reviewers;

create policy "anon has no access to reviewers"
  on reviewers for all
  to anon
  using (false)
  with check (false);

-- Signed-in users may read their own row (policy above) but can never
-- insert, update, or delete — reviewer status is assigned only by you,
-- manually, from the Supabase dashboard.
drop policy if exists "authenticated cannot write reviewers" on reviewers;

create policy "authenticated cannot write reviewers"
  on reviewers for insert
  to authenticated
  with check (false);

drop policy if exists "authenticated cannot update reviewers" on reviewers;

create policy "authenticated cannot update reviewers"
  on reviewers for update
  to authenticated
  using (false)
  with check (false);

drop policy if exists "authenticated cannot delete reviewers" on reviewers;

create policy "authenticated cannot delete reviewers"
  on reviewers for delete
  to authenticated
  using (false);
