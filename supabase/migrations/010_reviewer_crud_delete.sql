-- 010 · reviewer CRUD on entries + owner delete requests
--
-- Reviewers may update or delete any entry (full CRUD on user entries).
-- A contributor can no longer delete their own row directly: they flag it
-- delete_requested, and a reviewer approves (real delete) or rejects
-- (flag cleared, previous status restored).
--
-- Run in the Supabase SQL editor after 009. Safe to re-run.

-- Delete-request flag. The entry keeps its current status (pending /
-- published / returned) until a reviewer approves the deletion, so a
-- published game stays public while the request is waiting.
alter table entries add column if not exists delete_requested boolean not null default false;
alter table entries add column if not exists status_before_delete text;

-- Reviewers may edit any entry. The edit form never sends `owner`, so
-- ownership does not change in the app. (RLS cannot compare old vs new
-- owner; a trigger would be needed to block that at the database layer.)
drop policy if exists "reviewers update any entry" on entries;

create policy "reviewers update any entry"
  on entries for update
  using (is_reviewer());

-- Reviewers may delete any entry (this is what "approve delete request"
-- actually does — the UI never deletes an owner row without this policy).
drop policy if exists "reviewers delete any entry" on entries;

create policy "reviewers delete any entry"
  on entries for delete
  using (is_reviewer());

-- Contributors may no longer delete their own rows. The Delete button on
-- My Entries is a *request*; only a reviewer can remove the row. Dropping
-- the 001 owner-delete policy is what makes that true in the database,
-- not just in the UI (otherwise the console could still delete).
drop policy if exists "owners delete their own entries" on entries;
