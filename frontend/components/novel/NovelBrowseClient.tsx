'use client'

import { useState, useMemo } from 'react'
import {
  Search, SlidersHorizontal, Grid3X3, List, X, BookOpen,
  ChevronDown, Flame, Star, Clock, Zap, TrendingUp,
} from 'lucide-react'
import type { Novel } from '@/lib/mock-data'
import { NovelCard } from './NovelCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

const GENRES  = ['All','Action','Romance','Fantasy','Mystery','Comedy','Sci-Fi','Martial Arts','Slice of Life']
const ORIGINS = ['All','Chinese','Korean','Japanese']
const STATUSES= ['All','Ongoing','Completed','Hiatus']
const SORTS   = [
  { value: 'trending', label: 'Trending',        icon: Flame      },
  { value: 'rating',   label: 'Top Rated',        icon: Star       },
  { value: 'updated',  label: 'Recently Updated', icon: Clock      },
  { value: 'views',    label: 'Most Read',         icon: TrendingUp },
  { value: 'new',      label: 'New Arrivals',      icon: Zap        },
]

export function NovelBrowseClient({ novels }: { novels: Novel[] }) {
  const [query,       setQuery]       = useState('')
  const [genre,       setGenre]       = useState('All')
  const [origin,      setOrigin]      = useState('All')
  const [status,      setStatus]      = useState('All')
  const [sort,        setSort]        = useState('trending')
  const [viewMode,    setViewMode]    = useState<'grid' | 'list'>('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo<Novel[]>(() => {
    let list = [...novels]
    if (query)             list = list.filter(n => n.title.toLowerCase().includes(query.toLowerCase()) || n.authorName.toLowerCase().includes(query.toLowerCase()))
    if (genre  !== 'All')  list = list.filter(n => n.genres.includes(genre))
    if (origin !== 'All')  list = list.filter(n => n.origin === origin.toLowerCase())
    if (status !== 'All')  list = list.filter(n => n.status === status.toLowerCase())
    if (sort === 'rating')  list.sort((a, b) => b.averageRating - a.averageRating)
    if (sort === 'views')   list.sort((a, b) => Number(b.totalViews) - Number(a.totalViews))
    if (sort === 'trending')list.sort((a, b) => b.weeklyViews - a.weeklyViews)
    if (sort === 'new')     list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    if (sort === 'updated') list.sort((a, b) => new Date(b.lastChapterAt).getTime() - new Date(a.lastChapterAt).getTime())
    return list
  }, [query, genre, origin, status, sort, novels])

  const activeFilters = [
    genre  !== 'All' && genre,
    origin !== 'All' && origin,
    status !== 'All' && status,
  ].filter(Boolean) as string[]

  const clearAll = () => { setGenre('All'); setOrigin('All'); setStatus('All') }

  return (
    <div className="min-h-screen pt-16 page-enter">
      {/* Page header */}
      <div className="border-b py-7" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-semibold mb-0.5"
            style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Browse Novels
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {novels.length} titles - Updated daily
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-2.5 mb-5">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search titles, authors"
              className="w-full pl-8 pr-8 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X size={13} style={{ color: 'var(--text-muted)' }} />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <SortDropdown value={sort} onChange={setSort} />

          {/* Filters toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={cn('flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all border',
              filtersOpen ? 'bg-profile-mauve border-profile-mauve text-white' : 'btn-outline')}
          >
            <SlidersHorizontal size={13} />
            Filters
            {activeFilters.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-profile-mauve text-[9px] font-bold flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* View toggle */}
          <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
            {(['grid', 'list'] as const).map(v => (
              <button key={v} onClick={() => setViewMode(v)}
                className="px-3 py-2.5 transition-colors"
                style={{ background: viewMode === v ? 'var(--accent-dim)' : 'var(--bg-elevated)', color: viewMode === v ? 'var(--accent)' : 'var(--text-muted)' }}>
                {v === 'grid' ? <Grid3X3 size={14} /> : <List size={14} />}
              </button>
            ))}
          </div>
        </div>

        {/* Filter panel */}
        {filtersOpen && (
          <div className="rounded-2xl p-5 mb-5 border animate-fade-in"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
            <div className="grid sm:grid-cols-3 gap-5">
              <FilterGroup label="Genre"  options={GENRES}   value={genre}  onChange={setGenre}  />
              <FilterGroup label="Origin" options={ORIGINS}  value={origin} onChange={setOrigin} />
              <FilterGroup label="Status" options={STATUSES} value={status} onChange={setStatus} />
            </div>
            {activeFilters.length > 0 && (
              <button onClick={clearAll}
                className="mt-4 flex items-center gap-1 text-xs font-medium transition-colors hover:text-profile-mauve"
                style={{ color: 'var(--text-muted)' }}>
                <X size={11} /> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Active chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map(f => (
              <span key={f} className="tag-pill flex items-center gap-1">
                {f}
                <button onClick={() => {
                  if (GENRES.includes(f))  setGenre('All')
                  if (ORIGINS.includes(f)) setOrigin('All')
                  if (STATUSES.includes(f))setStatus('All')
                }}>
                  <X size={9} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Result count */}
        <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
          {query ? `${filtered.length} results for "${query}"` : `${filtered.length} novels`}
        </p>

        {/* Grid / list */}
        {filtered.length === 0 ? (
          novels.length === 0 ? (
            <EmptyState icon={BookOpen} title="No novels added yet" message="Upload novels from the admin dashboard and they will appear here as a searchable winter catalogue." actionLabel="Start your first reading journey" actionHref="/profile" />
          ) : (
            <EmptyState icon={Search} title="No novels found" message="Try adjusting your filters or clearing the search to find another story." />
          )
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 stagger-children">
            {filtered.map(n => <NovelCard key={n.id} novel={n} />)}
          </div>
        ) : (
          <div className="space-y-0.5">
            {filtered.map((n, i) => <NovelCard key={n.id} novel={n} variant="horizontal" rank={i + 1} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterGroup({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map(o => (
          <button key={o} onClick={() => onChange(o)}
            className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
            style={{ background: value === o ? 'var(--accent)' : 'var(--bg-muted)', color: value === o ? 'white' : 'var(--text-secondary)' }}>
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

function SortDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const cur = SORTS.find(s => s.value === value)!

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="btn-outline flex items-center gap-2 px-3.5 py-2.5 text-sm">
        <cur.icon size={13} style={{ color: 'var(--accent)' }} />
        {cur.label}
        <ChevronDown size={12} className={cn('transition-transform', open && 'rotate-180')} style={{ color: 'var(--text-muted)' }} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-48 rounded-2xl py-1.5 z-20 shadow-xl border animate-scale-in"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
            {SORTS.map(({ value: v, label, icon: Icon }) => (
              <button key={v} onClick={() => { onChange(v); setOpen(false) }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-muted)]"
                style={{ color: v === value ? 'var(--accent)' : 'var(--text-secondary)', background: v === value ? 'var(--accent-dim)' : 'transparent' }}>
                <Icon size={13} />{label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}




