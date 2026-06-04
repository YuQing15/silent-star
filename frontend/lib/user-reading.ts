import { createSupabaseBrowserClient } from './supabase/client'
import type { Novel } from './mock-data'

export type ReadingStatus = 'currently_reading' | 'want_to_read' | 'completed' | 'dropped'

export interface UserReadingItem {
  novel: Novel
  novelId: string
  chapterId: string | null
  chapterNumber: number
  progressPercent: number
  readingStatus: ReadingStatus
  isBookmarked: boolean
  lastReadAt: string
}

export interface NovelReadingState {
  readingStatus: ReadingStatus | ''
  isBookmarked: boolean
  chapterNumber: number | null
  progressPercent: number
}

export interface UserReadingDashboardData {
  currentlyReading: UserReadingItem[]
  wantToRead: UserReadingItem[]
  completed: UserReadingItem[]
  dropped: UserReadingItem[]
  bookmarks: UserReadingItem[]
  stats: {
    chaptersRead: number
    completedNovels: number
  }
}

async function getBrowserUserId() {
  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return { supabase, userId: null }
  return { supabase, userId: data.user.id }
}

export async function saveNovelReadingStatus(novelId: string, status: ReadingStatus) {
  const { supabase, userId } = await getBrowserUserId()
  if (!userId) return { requiresLogin: true, error: null }

  const { error } = await supabase
    .from('reading_progress')
    .upsert({ user_id: userId, novel_id: novelId, reading_status: status, last_read_at: new Date().toISOString() }, { onConflict: 'user_id,novel_id' })

  return { requiresLogin: false, error }
}

export async function saveChapterReadingProgress(novelId: string, chapterId: string, chapterNumber: number, progressPercent: number) {
  const { supabase, userId } = await getBrowserUserId()
  if (!userId) return { requiresLogin: true, error: null }

  const { error } = await supabase
    .from('reading_progress')
    .upsert({
      user_id: userId,
      novel_id: novelId,
      chapter_id: chapterId,
      chapter_number: chapterNumber,
      progress_percent: Math.round(progressPercent * 100) / 100,
      reading_status: 'currently_reading',
      last_read_at: new Date().toISOString(),
    }, { onConflict: 'user_id,novel_id' })

  return { requiresLogin: false, error }
}

export async function removeNovelReadingProgress(novelId: string) {
  const { supabase, userId } = await getBrowserUserId()
  if (!userId) return { requiresLogin: true, error: null }

  const { error } = await supabase.from('reading_progress').delete().eq('user_id', userId).eq('novel_id', novelId)
  return { requiresLogin: false, error }
}
export async function setNovelBookmark(novelId: string, bookmarked: boolean) {
  const { supabase, userId } = await getBrowserUserId()
  if (!userId) return { requiresLogin: true, error: null }

  if (!bookmarked) {
    const { error } = await supabase.from('bookmarks').delete().eq('user_id', userId).eq('novel_id', novelId).is('chapter_id', null)
    return { requiresLogin: false, error }
  }

  const existing = await supabase.from('bookmarks').select('id').eq('user_id', userId).eq('novel_id', novelId).is('chapter_id', null).maybeSingle()
  if (existing.data) return { requiresLogin: false, error: null }

  const { error } = await supabase.from('bookmarks').insert({ user_id: userId, novel_id: novelId })
  return { requiresLogin: false, error }
}

export async function getNovelReadingState(novelId: string): Promise<{ requiresLogin: boolean; data: NovelReadingState | null; error: { message?: string } | null }> {
  const { supabase, userId } = await getBrowserUserId()
  if (!userId) return { requiresLogin: true, data: null, error: null }

  const [progressResult, bookmarkResult] = await Promise.all([
    supabase
      .from('reading_progress')
      .select('chapter_number,progress_percent,reading_status')
      .eq('user_id', userId)
      .eq('novel_id', novelId)
      .maybeSingle(),
    supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('novel_id', novelId)
      .is('chapter_id', null)
      .maybeSingle(),
  ])

  if (progressResult.error) return { requiresLogin: false, data: null, error: progressResult.error }
  if (bookmarkResult.error) return { requiresLogin: false, data: null, error: bookmarkResult.error }

  return {
    requiresLogin: false,
    error: null,
    data: {
      readingStatus: (progressResult.data?.reading_status as ReadingStatus | null) ?? '',
      isBookmarked: Boolean(bookmarkResult.data),
      chapterNumber: progressResult.data?.chapter_number ?? null,
      progressPercent: Number(progressResult.data?.progress_percent ?? 0),
    },
  }
}


