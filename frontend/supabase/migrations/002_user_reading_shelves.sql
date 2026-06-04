-- Silent Star user reading shelves and status categories.
-- Run this after 001_create_novels_chapters_reading.sql.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'reading_status') then
    create type public.reading_status as enum ('currently_reading', 'want_to_read', 'completed', 'dropped');
  end if;
end $$;

alter table public.reading_progress
  add column if not exists reading_status public.reading_status not null default 'currently_reading',
  add column if not exists is_checkmarked boolean not null default false;

create index if not exists reading_progress_user_status_idx
  on public.reading_progress(user_id, reading_status);

create index if not exists reading_progress_user_checkmarked_idx
  on public.reading_progress(user_id, is_checkmarked);
