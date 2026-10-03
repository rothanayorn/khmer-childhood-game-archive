-- 004 · Supabase Storage bucket + policies for entry photos
-- Run this once (idempotent). Photo uploads go to the `entry-images` bucket:
-- public read, authenticated upload/update/delete restricted to the owner.
-- The form also enforces these same limits before anything is uploaded.

insert into storage.buckets (id, name, public)
values ('entry-images', 'entry-images', true)
on conflict (id) do nothing;

-- Server-side safety net for the 5 MB image-only rule. Wrapped in a guard so
-- older storage schemas without these columns don't fail the migration.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'storage'
      and table_name = 'buckets'
      and column_name = 'allowed_mime_types'
  ) then
    update storage.buckets
    set file_size_limit = 5242880,
        allowed_mime_types = array['image/png','image/jpeg','image/webp','image/gif','image/bmp','image/tiff']
    where id = 'entry-images';
  end if;
end $$;

-- Public read: anyone can view an entry photo via its public URL.
do $$ begin
  create policy "public read entry images"
    on storage.objects for select
    using (bucket_id = 'entry-images');
exception when duplicate_object then null; end $$;

-- Authenticated upload: a signed-in user may upload their own images.
do $$ begin
  create policy "authenticated users upload their own images"
    on storage.objects for insert
    with check (bucket_id = 'entry-images' and owner = auth.uid());
exception when duplicate_object then null; end $$;

-- Owners may replace their images.
do $$ begin
  create policy "owners update their own images"
    on storage.objects for update
    using (bucket_id = 'entry-images' and owner = auth.uid());
exception when duplicate_object then null; end $$;

-- Owners may delete their images (used to clean up failed insertions).
do $$ begin
  create policy "owners delete their own images"
    on storage.objects for delete
    using (bucket_id = 'entry-images' and owner = auth.uid());
exception when duplicate_object then null; end $$;