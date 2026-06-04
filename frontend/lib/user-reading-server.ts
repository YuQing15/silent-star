import { createSupabaseServerClient } from './supabase/server'
import { hasSupabaseEnv } from './supabase/config'
import { getPublicNovels } from './public-supabase'
import type { Novel } from './mock-data'
import type { ReadingStatus, UserReadingDashboardData, UserReadingItem } from './user-reading'

type ProgressRow = {
  novel_id: string
  chapter_id: string | null
  chapter_number: number | null
  progress_percent: number | null
  reading_status: ReadingStatus | null
  last_read_at: string | null
}

type BookmarkRow = {
  novel_id: string
  chapter_id: string | null
}

const emptyDashboard: UserReadingDashboardData = {
  currentlyReading: [],
  wantToRead: [],
  completed: [],
  dropped: [],
  bookmarks: [],
  stats: { chaptersRead: 0, completedNovels: 0 },
}

function groupItems(progressRows: ProgressRow[], bookmarkRows: BookmarkRow[], novels: Novel[]): UserReadingDashboardData {
  const novelById = new Map(novels.map(novel => [novel.id, novel]))
  const bookmarkIds = new Set(bookmarkRows.map(row => row.novel_id))
  const items = progressRows
    .map(row => {
      const novel = novelById.get(row.novel_id)
      if (!novel) return null

      return {
        novel,
        novelId: row.novel_id,
        chapterId: row.chapter_id,
        chapterNumber: row.chapter_number ?? 1,
        progressPercent: Number(row.progress_percent ?? 0),
        readingStatus: row.reading_status ?? 'currently_reading',
        isBookmarked: bookmarkIds.has(row.novel_id),
        lastReadAt: row.last_read_at ?? new Date().toISOString(),
      } satisfies UserReadingItem
    })
    .filter(Boolean) as UserReadingItem[]

  const bookmarkedOnly = bookmarkRows
    .filter(row => !items.some(item => item.novelId === row.novel_id))
    .map(row => {
      const novel = novelById.get(row.novel_id)
      if (!novel) return null
      return {
        novel,
        novelId: row.novel_id,
        chapterId: row.chapter_id,
        chapterNumber: 1,
        progressPercent: 0,
        readingStatus: 'want_to_read' as ReadingStatus,
        isBookmarked: true,
        lastReadAt: novel.createdAt,
      }
    })
    .filter(Boolean) as UserReadingItem[]

  const allItems = [...items, ...bookmarkedOnly].sort((a, b) => Date.parse(b.lastReadAt) - Date.parse(a.lastReadAt))
  const completed = allItems.filter(item => item.readingStatus === 'completed')
  const currentlyReading = allItems.filter(item => item.readingStatus === 'currently_reading')
  return {
    currentlyReading,
    wantToRead: allItems.filter(item => item.readingStatus === 'want_to_read'),
    completed,
    dropped: allItems.filter(item => item.readingStatus === 'dropped'),
    bookmarks: allItems.filter(item => item.isBookmarked),
    stats: {
      chaptersRead: allItems.reduce((sum, item) => sum + Math.max(0, item.chapterNumber - (item.progressPercent >= 92 ? 0 : 1)), 0),
      completedNovels: completed.length,
    },
  }
}

export async function getUserReadingDashboard(userId: string): Promise<UserReadingDashboardData> {
  if (!hasSupabaseEnv()) return emptyDashboard

  const supabase = await createSupabaseServerClient()
  const [progressResult, bookmarksResult, novels] = await Promise.all([
    supabase
      .from('reading_progress')
      .select('novel_id,chapter_id,chapter_number,progress_percent,reading_status,last_read_at')
      .eq('user_id', userId)
      .order('last_read_at', { ascending: false }),
    supabase
      .from('bookmarks')
      .select('novel_id,chapter_id')
      .eq('user_id', userId),
    getPublicNovels(),
  ])

  if (progressResult.error || bookmarksResult.error) return emptyDashboard
  return groupItems((progressResult.data ?? []) as ProgressRow[], (bookmarksResult.data ?? []) as BookmarkRow[], novels)
}

export async function getUserNovelReadingState(userId: string, novelId: string): Promise<{ chapterNumber: number | null; progressPercent: number; readingStatus: ReadingStatus | '' } | null> {
  if (!hasSupabaseEnv()) return null

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('reading_progress')
    .select('chapter_number,progress_percent,reading_status')
    .eq('user_id', userId)
    .eq('novel_id', novelId)
    .maybeSingle()

  if (error || !data) return null

  return {
    chapterNumber: data.chapter_number ?? null,
    progressPercent: Number(data.progress_percent ?? 0),
    readingStatus: (data.reading_status as ReadingStatus | null) ?? '',
  }
}



