-- Allow admin and translator roles to manage content.
-- Apply after the initial novels/chapters schema.

drop policy if exists "Admins can manage novels" on public.novels;
drop policy if exists "Admins can manage chapters" on public.chapters;

create policy "Admins and translators can manage novels"
on public.novels for all
using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'translator') or (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'translator'))
with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'translator') or (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'translator'));

create policy "Admins and translators can manage chapters"
on public.chapters for all
using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'translator') or (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'translator'))
with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'translator') or (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'translator'));
