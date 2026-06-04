import { createSupabaseBrowserClient } from './supabase/client'

export type NovelStatus = 'draft' | 'ongoing' | 'completed' | 'hiatus' | 'dropped'

type AdminRole = 'admin' | 'translator'

export interface AdminDbNovel {
  id: string
  title: string
  original_title: string | null
  author: string | null
  translator: string | null
  language: string | null
  status: NovelStatus
  synopsis: string | null
  cover_url: string | null
  genres: string[]
  created_at: string
  updated_at: string
}

export interface AdminDbChapter {
  id: string
  novel_id: string
  chapter_number: number
  title: string | null
  raw_text: string | null
  translated_text: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export type NovelInput = Omit<AdminDbNovel, 'id' | 'created_at' | 'updated_at'>
export type ChapterInput = Omit<AdminDbChapter, 'id' | 'created_at' | 'updated_at' | 'published_at'> & {
  published_at?: string | null
}

type AdminError = {
  message: string
  details?: string
  hint?: string
  code?: string
}

function devLog(label: string, error: unknown) {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Silent Star admin] ${label}`, error)
  }
}

function makeError(message: string, details?: string): AdminError {
  return { message, details }
}

function getRole(user: { app_metadata?: Record<string, unknown>; user_metadata?: Record<string, unknown> } | null) {
  return user?.app_metadata?.role || user?.user_metadata?.role || 'user'
}

function isAllowedAdminRole(role: unknown): role is AdminRole {
  return role === 'admin' || role === 'translator'
}

async function requireAdminContentAccess() {
  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    devLog('Supabase auth user lookup failed', error)
    return { supabase, error: makeError(`Supabase auth error: ${error.message}`) }
  }

  if (!data.user) {
    return { supabase, error: makeError('You are not logged in to Supabase. Sign in with an admin or translator account before saving content.') }
  }

  const role = getRole(data.user)
  if (!isAllowedAdminRole(role)) {
    return {
      supabase,
      error: makeError(
        `Your Supabase account role is "${String(role)}". Add role "admin" or "translator" to this user metadata, then log out and back in.`,
        `User: ${data.user.email ?? data.user.id}`
      ),
    }
  }

  return { supabase, error: null }
}

function explainDbError(error: { message?: string; code?: string; details?: string; hint?: string } | null) {
  if (!error) return null
  const message = error.message || 'Supabase request failed.'
  const isRls = message.toLowerCase().includes('row-level security') || error.code === '42501'
  if (!isRls) return error

  return {
    ...error,
    message: `${message} Your logged-in Supabase user must have app_metadata.role or user_metadata.role set to "admin" or "translator". Apply the admin/translator RLS migration if you have not already.`,
  }
}

export async function fetchAdminNovels() {
  const supabase = createSupabaseBrowserClient()
  const result = await supabase
    .from('novels')
    .select('id,title,original_title,author,translator,language,status,synopsis,cover_url,genres,created_at,updated_at')
    .order('created_at', { ascending: false })

  if (result.error) devLog('fetchAdminNovels failed', result.error)
  return { ...result, error: explainDbError(result.error) }
}

export async function fetchAdminChapters(novelId: string) {
  const supabase = createSupabaseBrowserClient()
  const result = await supabase
    .from('chapters')
    .select('id,novel_id,chapter_number,title,raw_text,translated_text,is_published,published_at,created_at,updated_at')
    .eq('novel_id', novelId)
    .order('chapter_number', { ascending: true })

  if (result.error) devLog('fetchAdminChapters failed', result.error)
  return { ...result, error: explainDbError(result.error) }
}

export async function upsertAdminNovel(input: NovelInput, id?: string) {
  const access = await requireAdminContentAccess()
  if (access.error) {
    devLog('upsertAdminNovel blocked before Supabase write', access.error)
    return { data: null, error: access.error }
  }

  const query = id
    ? access.supabase
        .from('novels')
        .update(input)
        .eq('id', id)
        .select('id,title,original_title,author,translator,language,status,synopsis,cover_url,genres,created_at,updated_at')
        .single()
    : access.supabase
        .from('novels')
        .insert(input)
        .select('id,title,original_title,author,translator,language,status,synopsis,cover_url,genres,created_at,updated_at')
        .single()

  const result = await query
  if (result.error) devLog(id ? 'updateAdminNovel failed' : 'insertAdminNovel failed', result.error)
  return { ...result, error: explainDbError(result.error) }
}

export async function deleteAdminNovel(id: string) {
  const access = await requireAdminContentAccess()
  if (access.error) return { data: null, error: access.error }

  const result = await access.supabase.from('novels').delete().eq('id', id)
  if (result.error) devLog('deleteAdminNovel failed', result.error)
  return { ...result, error: explainDbError(result.error) }
}

export async function upsertAdminChapter(input: ChapterInput, id?: string) {
  const access = await requireAdminContentAccess()
  if (access.error) {
    devLog('upsertAdminChapter blocked before Supabase write', access.error)
    return { data: null, error: access.error }
  }

  const query = id
    ? access.supabase
        .from('chapters')
        .update(input)
        .eq('id', id)
        .select('id,novel_id,chapter_number,title,raw_text,translated_text,is_published,published_at,created_at,updated_at')
        .single()
    : access.supabase
        .from('chapters')
        .insert(input)
        .select('id,novel_id,chapter_number,title,raw_text,translated_text,is_published,published_at,created_at,updated_at')
        .single()

  const result = await query
  if (result.error) devLog(id ? 'updateAdminChapter failed' : 'insertAdminChapter failed', result.error)
  return { ...result, error: explainDbError(result.error) }
}

export async function deleteAdminChapter(id: string) {
  const access = await requireAdminContentAccess()
  if (access.error) return { data: null, error: access.error }

  const result = await access.supabase.from('chapters').delete().eq('id', id)
  if (result.error) devLog('deleteAdminChapter failed', result.error)
  return { ...result, error: explainDbError(result.error) }
}

export async function uploadNovelCover(file: File, novelId?: string) {
  const access = await requireAdminContentAccess()
  if (access.error) {
    devLog('uploadNovelCover blocked before Supabase upload', access.error)
    return {
      publicUrl: null,
      error: access.error,
      message: access.error.message,
    }
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const folder = novelId || 'drafts'
  const path = `${folder}/cover-${Date.now()}.${extension}`

  const { error } = await access.supabase.storage
    .from('novel-covers')
    .upload(path, file, { upsert: true, cacheControl: '3600', contentType: file.type || undefined })

  if (error) {
    devLog('uploadNovelCover failed', error)
    const isPolicyError = error.message.toLowerCase().includes('row-level security') || error.message.toLowerCase().includes('not allowed')
    return {
      publicUrl: null,
      error,
      message: isPolicyError
        ? `${error.message} Your logged-in Supabase user must have role "admin" or "translator", and the novel-covers bucket/policies from the storage migration must exist.`
        : `${error.message} Create the novel-covers bucket in Supabase Storage and apply the storage policies if you have not already.`,
    }
  }

  const { data } = access.supabase.storage.from('novel-covers').getPublicUrl(path)
  return {
    publicUrl: data.publicUrl,
    error: null,
    message: null,
  }
}
