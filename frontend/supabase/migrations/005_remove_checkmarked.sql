-- Remove the retired Checkmarked/Favourites shelf feature.
drop index if exists reading_progress_user_checkmarked_idx;
alter table public.reading_progress drop column if exists is_checkmarked;
