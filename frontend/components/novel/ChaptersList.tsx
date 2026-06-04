'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Clock } from 'lucide-react'
import type { Chapter } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface ChaptersListProps {
  novelSlug: string
  totalChapters: number
  chapters?: Chapter[]
}

export function ChaptersList({ novelSlug, totalChapters, chapters: providedChapters }: ChaptersListProps) {
  const [expanded, setExpanded] = useState(false)
  const PAGE_SIZE = 15
  const chapters = providedChapters ?? []
  const shown = expanded ? Math.min(50, chapters.length || totalChapters) : PAGE_SIZE
  const visibleChapters = chapters.length > 0 ? chapters.slice(0, shown) : []

  if (chapters.length === 0) {
    return (
      <div className="rounded-2xl overflow-hidden border p-6 text-center" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
        No published chapters yet.
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
      {visibleChapters.map((ch, i) => {
        const isLast = i === visibleChapters.length - 1 && !(chapters.length > PAGE_SIZE && !expanded)
        return (
          <Link
            key={ch.id}
            href={`/novels/${novelSlug}/chapters/${ch.chapterNumber}`}
            className={cn('flex items-center gap-3 px-4 py-3 transition-colors group hover:bg-[var(--bg-muted)]', !isLast && 'border-b')}
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="w-5 flex-shrink-0 flex items-center justify-center">
              <span className="text-xs font-medium tabular-nums" style={{ color: 'var(--text-muted)' }}>{ch.chapterNumber}</span>
            </div>
            <span className="flex-1 text-sm font-medium leading-snug line-clamp-1 transition-colors group-hover:text-profile-mauve" style={{ color: 'var(--text-primary)' }}>
              {ch.title}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="hidden sm:flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                <Clock size={10} />{ch.estimatedReadMinutes}m
              </span>
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {new Date(ch.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </Link>
        )
      })}

      {chapters.length > PAGE_SIZE && (
        <button onClick={() => setExpanded(e => !e)} className="w-full py-3.5 flex items-center justify-center gap-2 text-sm font-medium transition-colors hover:bg-[var(--bg-muted)]" style={{ color: 'var(--text-secondary)' }}>
          {expanded ? <><ChevronUp size={14} />Show fewer chapters</> : <><ChevronDown size={14} />Show {chapters.length - PAGE_SIZE} more chapters</>}
        </button>
      )}
    </div>
  )
}
