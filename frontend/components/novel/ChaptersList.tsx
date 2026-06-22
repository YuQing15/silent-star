'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Clock } from 'lucide-react'
import type { Chapter } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface ChaptersListProps {
  novelSlug: string
  totalChapters: number
  chapters?: Chapter[]
}

const INITIAL_CHAPTER_COUNT = 15
const CHAPTER_BATCH_SIZE = 35

export function ChaptersList({ novelSlug, totalChapters, chapters: providedChapters }: ChaptersListProps) {
  const chapters = providedChapters ?? []
  const [visibleCount, setVisibleCount] = useState(INITIAL_CHAPTER_COUNT)
  const shown = Math.min(visibleCount, chapters.length || totalChapters)
  const visibleChapters = chapters.length > 0 ? chapters.slice(0, shown) : []
  const hasMoreChapters = chapters.length > visibleChapters.length
  const canCollapse = visibleChapters.length > INITIAL_CHAPTER_COUNT

  useEffect(() => {
    setVisibleCount(INITIAL_CHAPTER_COUNT)
  }, [novelSlug, chapters.length])

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
        const isLast = i === visibleChapters.length - 1 && !hasMoreChapters
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

      {(hasMoreChapters || canCollapse) && (
        <div className="flex flex-col sm:flex-row">
          {hasMoreChapters && (
            <button
              onClick={() => setVisibleCount(count => Math.min(count + CHAPTER_BATCH_SIZE, chapters.length))}
              className="w-full flex-1 py-3.5 flex items-center justify-center gap-2 text-sm font-medium transition-colors hover:bg-[var(--bg-muted)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ChevronDown size={14} />Show {Math.min(CHAPTER_BATCH_SIZE, chapters.length - visibleChapters.length)} more chapters
            </button>
          )}
          {canCollapse && (
            <button
              onClick={() => setVisibleCount(INITIAL_CHAPTER_COUNT)}
              className="w-full flex-1 py-3.5 flex items-center justify-center gap-2 text-sm font-medium transition-colors hover:bg-[var(--bg-muted)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ChevronUp size={14} />Show fewer chapters
            </button>
          )}
        </div>
      )}
    </div>
  )
}

