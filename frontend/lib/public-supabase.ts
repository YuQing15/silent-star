import { createSupabaseServerClient } from './supabase/server'
import { hasSupabaseEnv } from './supabase/config'
import type { Chapter, Novel } from './mock-data'

type PublicNovelRow = {
  id: string
  title: string
  original_title: string | null
  author: string | null
  translator: string | null
  language: string | null
  status: string
  synopsis: string | null
  cover_url: string | null
  genres: string[] | null
  created_at: string
  updated_at: string
}

type PublicChapterRow = {
  id: string
  novel_id: string
  chapter_number: number
  title: string | null
  translated_text: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

function mapOrigin(value: string | null): Novel['origin'] {
  const origin = value?.toLowerCase().trim() ?? ''
  if (origin.includes('chinese')) return 'chinese'
  if (origin.includes('korean')) return 'korean'
  if (origin.includes('japanese')) return 'japanese'
  if (origin.includes('english')) return 'english'
  return 'other'
}
function toPublicNovel(row: PublicNovelRow, chapters: PublicChapterRow[] = []): Novel {
  const publishedChapters = chapters.length
  const latestChapter = chapters[chapters.length - 1]
  const genres = row.genres?.length ? row.genres : ['Novel']
  const status = row.status === 'completed' ? 'completed' : row.status === 'hiatus' || row.status === 'dropped' ? 'hiatus' : 'ongoing'

  return {
    id: row.id,
    slug: row.id,
    title: row.title,
    originalTitle: row.original_title ?? '',
    synopsis: row.synopsis ?? 'A Silent Star novel awaiting its synopsis.',
    coverUrl: row.cover_url || '/silent-star-logo.svg',
    bannerUrl: row.cover_url || '/silent-star-logo.svg',
    authorName: row.author ?? '',
    translatorName: row.translator ?? '',
    status,
    origin: mapOrigin(row.language),
    publishedChapters,
    totalChapters: publishedChapters,
    averageRating: 0,
    totalRatings: 0,
    totalViews: 0,
    weeklyViews: 0,
    totalBookmarks: 0,
    ambientTheme: 'winter',
    primaryMood: 'cozy',
    tags: [],
    genres,
    lastChapterAt: latestChapter?.published_at ?? row.updated_at,
    createdAt: row.created_at,
  }
}

function toPublicChapter(row: PublicChapterRow, novel: Novel, allRows: PublicChapterRow[]): Chapter {
  const index = allRows.findIndex(chapter => chapter.id === row.id)
  const content = row.translated_text ?? ''
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  return {
    id: row.id,
    novelId: novel.id,
    novelSlug: novel.slug,
    novelTitle: novel.title,
    chapterNumber: row.chapter_number,
    title: row.title || `Chapter ${row.chapter_number}`,
    slug: `chapter-${row.chapter_number}`,
    content,
    wordCount,
    status: 'published',
    isPremium: false,
    publishedAt: row.published_at ?? row.created_at,
    estimatedReadMinutes: Math.max(1, Math.ceil(wordCount / 240)),
    prevChapter: index > 0 ? allRows[index - 1].chapter_number : null,
    nextChapter: index >= 0 && index < allRows.length - 1 ? allRows[index + 1].chapter_number : null,
  }
}

async function fetchPublishedRows() {
  if (!hasSupabaseEnv()) return { novels: [], chaptersByNovelId: new Map<string, PublicChapterRow[]>(), error: null }

  const supabase = await createSupabaseServerClient()
  const novelsResult = await supabase
    .from('novels')
    .select('id,title,original_title,author,translator,language,status,synopsis,cover_url,genres,created_at,updated_at')
    .neq('status', 'draft')
    .order('created_at', { ascending: false })

  if (novelsResult.error) return { novels: [], chaptersByNovelId: new Map<string, PublicChapterRow[]>(), error: novelsResult.error }

  const rows = (novelsResult.data ?? []) as PublicNovelRow[]
  const novelIds = rows.map(novel => novel.id)
  const chaptersByNovelId = new Map<string, PublicChapterRow[]>()

  if (novelIds.length > 0) {
    const chaptersResult = await supabase
      .from('chapters')
      .select('id,novel_id,chapter_number,title,translated_text,is_published,published_at,created_at,updated_at')
      .in('novel_id', novelIds)
      .eq('is_published', true)
      .order('chapter_number', { ascending: true })

    if (chaptersResult.error) return { novels: rows, chaptersByNovelId, error: chaptersResult.error }

    for (const chapter of (chaptersResult.data ?? []) as PublicChapterRow[]) {
      const existing = chaptersByNovelId.get(chapter.novel_id) ?? []
      existing.push(chapter)
      chaptersByNovelId.set(chapter.novel_id, existing)
    }
  }

  return { novels: rows, chaptersByNovelId, error: null }
}

export async function getPublicNovels(): Promise<Novel[]> {
  // Do not render mock novels publicly. Use Supabase data or empty states.
  const { novels, chaptersByNovelId, error } = await fetchPublishedRows()
  if (error) return []
  return novels.map(novel => toPublicNovel(novel, chaptersByNovelId.get(novel.id) ?? []))
}

export async function getPublicNovelBySlug(slug: string): Promise<{ novel: Novel; chapters: Chapter[] } | null> {
  const { novels, chaptersByNovelId, error } = await fetchPublishedRows()
  if (error) return null

  const row = novels.find(novel => novel.id === slug)
  if (!row) return null

  const chapterRows = chaptersByNovelId.get(row.id) ?? []
  const novel = toPublicNovel(row, chapterRows)
  return { novel, chapters: chapterRows.map(chapter => toPublicChapter(chapter, novel, chapterRows)) }
}

export async function getPublicChapter(novelSlug: string, chapterNumber: number): Promise<{ novel: Novel; chapter: Chapter; chapters: Chapter[] } | null> {
  const found = await getPublicNovelBySlug(novelSlug)
  if (!found) return null
  const chapter = found.chapters.find(item => item.chapterNumber === chapterNumber)
  if (!chapter) return null
  return { novel: found.novel, chapter, chapters: found.chapters }
}


