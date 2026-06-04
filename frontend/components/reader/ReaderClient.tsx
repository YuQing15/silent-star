'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft, ChevronRight, List, Bookmark,
  BookOpen, Home, Minus, Plus,
  ArrowUp, Check, Type,
} from 'lucide-react'
import type { Chapter, Novel } from '@/lib/mock-data'
import { cn, clamp, formatDate } from '@/lib/utils'
import { useReadingProgress } from '@/hooks/useReadingProgress'
import { saveChapterReadingProgress, setNovelBookmark } from '@/lib/user-reading'
import { TableOfContents } from './TableOfContents'

interface Props { chapter: Chapter; novel: Novel; allChapters: Chapter[] }

type Theme = 'light' | 'sepia' | 'dark' | 'snow' | 'starry'
type FontChoice = 'serif' | 'sans' | 'literata'
type LayoutMode = 'narrow' | 'wide'

const THEMES: { id: Theme; label: string; bg: string; text: string; accent: string }[] = [
  { id: 'light',  label: 'Light',  bg: '#fffdf8', text: '#1f1b16', accent: '#778ca4' },
  { id: 'sepia',  label: 'Sepia',  bg: '#f4ead7', text: '#2f2518', accent: '#a86f3d' },
  { id: 'dark',   label: 'Dark',   bg: '#111827', text: '#d5dbe2', accent: '#8fa9c1' },
  { id: 'snow',   label: 'Snow',   bg: 'linear-gradient(160deg,#f7fbfd 0%,#e7eff5 46%,#d5dfe8 100%)', text: '#263440', accent: '#778ca4' },
  { id: 'starry', label: 'Starry', bg: 'radial-gradient(circle at 18% 8%,#263747 0%,#162432 34%,#0d1621 100%)', text: '#d5dbe2', accent: '#9eb4c8' },
]

const FONT_OPTIONS: { id: FontChoice; label: string; family: string }[] = [
  { id: 'serif', label: 'Serif', family: "'Lora', Georgia, serif" },
  { id: 'sans', label: 'Sans', family: "'DM Sans', system-ui, sans-serif" },
  { id: 'literata', label: 'Literata', family: "'Literata', 'Lora', Georgia, serif" },
]

export function ReaderClient({ chapter, novel, allChapters }: Props) {
  const router = useRouter()

  const [theme, setTheme] = useState<Theme>('starry')
  const [fontSize, setFontSize] = useState(18)
  const [lineHeight, setLineH] = useState(1.85)
  const [font, setFont] = useState<FontChoice>('serif')
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('narrow')
  const [wideWidth, setWideWidth] = useState(900)

  const [settingsOpen, setSettings] = useState(false)
  const [tocOpen, setToc] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [barsVisible, setBars] = useState(true)
  const [showTop, setShowTop] = useState(false)
  const [done, setDone] = useState(false)

  const { progress } = useReadingProgress()
  const lastSavedProgress = useRef(0)
  const latestProgress = useRef(0)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const t = THEMES.find(x => x.id === theme)!
  const fontFace = FONT_OPTIONS.find(option => option.id === font)?.family ?? FONT_OPTIONS[0].family
  const readerWidth = layoutMode === 'wide' ? '' : 'max-w-2xl'
  const readerStyle = layoutMode === 'wide' ? { maxWidth: `${wideWidth}px` } : undefined

  useEffect(() => {
    let lastY = 0
    let timer: ReturnType<typeof setTimeout>
    const fn = () => {
      const y = window.scrollY
      setShowTop(y > 500)
      if (y - lastY > 6 && y > 120) setBars(false)
      if (lastY - y > 6) setBars(true)
      lastY = y
      clearTimeout(timer)
      timer = setTimeout(() => setBars(true), 2000)
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => { window.removeEventListener('scroll', fn); clearTimeout(timer) }
  }, [])

  useEffect(() => { latestProgress.current = progress; if (progress > 92) setDone(true) }, [progress])
  useEffect(() => {
    void saveChapterReadingProgress(novel.id, chapter.id, chapter.chapterNumber, 1)
  }, [chapter.chapterNumber, chapter.id, novel.id])

  useEffect(() => {
    const saveLatest = () => {
      void saveChapterReadingProgress(novel.id, chapter.id, chapter.chapterNumber, latestProgress.current)
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') saveLatest()
    }
    window.addEventListener('pagehide', saveLatest)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      saveLatest()
      window.removeEventListener('pagehide', saveLatest)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [chapter.chapterNumber, chapter.id, novel.id])

  useEffect(() => {
    if (progress < 5) return
    const delta = Math.abs(progress - lastSavedProgress.current)
    if (delta < 5 && progress < 92) return

    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      lastSavedProgress.current = progress
      void saveChapterReadingProgress(novel.id, chapter.id, chapter.chapterNumber, progress)
    }, 700)

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [chapter.chapterNumber, chapter.id, novel.id, progress])

  const toggleReaderBookmark = async () => {
    const next = !bookmarked
    setBookmarked(next)
    const result = await setNovelBookmark(novel.id, next)
    if (result.error || result.requiresLogin) setBookmarked(!next)
  }

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowRight' && chapter.nextChapter)
        router.push(`/novels/${novel.slug}/chapters/${chapter.nextChapter}`)
      if (e.key === 'ArrowLeft' && chapter.prevChapter)
        router.push(`/novels/${novel.slug}/chapters/${chapter.prevChapter}`)
      if (e.key === 's') { setSettings(s => !s); setToc(false) }
      if (e.key === 't') { setToc(s => !s); setSettings(false) }
      if (e.key === 'Escape') { setSettings(false); setToc(false) }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [chapter, novel.slug, router])

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem('lum-reader') || '{}')
      if (p.theme && THEMES.some(item => item.id === p.theme)) setTheme(p.theme)
      if (p.fontSize) setFontSize(p.fontSize)
      if (p.lineH) setLineH(p.lineH)
      if (p.font && FONT_OPTIONS.some(item => item.id === p.font)) setFont(p.font)
      if (p.layoutMode === 'narrow' || p.layoutMode === 'wide') setLayoutMode(p.layoutMode)
      if (p.wideWidth) setWideWidth(clamp(Number(p.wideWidth), 720, 1200))
      if (!p.font && typeof p.serif === 'boolean') setFont(p.serif ? 'serif' : 'sans')
    } catch {}
  }, [])

  const save = useCallback((patch: object) => {
    try {
      const prev = JSON.parse(localStorage.getItem('lum-reader') || '{}')
      localStorage.setItem('lum-reader', JSON.stringify({ ...prev, ...patch }))
    } catch {}
  }, [])

  const paragraphs = chapter.content.split(/\n\n+/).filter(Boolean)

  return (
    <div
      className="relative min-h-screen overflow-hidden transition-colors duration-300"
      style={{ background: t.bg, color: t.text }}
      onClick={() => { if (settingsOpen) setSettings(false); if (tocOpen) setToc(false) }}
    >
      <ReaderAtmosphere theme={theme} />

      <div className="fixed top-0 left-0 right-0 z-50 h-0.5" style={{ background: `${t.text}12` }}>
        <div
          className="h-full transition-all duration-150"
          style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${t.accent}, ${t.accent}cc)` }}
        />
      </div>

      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          barsVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        )}
        style={{
          background: `${solidPanelColor(theme)}ee`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${t.text}12`,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className={cn('flex items-center justify-between px-4 h-14 mx-auto', readerWidth)} style={readerStyle}>
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href={`/novels/${novel.slug}`}
              className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 transition-colors"
              style={{ background: `${t.text}0e` }}
            >
              <ChevronLeft size={17} style={{ color: t.text }} />
            </Link>
            <div className="hidden sm:block min-w-0">
              <p className="text-xs truncate" style={{ color: `${t.text}55` }}>{novel.title}</p>
              <p className="text-sm font-semibold truncate" style={{ color: t.text }}>
                Ch.{chapter.chapterNumber} — {chapter.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span
              className="hidden sm:block text-xs font-medium px-2 py-1 rounded-full"
              style={{ background: `${t.text}0e`, color: `${t.text}60` }}
            >
              {Math.round(progress)}%
            </span>

            <RdrBtn
              active={bookmarked}
              text={t.text}
              accent={t.accent}
              onClick={e => { e.stopPropagation(); void toggleReaderBookmark() }}
              title="Bookmark"
            >
              <Bookmark size={16} />
            </RdrBtn>

            <RdrBtn
              text={t.text}
              accent={t.accent}
              onClick={e => { e.stopPropagation(); setToc(s => !s); setSettings(false) }}
              title="Contents (T)"
            >
              <List size={16} />
            </RdrBtn>

            <RdrBtn
              text={t.text}
              accent={t.accent}
              active={settingsOpen}
              onClick={e => { e.stopPropagation(); setSettings(s => !s); setToc(false) }}
              title="Settings (S)"
            >
              <Type size={15} />
            </RdrBtn>
          </div>
        </div>
      </header>

      {settingsOpen && (
        <div
          className="fixed top-16 right-4 z-50 w-80 rounded-2xl shadow-2xl border p-4 space-y-5 animate-scale-in"
          style={{ background: solidPanelColor(theme), borderColor: `${t.text}16`, color: t.text }}
          onClick={e => e.stopPropagation()}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: `${t.text}55` }}>Font Size</span>
              <span className="text-xs font-mono" style={{ color: t.accent }}>{fontSize}px</span>
            </div>
            <div className="flex items-center gap-2">
              <Stepper text={t.text} onClick={() => { const v = clamp(fontSize - 1, 14, 26); setFontSize(v); save({ fontSize: v }) }}><Minus size={12}/></Stepper>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: `${t.text}15` }}>
                <div className="h-full rounded-full" style={{ background: t.accent, width: `${((fontSize - 14) / 12) * 100}%`, transition: 'width 0.2s' }} />
              </div>
              <Stepper text={t.text} onClick={() => { const v = clamp(fontSize + 1, 14, 26); setFontSize(v); save({ fontSize: v }) }}><Plus size={12}/></Stepper>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: `${t.text}55` }}>Line Height</span>
              <span className="text-xs font-mono" style={{ color: t.accent }}>{lineHeight.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Stepper text={t.text} onClick={() => { const v = parseFloat(clamp(lineHeight - 0.1, 1.4, 2.4).toFixed(1)); setLineH(v); save({ lineH: v }) }}><Minus size={12}/></Stepper>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: `${t.text}15` }}>
                <div className="h-full rounded-full" style={{ background: t.accent, width: `${((lineHeight - 1.4) / 1) * 100}%`, transition: 'width 0.2s' }} />
              </div>
              <Stepper text={t.text} onClick={() => { const v = parseFloat(clamp(lineHeight + 0.1, 1.4, 2.4).toFixed(1)); setLineH(v); save({ lineH: v }) }}><Plus size={12}/></Stepper>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wide block mb-2" style={{ color: `${t.text}55` }}>Layout</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Mobile / Narrow', value: 'narrow' as LayoutMode },
                { label: 'Desktop / Wide', value: 'wide' as LayoutMode },
              ].map(({ label, value }) => (
                <button key={value} onClick={() => { setLayoutMode(value); save({ layoutMode: value }) }}
                  className="py-2 px-2 rounded-xl text-xs font-medium transition-all"
                  style={{ background: layoutMode === value ? t.accent : `${t.text}0e`, color: layoutMode === value ? 'white' : t.text }}>
                  {label}
                </button>
              ))}
            </div>
            {layoutMode === 'wide' && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: `${t.text}55` }}>Reading Width</span>
                  <span className="text-xs font-mono" style={{ color: t.accent }}>{wideWidth}px</span>
                </div>
                <input
                  type="range"
                  min={720}
                  max={1200}
                  step={20}
                  value={wideWidth}
                  onChange={event => {
                    const value = clamp(Number(event.target.value), 720, 1200)
                    setWideWidth(value)
                    save({ wideWidth: value })
                  }}
                  className="w-full accent-[var(--profile-accent)]"
                  aria-label="Reading width"
                />
              </div>
            )}
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wide block mb-2" style={{ color: `${t.text}55` }}>Font</span>
            <div className="grid grid-cols-3 gap-2">
              {FONT_OPTIONS.map(option => (
                <button key={option.id} onClick={() => { setFont(option.id); save({ font: option.id }) }}
                  className="py-2 rounded-xl text-xs font-medium transition-all"
                  style={{
                    background: font === option.id ? t.accent : `${t.text}0e`,
                    color: font === option.id ? 'white' : t.text,
                    fontFamily: option.family,
                  }}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wide block mb-2" style={{ color: `${t.text}55` }}>Theme</span>
            <div className="grid grid-cols-5 gap-1.5">
              {THEMES.map(th => (
                <button
                  key={th.id}
                  onClick={() => { setTheme(th.id); save({ theme: th.id }) }}
                  title={th.label}
                  className="relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
                  style={{
                    background: th.bg,
                    border: `2px solid ${theme === th.id ? th.accent : 'transparent'}`,
                    boxShadow: theme === th.id ? `0 0 0 1px ${th.accent}` : 'none',
                  }}
                >
                  <div className="w-full h-4 rounded" style={{ background: `${th.text}20` }} />
                  <span className="text-[9px] font-medium" style={{ color: th.text, whiteSpace: 'nowrap' }}>{th.label}</span>
                  {theme === th.id && (
                    <div className="absolute top-1 right-1 w-3 h-3 rounded-full flex items-center justify-center" style={{ background: th.accent }}>
                      <Check size={7} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <TableOfContents
        open={tocOpen}
        onClose={() => setToc(false)}
        allChapters={allChapters}
        currentChapter={chapter.chapterNumber}
        novelSlug={novel.slug}
        bg={solidPanelColor(theme)}
        text={t.text}
        accent={t.accent}
      />

      <main
        className={cn(readerWidth, 'relative z-10 mx-auto px-5 sm:px-8 pt-24 pb-28')}
        style={readerStyle}
        onClick={() => { setSettings(false); setToc(false) }}
      >
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.accent }}>
            Chapter {chapter.chapterNumber}
          </p>
          <h1
            className="font-semibold leading-tight mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
              color: t.text,
              letterSpacing: '-0.01em',
            }}
          >
            {chapter.title}
          </h1>
          <div className="h-px w-20 mx-auto mb-4" style={{ background: `linear-gradient(90deg, transparent, ${t.text}25, transparent)` }} />
          <div className="flex items-center justify-center gap-4 text-xs" style={{ color: `${t.text}45` }}>
            <span>{chapter.wordCount.toLocaleString()} words</span>
            <span>·</span>
            <span>~{chapter.estimatedReadMinutes} min read</span>
            <span>·</span>
            <span>{formatDate(chapter.publishedAt)}</span>
          </div>
        </div>

        <div style={{ fontFamily: fontFace, fontSize: `${fontSize}px`, lineHeight, color: t.text }}>
          {paragraphs.map((para, i) => {
            if (para.startsWith('[') && para.endsWith(']')) {
              return (
                <div key={i} className="my-7 mx-auto max-w-sm p-4 rounded-xl text-center text-sm font-medium"
                  style={{ background: `${t.accent}12`, border: `1px solid ${t.accent}22`, color: t.accent, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.01em' }}>
                  {para}
                </div>
              )
            }
            if (para.startsWith('*') && para.endsWith('*')) {
              return (
                <p key={i} className="my-6 text-center italic" style={{ fontFamily: fontFace, fontSize: `${fontSize}px`, lineHeight, color: `${t.text}75` }}>
                  {para.slice(1, -1)}
                </p>
              )
            }
            if (i === 0) {
              return (
                <p key={i} className="mb-5" style={{ fontFamily: fontFace, fontSize: `${fontSize}px`, lineHeight, color: t.text }}>
                  <span style={{
                    float: 'left',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: `${fontSize * 3.6}px`,
                    lineHeight: '0.76',
                    paddingRight: '0.08em',
                    marginTop: '0.06em',
                    color: t.accent,
                    fontWeight: 600,
                  }}>
                    {para[0]}
                  </span>
                  {para.slice(1)}
                </p>
              )
            }
            return (
              <p key={i} className="mb-5" style={{ fontFamily: fontFace, fontSize: `${fontSize}px`, lineHeight, color: t.text }}>
                {para}
              </p>
            )
          })}
        </div>

        {chapter.translatorNote && (
          <div className="mt-10 p-4 rounded-2xl text-sm leading-relaxed" style={{ background: `${t.text}06`, border: `1px solid ${t.text}0e`, color: `${t.text}65` }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: t.accent }}>
              Translator's Note
            </p>
            {chapter.translatorNote}
          </div>
        )}

        <div className="mt-14 text-center">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px" style={{ background: `${t.text}12` }} />
            <span className="text-xs" style={{ color: `${t.text}35` }}>— End of Chapter {chapter.chapterNumber} —</span>
            <div className="flex-1 h-px" style={{ background: `${t.text}12` }} />
          </div>

          {done && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in" style={{ background: 'rgba(16,185,129,0.14)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
              <Check size={13} /> Chapter complete!
            </div>
          )}

          <div className="flex items-center justify-center gap-3 flex-wrap">
            {chapter.prevChapter && (
              <Link href={`/novels/${novel.slug}/chapters/${chapter.prevChapter}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
                style={{ background: `${t.text}0e`, color: t.text, border: `1px solid ${t.text}14` }}>
                <ChevronLeft size={15} />Previous
              </Link>
            )}
            {chapter.nextChapter ? (
              <Link href={`/novels/${novel.slug}/chapters/${chapter.nextChapter}`}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg,${t.accent},${t.accent}cc)`, boxShadow: `0 4px 14px ${t.accent}30` }}>
                Next Chapter <ChevronRight size={15} />
              </Link>
            ) : (
              <Link href={`/novels/${novel.slug}`}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{ background: `${t.text}0e`, color: t.text }}>
                <BookOpen size={14} />Back to Novel
              </Link>
            )}
          </div>
        </div>

      </main>

      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-40 transition-all duration-300',
          barsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        )}
        style={{
          background: `${solidPanelColor(theme)}ee`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: `1px solid ${t.text}10`,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className={cn('flex items-center mx-auto px-4 h-16 gap-3', readerWidth)} style={readerStyle}>
          {chapter.prevChapter ? (
            <Link href={`/novels/${novel.slug}/chapters/${chapter.prevChapter}`}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium flex-1 justify-center"
              style={{ background: `${t.text}0e`, color: t.text }}>
              <ChevronLeft size={14} />
              <span className="hidden sm:inline">Ch.{chapter.prevChapter}</span>
              <span className="sm:hidden">Prev</span>
            </Link>
          ) : (
            <Link href={`/novels/${novel.slug}`}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium flex-1 justify-center"
              style={{ background: `${t.text}0e`, color: t.text }}>
              <Home size={14} />
              <span className="hidden sm:inline">Novel</span>
            </Link>
          )}

          <div className="flex flex-col items-center gap-1 flex-shrink-0 w-14">
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: `${t.text}14` }}>
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: t.accent }} />
            </div>
            <span className="text-[10px]" style={{ color: `${t.text}40` }}>{Math.round(progress)}%</span>
          </div>

          {chapter.nextChapter ? (
            <Link href={`/novels/${novel.slug}/chapters/${chapter.nextChapter}`}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold flex-1 justify-center text-white"
              style={{ background: `linear-gradient(135deg,${t.accent},${t.accent}bb)` }}>
              <span className="hidden sm:inline">Ch.{chapter.nextChapter}</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight size={14} />
            </Link>
          ) : (
            <Link href={`/novels/${novel.slug}`}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold flex-1 justify-center text-white"
              style={{ background: `linear-gradient(135deg,${t.accent},${t.accent}bb)` }}>
              <BookOpen size={14} />Finished
            </Link>
          )}
        </div>
      </div>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-4 z-40 w-10 h-10 rounded-full flex items-center justify-center shadow-lg animate-fade-in transition-transform hover:scale-110"
          style={{ background: t.accent, color: 'white' }}
        >
          <ArrowUp size={16} />
        </button>
      )}
    </div>
  )
}

function solidPanelColor(theme: Theme) {
  if (theme === 'snow') return '#f0f6fa'
  if (theme === 'starry') return '#111d2a'
  return THEMES.find(item => item.id === theme)?.bg ?? '#ffffff'
}

function ReaderAtmosphere({ theme }: { theme: Theme }) {
  if (theme === 'starry') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-75"
        style={{
          backgroundImage: 'radial-gradient(circle at 12% 18%, rgba(213,219,226,0.75) 0 1px, transparent 1.8px), radial-gradient(circle at 72% 12%, rgba(213,219,226,0.55) 0 1px, transparent 1.7px), radial-gradient(circle at 84% 62%, rgba(213,219,226,0.45) 0 1px, transparent 1.6px), radial-gradient(circle at 28% 76%, rgba(143,169,193,0.45) 0 1px, transparent 1.8px), radial-gradient(circle at 76% 24%, rgba(158,180,200,0.14), transparent 16%)',
          backgroundSize: '220px 220px, 280px 280px, 240px 240px, 320px 320px, 100% 100%',
        }}
      />
    )
  }

  if (theme === 'snow') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-80"
        style={{
          backgroundImage: 'radial-gradient(circle at 18% 20%, rgba(255,255,255,0.85) 0 1.2px, transparent 2px), radial-gradient(circle at 68% 18%, rgba(119,140,164,0.18) 0 1px, transparent 2px), radial-gradient(circle at 78% 72%, rgba(255,255,255,0.75) 0 1.4px, transparent 2.4px), linear-gradient(135deg, rgba(255,255,255,0.34), transparent 42%)',
          backgroundSize: '180px 180px, 260px 260px, 220px 220px, 100% 100%',
        }}
      />
    )
  }

  return null
}

function RdrBtn({ children, active, text, accent, onClick, title }: {
  children: React.ReactNode; active?: boolean; text: string; accent: string; onClick: (e: React.MouseEvent) => void; title?: string
}) {
  return (
    <button onClick={onClick} title={title}
      className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
      style={{ background: active ? `${accent}22` : `${text}0e`, color: active ? accent : text }}>
      {children}
    </button>
  )
}

function Stepper({ children, text, onClick }: { children: React.ReactNode; text: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors flex-shrink-0"
      style={{ background: `${text}0e`, color: text }}>
      {children}
    </button>
  )
}




