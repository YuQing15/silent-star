-- Silent Star Supabase Storage buckets and policies for image uploads.
-- Apply in Supabase SQL Editor after enabling Supabase Storage.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('novel-covers', 'novel-covers', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Novel covers are publicly readable" on storage.objects;
drop policy if exists "Admins and translators can upload novel covers" on storage.objects;
drop policy if exists "Admins and translators can update novel covers" on storage.objects;
drop policy if exists "Admins and translators can delete novel covers" on storage.objects;
drop policy if exists "Avatars are publicly readable" on storage.objects;
drop policy if exists "Users can upload own avatars" on storage.objects;
drop policy if exists "Users can update own avatars" on storage.objects;
drop policy if exists "Users can delete own avatars" on storage.objects;

create policy "Novel covers are publicly readable"
on storage.objects for select
using (bucket_id = 'novel-covers');

create policy "Admins and translators can upload novel covers"
on storage.objects for insert
with check (
  bucket_id = 'novel-covers'
  and ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'translator') or (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'translator'))
);

create policy "Admins and translators can update novel covers"
on storage.objects for update
using (
  bucket_id = 'novel-covers'
  and ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'translator') or (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'translator'))
)
with check (
  bucket_id = 'novel-covers'
  and ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'translator') or (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'translator'))
);

create policy "Admins and translators can delete novel covers"
on storage.objects for delete
using (
  bucket_id = 'novel-covers'
  and ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'translator') or (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'translator'))
);

create policy "Avatars are publicly readable"
on storage.objects for select
using (bucket_id = 'avatars');

create policy "Users can upload own avatars"
on storage.objects for insert
with check (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update own avatars"
on storage.objects for update
using (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete own avatars"
on storage.objects for delete
using (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);
