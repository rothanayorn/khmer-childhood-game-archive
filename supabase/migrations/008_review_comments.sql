-- 008 · review comments
-- Stores the reason a reviewer returns an entry so the contributor can see it.
-- If your review_entry() function already writes to a comments table, make sure
-- the table and column names below match exactly what the function expects
-- (entry_id, author_id / reviewer_id, comment). Safe to re-run.
create table if not exists review_comments (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references entries (id) on delete cascade,
  author_id uuid not null default auth.uid() references auth.users (id),
  comment text not null,
  created_at timestamptz not null default now()
);

create index if not exists review_comments_entry_idx on review_comments (entry_id);

alter table review_comments enable row level security;

-- Signed-in users may add comments; the author is the session user.
do $$ begin
  create policy "users add comments"
    on review_comments for insert
    with check (author_id = auth.uid());
exception when duplicate_object then null; end $$;

-- The entry's owner and the comment's author may read comments.
do $$ begin
  create policy "entry owner or author reads comments"
    on review_comments for select
    using (
      author_id = auth.uid()
      or exists (
        select 1 from entries e
        where e.id = entry_id and e.owner = auth.uid()
      )
    );
exception when duplicate_object then null; end $$;

grant select, insert on table review_comments to authenticated;