-- 005 · tighten the entries update policy
-- An owner may edit their row, but may never hand it over to a different owner
-- in the same UPDATE. `using` checks the old row; `with check` checks the new.
drop policy if exists "owners edit their own entries" on entries;

create policy "owners edit their own entries"
  on entries for update
  using (auth.uid() = owner)
  with check (owner = auth.uid());