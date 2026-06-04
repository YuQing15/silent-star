-- Silent Star database schema: novels, chapters, reading progress, bookmarks
-- Paste this into Supabase SQL Editor, or run it as a migration with the Supabase CLI.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'novel_status') then
    create type public.novel_status as enum ('draft', 'ongoing', 'completed', 'hiatus', 'dropped');
  end if;
end $$;

create table if not exists public.novels (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  original_title text,
  author text,
  translator text,
  language text,
  status public.novel_status not null default 'draft',
  synopsis text,
  cover_url text,
  genres text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  novel_id uuid not null references public.novels(id) on delete cascade,
  chapter_number integer not null,
  title text,
  raw_text text,
  translated_text text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chapters_novel_chapter_number_unique unique (novel_id, chapter_number)
);

create table if not exists public.reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  novel_id uuid not null references public.novels(id) on delete cascade,
  chapter_id uuid references public.chapters(id) on delete set null,
  chapter_number integer not null default 1,
  progress_percent numeric(5,2) not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  last_read_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reading_progress_user_novel_unique unique (user_id, novel_id)
);

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  novel_id uuid not null references public.novels(id) on delete cascade,
  chapter_id uuid references public.chapters(id) on delete cascade,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookmarks_user_novel_chapter_unique unique (user_id, novel_id, chapter_id)
);

create index if not exists novels_status_idx on public.novels(status);
create index if not exists novels_created_at_idx on public.novels(created_at desc);
create index if not exists chapters_novel_id_idx on public.chapters(novel_id);
create index if not exists chapters_published_idx on public.chapters(is_published, published_at desc);
create index if not exists reading_progress_user_id_idx on public.reading_progress(user_id);
create index if not exists bookmarks_user_id_idx on public.bookmarks(user_id);

create or replace trigger novels_set_updated_at
before update on public.novels
for each row execute function public.set_updated_at();

create or replace trigger chapters_set_updated_at
before update on public.chapters
for each row execute function public.set_updated_at();

create or replace trigger reading_progress_set_updated_at
before update on public.reading_progress
for each row execute function public.set_updated_at();

create or replace trigger bookmarks_set_updated_at
before update on public.bookmarks
for each row execute function public.set_updated_at();

alter table public.novels enable row level security;
alter table public.chapters enable row level security;
alter table public.reading_progress enable row level security;
alter table public.bookmarks enable row level security;

-- Public readers can see published catalogue content.
create policy "Published novels are readable by everyone"
on public.novels for select
using (status <> 'draft');

create policy "Published chapters are readable by everyone"
on public.chapters for select
using (is_published = true);

-- Admin/editor writes can be wired later through Supabase app_metadata.role = 'admin'.
create policy "Admins can manage novels"
on public.novels for all
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can manage chapters"
on public.chapters for all
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Users own their reading state.
create policy "Users can read own reading progress"
on public.reading_progress for select
using (auth.uid() = user_id);

create policy "Users can insert own reading progress"
on public.reading_progress for insert
with check (auth.uid() = user_id);

create policy "Users can update own reading progress"
on public.reading_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own reading progress"
on public.reading_progress for delete
using (auth.uid() = user_id);

create policy "Users can read own bookmarks"
on public.bookmarks for select
using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
on public.bookmarks for insert
with check (auth.uid() = user_id);

create policy "Users can update own bookmarks"
on public.bookmarks for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
on public.bookmarks for delete
using (auth.uid() = user_id);
