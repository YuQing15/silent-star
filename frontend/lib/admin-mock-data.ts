import { getChaptersByNovelSlug, MOCK_NOVELS, type Chapter, type Novel, USE_MOCK_DEMO_DATA } from './mock-data'

export type AdminNovelStatus = Novel['status'] | 'draft'
export type AdminChapterStatus = 'draft' | 'published' | 'scheduled'

export interface AdminNovel extends Omit<Novel, 'status'> {
  status: AdminNovelStatus
  visibility: 'draft' | 'published'
}

export interface AdminChapter extends Omit<Chapter, 'status' | 'publishedAt'> {
  status: AdminChapterStatus
  publishedAt?: string
  scheduledFor?: string
}

export interface AdminLibrarySeed {
  novels: AdminNovel[]
  chaptersByNovelId: Record<string, AdminChapter[]>
}

function toAdminNovel(novel: Novel): AdminNovel {
  return {
    ...novel,
    visibility: 'published',
  }
}

function toAdminChapter(chapter: Chapter): AdminChapter {
  return {
    ...chapter,
    status: 'published',
    publishedAt: chapter.publishedAt,
  }
}

export const EMPTY_ADMIN_LIBRARY: AdminLibrarySeed = {
  novels: [],
  chaptersByNovelId: {},
}

export const MOCK_ADMIN_LIBRARY: AdminLibrarySeed = {
  novels: MOCK_NOVELS.slice(0, 3).map(toAdminNovel),
  chaptersByNovelId: MOCK_NOVELS.slice(0, 3).reduce<Record<string, AdminChapter[]>>((acc, novel) => {
    acc[novel.id] = getChaptersByNovelSlug(novel.slug).slice(0, 4).map(toAdminChapter)
    return acc
  }, {}),
}

export const ADMIN_LIBRARY_SEED = USE_MOCK_DEMO_DATA ? MOCK_ADMIN_LIBRARY : EMPTY_ADMIN_LIBRARY

export const ADMIN_STATUS_OPTIONS: AdminNovelStatus[] = ['draft', 'ongoing', 'completed', 'hiatus']
export const ADMIN_ORIGIN_OPTIONS: Novel['origin'][] = ['chinese', 'korean', 'japanese']
