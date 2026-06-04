'use client'

import { useState } from 'react'
import { BookOpen, Bookmark, CheckCircle2 } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'

const TABS = ['Reading', 'Bookmarks', 'Completed'] as const
type Tab = typeof TABS[number]

export function LibraryClient() {
  const [tab, setTab] = useState<Tab>('Reading')

  return (
    <div className="min-h-screen pt-20 pb-24 page-enter">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h1 className="font-display font-semibold mb-1" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            My Library
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            A quiet shelf waiting for its first novel
          </p>
        </div>

        <div className="journal-card celestial-mark p-5 mb-8 overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
                Reading Streak
              </p>
              <p className="font-display font-semibold text-4xl" style={{ color: 'var(--text-primary)' }}>0 days</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Start your first reading journey to begin a streak.
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Best streak</p>
              <p className="font-semibold text-xl" style={{ color: 'var(--text-primary)' }}>0 days</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-7 rounded-lg flex items-center justify-center text-xs font-medium" style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)' }}>
                  {d}
                </div>
                <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-2xl mb-6 w-fit frosted-panel">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className="px-5 py-2 rounded-xl text-sm font-medium transition-all" style={{ background: tab === t ? 'var(--accent)' : 'transparent', color: tab === t ? 'white' : 'var(--text-secondary)' }}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'Reading' && (
          <EmptyState icon={BookOpen} title="No novels in progress" message="Start your first reading journey and active novels will appear here with saved chapter progress." actionLabel="Browse novels" actionHref="/novels" />
        )}

        {tab === 'Bookmarks' && (
          <EmptyState icon={Bookmark} title="No bookmarks yet" message="Bookmark novels you want to return to and they will gather here in your winter reading shelf." actionLabel="Browse novels" actionHref="/novels" />
        )}

        {tab === 'Completed' && (
          <EmptyState icon={CheckCircle2} title="No completed novels yet" message="Finished novels and reading history milestones will appear here once readers complete a story." actionLabel="Start reading" actionHref="/novels" />
        )}
      </div>
    </div>
  )
}
