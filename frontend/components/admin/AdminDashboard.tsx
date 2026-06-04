'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  CheckCircle2,
  FilePenLine,
  Info,
  LayoutDashboard,
  Library,
  Plus,
  Save,
  ScrollText,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import {
  deleteAdminChapter,
  deleteAdminNovel,
  fetchAdminChapters,
  fetchAdminNovels,
  upsertAdminChapter,
  upsertAdminNovel,
  uploadNovelCover,
  type AdminDbChapter,
  type AdminDbNovel,
  type NovelStatus,
} from '@/lib/admin-supabase'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

type NovelForm = {
  title: string
  originalTitle: string
  author: string
  translator: string
  language: string
  status: NovelStatus
  synopsis: string
  coverUrl: string
  genres: string
}

type ChapterForm = {
  chapterNumber: number
  title: string
  rawText: string
  translatedText: string
}

const blankNovelForm: NovelForm = {
  title: '',
  originalTitle: '',
  author: '',
  translator: '',
  language: 'English',
  status: 'draft',
  synopsis: '',
  coverUrl: '',
  genres: '',
}

const blankChapterForm: ChapterForm = {
  chapterNumber: 1,
  title: '',
  rawText: '',
  translatedText: '',
}

const statusOptions: NovelStatus[] = ['draft', 'ongoing', 'completed', 'hiatus', 'dropped']
const originOptions = ['Chinese', 'Korean', 'Japanese', 'English', 'Other']

const sidebarItems = [
  { href: '#admin-overview', label: 'Overview', icon: LayoutDashboard },
  { href: '#admin-novels', label: 'Novels', icon: Library },
  { href: '#admin-editor', label: 'Novel editor', icon: FilePenLine },
  { href: '#admin-chapters', label: 'Chapters', icon: ScrollText },
]

function splitList(value: string) {
  return value.split(',').map(item => item.trim()).filter(Boolean)
}

function toNovelForm(novel: AdminDbNovel): NovelForm {
  return {
    title: novel.title,
    originalTitle: novel.original_title ?? '',
    author: novel.author ?? '',
    translator: novel.translator ?? '',
    language: novel.language ?? '',
    status: novel.status,
    synopsis: novel.synopsis ?? '',
    coverUrl: novel.cover_url ?? '',
    genres: novel.genres.join(', '),
  }
}

function toChapterForm(chapter: AdminDbChapter): ChapterForm {
  return {
    chapterNumber: chapter.chapter_number,
    title: chapter.title ?? '',
    rawText: chapter.raw_text ?? '',
    translatedText: chapter.translated_text ?? '',
  }
}
function toAdminMessage(error: { message?: string; details?: string } | null | undefined, fallback: string) {
  if (!error) return fallback
  return error.details ? `${error.message || fallback} ${error.details}` : error.message || fallback
}

export function AdminDashboard() {
  const [novels, setNovels] = useState<AdminDbNovel[]>([])
  const [chaptersByNovelId, setChaptersByNovelId] = useState<Record<string, AdminDbChapter[]>>({})
  const [selectedNovelId, setSelectedNovelId] = useState('')
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null)
  const [novelForm, setNovelForm] = useState<NovelForm>(blankNovelForm)
  const [chapterForm, setChapterForm] = useState<ChapterForm>(blankChapterForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingNovel, setIsSavingNovel] = useState(false)
  const [isSavingChapter, setIsSavingChapter] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isGuideOpen, setIsGuideOpen] = useState(false)

  const selectedNovel = novels.find(novel => novel.id === selectedNovelId) ?? null
  const selectedChapters = selectedNovel ? chaptersByNovelId[selectedNovel.id] ?? [] : []

  const stats = useMemo(() => {
    const chapters = Object.values(chaptersByNovelId).flat()
    return [
      { label: 'Uploaded novels', value: novels.length },
      { label: 'All chapters', value: chapters.length },
      { label: 'Published chapters', value: chapters.filter(chapter => chapter.is_published).length },
      { label: 'Draft chapters', value: chapters.filter(chapter => !chapter.is_published).length },
    ]
  }, [chaptersByNovelId, novels.length])

  const loadChapters = async (novelId: string) => {
    const { data, error } = await fetchAdminChapters(novelId)
    if (error) {
      setMessage(toAdminMessage(error, 'Admin request failed.'))
      return []
    }
    const chapters = (data ?? []) as AdminDbChapter[]
    setChaptersByNovelId(current => ({ ...current, [novelId]: chapters }))
    return chapters
  }

  const loadNovels = async () => {
    setIsLoading(true)
    setMessage('')
    const { data, error } = await fetchAdminNovels()
    if (error) {
      setMessage(toAdminMessage(error, 'Admin request failed.'))
      setIsLoading(false)
      return
    }

    const loadedNovels = (data ?? []) as AdminDbNovel[]
    setNovels(loadedNovels)

    const chapterEntries = await Promise.all(loadedNovels.map(async novel => [novel.id, await loadChapters(novel.id)] as const))
    setChaptersByNovelId(Object.fromEntries(chapterEntries))

    if (loadedNovels.length > 0 && !selectedNovelId) {
      setSelectedNovelId(loadedNovels[0].id)
      setNovelForm(toNovelForm(loadedNovels[0]))
      const firstChapters = chapterEntries.find(([id]) => id === loadedNovels[0].id)?.[1] ?? []
      setChapterForm({ ...blankChapterForm, chapterNumber: firstChapters.length + 1 })
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadNovels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectNovel = async (novel: AdminDbNovel) => {
    setSelectedNovelId(novel.id)
    setNovelForm(toNovelForm(novel))
    setEditingChapterId(null)
    const chapters = chaptersByNovelId[novel.id] ?? await loadChapters(novel.id)
    setChapterForm({ ...blankChapterForm, chapterNumber: chapters.length + 1 })
  }

  const resetNovelForm = () => {
    setSelectedNovelId('')
    setNovelForm(blankNovelForm)
    setEditingChapterId(null)
    setChapterForm(blankChapterForm)
    setMessage('')
  }

  const handleCoverUpload = async (file: File | null) => {
    if (!file) return
    setIsUploadingCover(true)
    setMessage('')

    try {
      const result = await uploadNovelCover(file, selectedNovelId || undefined)
      if (result.error || !result.publicUrl) {
        setMessage(result.message || toAdminMessage(result.error, 'Cover image could not be uploaded.'))
        return
      }
      setNovelForm(current => ({ ...current, coverUrl: result.publicUrl }))
      setMessage('Cover uploaded. Save the novel to keep this image.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Cover image could not be uploaded.')
    } finally {
      setIsUploadingCover(false)
    }
  }
  const saveNovel = async () => {
    if (!novelForm.title.trim()) {
      setMessage('Novel title is required.')
      return
    }

    setIsSavingNovel(true)
    setMessage('')
    const { data, error } = await upsertAdminNovel({
      title: novelForm.title.trim(),
      original_title: novelForm.originalTitle.trim() || null,
      author: novelForm.author.trim() || null,
      translator: novelForm.translator.trim() || null,
      language: novelForm.language.trim() || null,
      status: novelForm.status,
      synopsis: novelForm.synopsis.trim() || null,
      cover_url: novelForm.coverUrl.trim() || null,
      genres: splitList(novelForm.genres),
    }, selectedNovelId || undefined)

    setIsSavingNovel(false)

    if (error || !data) {
      setMessage(toAdminMessage(error, 'Novel could not be saved.'))
      return
    }

    const savedNovel = data as AdminDbNovel
    setNovels(current => current.some(novel => novel.id === savedNovel.id)
      ? current.map(novel => novel.id === savedNovel.id ? savedNovel : novel)
      : [savedNovel, ...current])
    setSelectedNovelId(savedNovel.id)
    setNovelForm(toNovelForm(savedNovel))
    setChaptersByNovelId(current => ({ ...current, [savedNovel.id]: current[savedNovel.id] ?? [] }))
    setMessage('Novel saved.')
  }

  const deleteNovel = async (novelId: string) => {
    setMessage('')
    const { error } = await deleteAdminNovel(novelId)
    if (error) {
      setMessage(toAdminMessage(error, 'Admin request failed.'))
      return
    }

    setNovels(current => current.filter(novel => novel.id !== novelId))
    setChaptersByNovelId(current => {
      const next = { ...current }
      delete next[novelId]
      return next
    })
    if (selectedNovelId === novelId) resetNovelForm()
    setMessage('Novel deleted.')
  }

  const editChapter = (chapter: AdminDbChapter) => {
    setEditingChapterId(chapter.id)
    setChapterForm(toChapterForm(chapter))
  }

  const resetChapterForm = () => {
    setEditingChapterId(null)
    setChapterForm({ ...blankChapterForm, chapterNumber: selectedChapters.length + 1 })
  }

  const saveChapter = async (publish: boolean) => {
    if (!selectedNovel) {
      setMessage('Select or save a novel before adding chapters.')
      return
    }

    if (!chapterForm.chapterNumber || chapterForm.chapterNumber < 1) {
      setMessage('Chapter number must be 1 or higher.')
      return
    }

    if (publish && !chapterForm.translatedText.trim()) {
      setMessage('English translation required before publishing.')
      return
    }

    setIsSavingChapter(true)
    setMessage('')
    const { data, error } = await upsertAdminChapter({
      novel_id: selectedNovel.id,
      chapter_number: Number(chapterForm.chapterNumber),
      title: chapterForm.title.trim() || null,
      raw_text: chapterForm.rawText.trim() || null,
      translated_text: chapterForm.translatedText.trim() || null,
      is_published: publish,
      published_at: publish ? new Date().toISOString() : null,
    }, editingChapterId || undefined)

    setIsSavingChapter(false)

    if (error || !data) {
      setMessage(toAdminMessage(error, 'Chapter could not be saved.'))
      return
    }

    const savedChapter = data as AdminDbChapter
    setChaptersByNovelId(current => {
      const chapters = current[selectedNovel.id] ?? []
      const updated = chapters.some(chapter => chapter.id === savedChapter.id)
        ? chapters.map(chapter => chapter.id === savedChapter.id ? savedChapter : chapter)
        : [...chapters, savedChapter]
      return { ...current, [selectedNovel.id]: updated.sort((a, b) => a.chapter_number - b.chapter_number) }
    })
    setEditingChapterId(null)
    setChapterForm({ ...blankChapterForm, chapterNumber: selectedChapters.length + 2 })
    setMessage(publish ? 'Chapter published.' : 'Chapter saved as draft.')
  }

  const deleteChapter = async (chapterId: string) => {
    if (!selectedNovel) return
    setMessage('')
    const { error } = await deleteAdminChapter(chapterId)
    if (error) {
      setMessage(toAdminMessage(error, 'Admin request failed.'))
      return
    }

    setChaptersByNovelId(current => ({
      ...current,
      [selectedNovel.id]: (current[selectedNovel.id] ?? []).filter(chapter => chapter.id !== chapterId),
    }))
    if (editingChapterId === chapterId) resetChapterForm()
    setMessage('Chapter deleted.')
  }

  return (
    <main className="min-h-screen pt-24 pb-12 silent-star-atmosphere">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
        <aside className="journal-card sticky top-24 hidden h-fit p-3 lg:block">
          <div className="px-3 py-3">
            <p className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>Silent Star</p>
            <h2 className="font-display text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Admin desk</h2>
          </div>
          <nav className="space-y-1">
            {sidebarItems.map(({ href, label, icon: Icon }) => (
              <a key={href} href={href} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--accent-dim)]" style={{ color: 'var(--text-secondary)' }}>
                <Icon size={15} />
                {label}
              </a>
            ))}
          </nav>
          <Link href="/" className="btn-outline mt-4 w-full justify-center">View site</Link>
        </aside>

        <div className="space-y-6">
          <section id="admin-overview" className="journal-card celestial-mark overflow-hidden p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="font-display text-4xl font-semibold" style={{ color: 'var(--text-primary)' }}>Silent Star admin</h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Add novels, store private original text, paste English translations, and publish only reader-ready chapters.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setIsGuideOpen(true)} className="btn-outline inline-flex items-center gap-2">
                  <Info size={15} /> Admin Guide
                </button>
                <button onClick={resetNovelForm} className="btn-primary inline-flex items-center gap-2">
                  <Plus size={15} /> Add novel
                </button>
              </div>
            </div>
            {message && <p className="mt-4 rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: 'var(--border)', color: 'var(--profile-accent)', background: 'var(--bg-base)' }}>{message}</p>}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(stat => (
                <div key={stat.label} className="rounded-2xl border p-4 frosted-panel" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                  <p className="mt-1 text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="admin-novels" className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]">
            <div className="journal-card p-5 sm:p-6">
              <div className="section-heading mb-4">
                <div>
                  <h2 className="section-title flex items-center gap-2"><Library size={17} /> Uploaded novels</h2>
                  <p className="section-subtitle mt-1">View, edit, or remove novels stored in Supabase.</p>
                </div>
              </div>
              {isLoading ? (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading novels...</p>
              ) : novels.length === 0 ? (
                <EmptyState icon={Upload} title="No novels uploaded yet" message="Add your first novel with a cover image, synopsis, genres, and publishing status." compact />
              ) : (
                <div className="space-y-2">
                  {novels.map(novel => (
                    <button
                      key={novel.id}
                      onClick={() => selectNovel(novel)}
                      className={cn('w-full rounded-2xl border p-3 text-left transition-all hover:-translate-y-0.5', selectedNovelId === novel.id && 'ring-2 ring-[var(--accent)]')}
                      style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
                    >
                      <div className="flex gap-3">
                        {novel.cover_url ? (
                          <img src={novel.cover_url} alt="" className="h-20 w-14 rounded-xl object-cover" />
                        ) : (
                          <div className="flex h-20 w-14 items-center justify-center rounded-xl frosted-panel"><BookOpen size={18} style={{ color: 'var(--accent)' }} /></div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{novel.title}</h3>
                            <span className="rounded-full px-2 py-0.5 text-[11px] capitalize" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>{novel.status}</span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{novel.synopsis || 'No synopsis added yet.'}</p>
                          <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>{chaptersByNovelId[novel.id]?.length ?? 0} chapters uploaded</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <section id="admin-editor" className="journal-card p-5 sm:p-6">
              <div className="section-heading mb-4">
                <div>
                  <h2 className="section-title flex items-center gap-2"><FilePenLine size={17} /> {selectedNovel ? 'Edit novel' : 'Add novel'}</h2>
                  <p className="section-subtitle mt-1">Saved directly to the Supabase novels table.</p>
                </div>
                {selectedNovel && (
                  <button onClick={() => deleteNovel(selectedNovel.id)} className="btn-ghost inline-flex items-center gap-2 text-sm">
                    <Trash2 size={14} /> Delete
                  </button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Title" value={novelForm.title} onChange={value => setNovelForm({ ...novelForm, title: value })} />
                <Field label="Original title" value={novelForm.originalTitle} onChange={value => setNovelForm({ ...novelForm, originalTitle: value })} />
                <Field label="Author" value={novelForm.author} onChange={value => setNovelForm({ ...novelForm, author: value })} />
                <Field label="Translator" value={novelForm.translator} onChange={value => setNovelForm({ ...novelForm, translator: value })} />
                                <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Origin
                  <select value={novelForm.language} onChange={event => setNovelForm({ ...novelForm, language: event.target.value })} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                    {originOptions.map(origin => <option key={origin} value={origin}>{origin}</option>)}
                  </select>
                </label>
                <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Cover image
                  <div className="mt-1 flex gap-2">
                    <input
                      type="text"
                      value={novelForm.coverUrl}
                      placeholder="Paste cover URL or upload"
                      onChange={event => setNovelForm({ ...novelForm, coverUrl: event.target.value })}
                      className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
                      style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    />
                    <label className="btn-outline inline-flex cursor-pointer items-center gap-2 px-3 text-sm">
                      <Upload size={14} />
                      {isUploadingCover ? 'Uploading...' : 'Upload'}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        disabled={isUploadingCover}
                        onChange={event => handleCoverUpload(event.target.files?.[0] ?? null)}
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>JPG, PNG, WEBP or GIF • Max 5 MB • Recommended 600×900 px</p>
                </div>
                <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Status
                  <select value={novelForm.status} onChange={event => setNovelForm({ ...novelForm, status: event.target.value as NovelStatus })} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                    {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
                <Field label="Genres" value={novelForm.genres} onChange={value => setNovelForm({ ...novelForm, genres: value })} placeholder="Fantasy, Romance" />
                <label className="sm:col-span-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Synopsis
                  <textarea value={novelForm.synopsis} onChange={event => setNovelForm({ ...novelForm, synopsis: event.target.value })} rows={5} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }} />
                </label>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={saveNovel} disabled={isSavingNovel || isUploadingCover} className="btn-primary inline-flex items-center gap-2 disabled:opacity-60"><Save size={14} /> {isSavingNovel ? 'Saving...' : 'Save novel'}</button>
              </div>
            </section>
          </section>

          <section id="admin-chapters" className="journal-card p-5 sm:p-6">
            <div className="section-heading mb-4">
              <div>
                <h2 className="section-title flex items-center gap-2"><ScrollText size={17} /> Chapters</h2>
                <p className="section-subtitle mt-1">Supports English-only upload, raw original plus English translation, or raw original draft. Readers only receive translated English text.</p>
              </div>
            </div>

            {!selectedNovel ? (
              <EmptyState icon={BookOpen} title="Select or add a novel first" message="Chapter tools will appear once a novel is selected or saved." compact />
            ) : (
              <div className="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(420px,1.15fr)]">
                <div>
                  <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{selectedNovel.title}</h3>
                  {selectedChapters.length === 0 ? (
                    <EmptyState icon={ScrollText} title="No chapters added yet" message="Save the first draft chapter, then publish it once translated English text is ready." compact />
                  ) : (
                    <div className="space-y-2">
                      {selectedChapters.map(chapter => (
                        <div key={chapter.id} className="rounded-2xl border p-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Chapter {chapter.chapter_number}: {chapter.title || 'Untitled'}</p>
                              <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{chapter.is_published ? 'Published' : 'Draft'} - {chapter.translated_text?.trim() ? 'translation ready' : 'no English translation'}</p>
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => editChapter(chapter)} className="btn-ghost p-2" aria-label="Edit chapter"><FilePenLine size={14} /></button>
                              <button onClick={() => deleteChapter(chapter.id)} className="btn-ghost p-2" aria-label="Delete chapter"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border p-4 frosted-panel" style={{ borderColor: 'var(--border)' }}>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{editingChapterId ? 'Edit chapter' : 'Add chapter'}</h3>
                    {editingChapterId && <button onClick={resetChapterForm} className="btn-ghost text-sm">New chapter</button>}
                  </div>
                  <div className="mb-4 grid gap-2 sm:grid-cols-3">
                    <div className="rounded-2xl border p-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>English-only</p>
                      <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>Paste English text and publish directly.</p>
                    </div>
                    <div className="rounded-2xl border p-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Raw + translation</p>
                      <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>Keep raw text private while publishing English.</p>
                    </div>
                    <div className="rounded-2xl border p-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Raw draft</p>
                      <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>Save raw text only until translation is ready.</p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Chapter number" type="number" value={String(chapterForm.chapterNumber)} onChange={value => setChapterForm({ ...chapterForm, chapterNumber: Number(value) })} />
                    <Field label="Title" value={chapterForm.title} onChange={value => setChapterForm({ ...chapterForm, title: value })} />
                    <label className="sm:col-span-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Raw original text (private)
                      <textarea value={chapterForm.rawText} onChange={event => setChapterForm({ ...chapterForm, rawText: event.target.value })} rows={7} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }} />
                      <span className="mt-1 block text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>Private translator workspace. Raw text is never shown on public reader pages.</span>
                    </label>
                    <label className="sm:col-span-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Translated English text (reader-visible)
                      <textarea value={chapterForm.translatedText} onChange={event => setChapterForm({ ...chapterForm, translatedText: event.target.value })} rows={9} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }} />
                      <span className="mt-1 block text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>English-only chapters can be published from this field alone. Publishing requires English translation.</span>
                    </label>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button onClick={() => saveChapter(false)} disabled={isSavingChapter} className="btn-outline inline-flex items-center gap-2 disabled:opacity-60"><Save size={14} /> Save draft</button>
                    <button onClick={() => saveChapter(true)} disabled={isSavingChapter || !chapterForm.translatedText.trim()} title={!chapterForm.translatedText.trim() ? 'English translation required before publishing.' : undefined} className="btn-primary inline-flex items-center gap-2 disabled:opacity-60"><CheckCircle2 size={14} /> Publish chapter</button>
                    <button onClick={() => setIsPreviewOpen(open => !open)} disabled={!chapterForm.translatedText.trim()} className="btn-outline inline-flex items-center gap-2 disabled:opacity-60"><BookOpen size={14} /> {isPreviewOpen ? 'Hide preview' : 'Preview English'}</button>
                  </div>
                  {!chapterForm.translatedText.trim() && <p className="mt-3 text-sm" style={{ color: 'var(--profile-accent)' }}>English translation required before publishing.</p>}
                  {isPreviewOpen && chapterForm.translatedText.trim() && (
                    <div className="mt-5 rounded-2xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>English chapter preview</p>
                      <h4 className="mt-2 font-display text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{chapterForm.title || `Chapter ${chapterForm.chapterNumber}`}</h4>
                      <div className="mt-4 max-h-80 space-y-4 overflow-auto pr-2 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
                        {chapterForm.translatedText.split(/\n\n+/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
      {isGuideOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto px-4 py-20" style={{ background: 'rgba(49,60,69,0.48)', backdropFilter: 'blur(8px)' }} onClick={event => { if (event.target === event.currentTarget) setIsGuideOpen(false) }}>
          <div className="journal-card w-full max-w-3xl p-5 sm:p-6 shadow-2xl animate-scale-in">
            <div className="flex items-start justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>Silent Star help</p>
                <h2 className="font-display text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Admin Guide</h2>
              </div>
              <button onClick={() => setIsGuideOpen(false)} className="btn-ghost p-2" aria-label="Close admin guide">
                <X size={17} />
              </button>
            </div>

            <div className="mt-5 grid gap-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <GuideSection title="1. Add Novel" items={[
                'Create a novel first.',
                'Upload a cover image (optional).',
                'Fill in title, author, translator, genres and synopsis.',
              ]}>
                <p className="mt-2 font-semibold" style={{ color: 'var(--text-primary)' }}>Set status:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Draft = hidden from readers.</li>
                  <li>• Ongoing = visible to readers.</li>
                  <li>• Completed = visible and marked completed.</li>
                  <li>• Hiatus = visible but on hiatus.</li>
                  <li>• Dropped = visible but marked dropped.</li>
                </ul>
              </GuideSection>

              <GuideSection title="2. Add Chapters" items={[
                'Open Chapter Editor.',
                'Select the novel.',
                'Add chapter number and title.',
                'Paste English translation into "Translated English Text".',
                'Raw text is optional and remains private.',
              ]} />

              <GuideSection title="3. Publishing Rules" items={[
                'Readers only see English translations.',
                'Draft chapters are hidden.',
                'Draft novels are hidden.',
                'Published chapters appear in Recently Updated.',
              ]} />

              <GuideSection title="4. Images">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border p-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Cover images</p>
                    <p>JPG, PNG, WEBP or GIF.</p>
                    <p>Max 5 MB.</p>
                    <p>Recommended 600×900 px.</p>
                  </div>
                  <div className="rounded-2xl border p-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Avatars</p>
                    <p>JPG, PNG, WEBP or GIF.</p>
                    <p>Max 2 MB.</p>
                  </div>
                </div>
              </GuideSection>

              <GuideSection title="5. Future Features" items={[
                'Reader progress, bookmarks and reading statistics are stored automatically.',
              ]} />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function GuideSection({ title, items, children }: { title: string; items?: string[]; children?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border p-4 frosted-panel" style={{ borderColor: 'var(--border)' }}>
      <h3 className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      {items && (
        <ul className="mt-2 space-y-1">
          {items.map(item => <li key={item}>- {item}</li>)}
        </ul>
      )}
      {children}
    </section>
  )
}
function Field({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
      {label}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
      />
    </label>
  )
}











