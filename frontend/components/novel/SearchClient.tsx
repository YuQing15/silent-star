'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, X, TrendingUp, Clock, ArrowUpRight } from 'lucide-react'
import { useDebounce } from 'use-debounce'
import type { Novel } from '@/lib/mock-data'
import { NovelCard } from './NovelCard'

const TRENDING = ['Cultivation', 'Villainess', 'Apocalypse', 'System', 'Regression', 'Academy']

export function SearchClient({ novels }: { novels: Novel[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState(searchParams?.get('q') ?? '')
  const [recent, setRecent] = useState<string[]>([])
  const [debouncedQ] = useDebounce(query, 220)

  useEffect(() => {
    inputRef.current?.focus()
    try { setRecent(JSON.parse(localStorage.getItem('lum-searches') || '[]')) } catch {}
  }, [])

  useEffect(() => {
    if (debouncedQ.trim()) {
      router.replace(`/search?q=${encodeURIComponent(debouncedQ.trim())}`, { scroll: false })
    } else {
      router.replace('/search', { scroll: false })
    }
  }, [debouncedQ, router])

  const saveSearch = (q: string) => {
    const next = [q, ...recent.filter(r => r !== q)].slice(0, 6)
    setRecent(next)
    try { localStorage.setItem('lum-searches', JSON.stringify(next)) } catch {}
  }

  const results = debouncedQ.length > 1
    ? novels.filter(n =>
        n.title.toLowerCase().includes(debouncedQ.toLowerCase()) ||
        n.authorName.toLowerCase().includes(debouncedQ.toLowerCase()) ||
        n.genres.some(g => g.toLowerCase().includes(debouncedQ.toLowerCase())) ||
        n.tags.some(t => t.toLowerCase().includes(debouncedQ.toLowerCase())) ||
        n.origin.includes(debouncedQ.toLowerCase())
      )
    : []

  return (
    <div className="min-h-screen pt-16 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="sticky top-16 pt-5 pb-3 z-20" style={{ background: 'var(--bg-base)' }}>
          <div className="relative">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && query.trim()) saveSearch(query.trim()) }}
              placeholder="Novels, authors, genres, tags"
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl text-base outline-none transition-all"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '2px solid var(--border)' }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)' }}>
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {!debouncedQ && (
          <div className="pt-4 space-y-8">
            {recent.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                    <Clock size={11} /> Recent
                  </h3>
                  <button onClick={() => { setRecent([]); localStorage.removeItem('lum-searches') }} className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recent.map(q => (
                    <button key={q} onClick={() => { setQuery(q); saveSearch(q) }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-colors hover:border-profile-mauve" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                      <Clock size={11} style={{ color: 'var(--text-muted)' }} />{q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-3" style={{ color: 'var(--text-muted)' }}>
                <TrendingUp size={11} /> Trending Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map(q => (
                  <button key={q} onClick={() => { setQuery(q); saveSearch(q) }} className="px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:bg-profile-mauve hover:text-white hover:border-profile-mauve" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
                FEATURED NOVELS
              </h3>
              {novels.length === 0 ? (
                <div className="journal-card p-8 text-center">
                  <p className="font-display text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>No novels added yet</p>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Published novels uploaded from the admin desk will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {novels.slice(0, 8).map(n => <NovelCard key={n.id} novel={n} />)}
                </div>
              )}
            </div>
          </div>
        )}

        {debouncedQ && (
          <div className="pt-2">
            <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
              {results.length > 0
                ? <>{results.length} result{results.length !== 1 ? 's' : ''} for <span style={{ color: 'var(--accent)' }}>"{debouncedQ}"</span></>
                : <>No results for <span style={{ color: 'var(--accent)' }}>"{debouncedQ}"</span></>
              }
            </p>

            {results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {results.map(n => (
                  <div key={n.id} onClick={() => saveSearch(debouncedQ)}>
                    <NovelCard novel={n} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No novels found</p>
                <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Try a different keyword or browse all novels</p>
                <Link href="/novels" className="btn-primary inline-flex">
                  Browse All Novels <ArrowUpRight size={14} />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
