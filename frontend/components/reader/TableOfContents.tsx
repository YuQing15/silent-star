'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, Lock, Check, Clock } from 'lucide-react'
import { Chapter } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean; onClose: () => void
  allChapters: Chapter[]; currentChapter: number
  novelSlug: string; bg: string; text: string; accent: string
}

export function TableOfContents({ open, onClose, allChapters, currentChapter, novelSlug, bg, text, accent }: Props) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || !listRef.current) return
    const el = listRef.current.querySelector('[data-current="true"]') as HTMLElement | null
    if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [open])

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40" style={{ backdropFilter: 'blur(4px)' }} onClick={onClose} />}

      <aside
        className={cn('fixed top-0 right-0 bottom-0 z-50 w-80 flex flex-col transition-transform duration-300 ease-in-out')}
        style={{
          background: bg,
          borderLeft: `1px solid ${text}12`,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: open ? '-8px 0 32px rgba(0,0,0,0.2)' : 'none',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${text}10` }}>
          <h2 className="font-semibold text-sm" style={{ color: text }}>Table of Contents</h2>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg"
            style={{ background: `${text}0e`, color: text }}>
            <X size={14} />
          </button>
        </div>

        {/* List */}
        <div ref={listRef} className="flex-1 overflow-y-auto">
          {allChapters.map(ch => {
            const isCurrent = ch.chapterNumber === currentChapter
            const isPast    = ch.chapterNumber < currentChapter
            return (
              <Link
                key={ch.id}
                href={ch.isPremium ? '#' : `/novels/${novelSlug}/chapters/${ch.chapterNumber}`}
                data-current={isCurrent}
                onClick={e => { if (ch.isPremium) { e.preventDefault(); return }; onClose() }}
                className={cn(
                  'flex items-start gap-3 px-5 py-3 transition-colors',
                  !ch.isPremium && !isCurrent && 'hover:opacity-75',
                  ch.isPremium && 'cursor-not-allowed opacity-50',
                )}
                style={{
                  background: isCurrent ? `${accent}14` : 'transparent',
                  borderLeft: `2px solid ${isCurrent ? accent : 'transparent'}`,
                }}
              >
                <div className="flex-shrink-0 mt-1">
                  {ch.isPremium
                    ? <Lock size={11} style={{ color: accent }} />
                    : isPast
                    ? <Check size={11} className="text-emerald-500" />
                    : isCurrent
                    ? <div className="w-2 h-2 rounded-full mt-0.5" style={{ background: accent }} />
                    : <div className="w-2 h-2 rounded-full mt-0.5" style={{ background: `${text}20` }} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium mb-0.5" style={{ color: isCurrent ? accent : `${text}45` }}>
                    Chapter {ch.chapterNumber}
                  </p>
                  <p className="text-sm leading-snug line-clamp-2" style={{ color: isCurrent ? text : `${text}75` }}>
                    {ch.title}
                  </p>
                </div>
                <span className="flex-shrink-0 flex items-center gap-0.5 text-[10px] mt-1" style={{ color: `${text}38` }}>
                  <Clock size={9} />{ch.estimatedReadMinutes}m
                </span>
              </Link>
            )
          })}
        </div>
      </aside>
    </>
  )
}
