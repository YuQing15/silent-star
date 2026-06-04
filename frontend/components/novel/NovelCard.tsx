'use client'

import Link from 'next/link'
import { Star, BookOpen, Flame, Crown, Check } from 'lucide-react'
import { Novel } from '@/lib/mock-data'
import { formatNumber, cn } from '@/lib/utils'

interface NovelCardProps {
  novel: Novel
  variant?: 'default' | 'horizontal' | 'compact'
  rank?: number
  className?: string
}

export function NovelCard({ novel, variant = 'default', rank, className }: NovelCardProps) {
  if (variant === 'horizontal') return <HorizontalCard novel={novel} rank={rank} className={className} />
  if (variant === 'compact')    return <CompactCard    novel={novel} rank={rank} className={className} />
  return <DefaultCard novel={novel} rank={rank} className={className} />
}

function DefaultCard({ novel, rank, className }: { novel: Novel; rank?: number; className?: string }) {
  return (
    <Link href={`/novels/${novel.slug}`} className={cn('novel-card group', className)}>
      <div className="relative" style={{ aspectRatio: '2/3' }}>
        <img
          src={novel.coverUrl}
          alt={novel.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rank badge */}
        {rank && (
          <div
            className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
            style={{ background: rank <= 3 ? 'linear-gradient(135deg,#9896bb,#5d6da5)' : 'rgba(49,60,69,0.70)' }}
          >
            {rank}
          </div>
        )}

        {/* Top-right badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {novel.isPremium && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold text-profile-lilac"
              style={{ background: 'rgba(0,0,0,0.7)' }}>
              <Crown size={8} />VIP
            </span>
          )}
          {novel.status === 'completed' && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold text-emerald-300"
              style={{ background: 'rgba(0,0,0,0.7)' }}>
              <Check size={8} />Done
            </span>
          )}
        </div>

        {/* Hover CTA */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div
            className="w-full py-1.5 rounded-lg text-[11px] font-semibold text-center text-white"
              style={{ background: 'linear-gradient(135deg,#778ca4,#4f6271)' }}
          >
            Read Now
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5" style={{ background: 'var(--bg-surface)' }}>
        <h3
          className="text-sm font-medium leading-snug line-clamp-2 mb-1.5 transition-colors duration-150"
          style={{ color: 'var(--text-primary)' }}
        >
          {novel.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: 'var(--profile-accent)' }}>
            <Star size={10} />
            {novel.averageRating}
          </span>
          <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <BookOpen size={10} />
            {novel.publishedChapters.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {novel.genres.slice(0, 2).map(g => (
            <span key={g} className="text-[10px] px-1.5 py-0.5 rounded font-medium"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
              {g}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

function HorizontalCard({ novel, rank, className }: { novel: Novel; rank?: number; className?: string }) {
  return (
    <Link
      href={`/novels/${novel.slug}`}
      className={cn('flex gap-3 p-3 rounded-xl group transition-colors hover:bg-[var(--bg-elevated)]', className)}
    >
      {rank && (
        <span className="w-5 text-center text-sm font-bold flex-shrink-0 self-center"
          style={{ color: rank <= 3 ? 'var(--accent)' : 'var(--text-muted)' }}>
          {rank}
        </span>
      )}
      <div className="w-12 flex-shrink-0 rounded-lg overflow-hidden" style={{ aspectRatio: '2/3' }}>
        <img src={novel.coverUrl} alt={novel.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        <h3 className="text-sm font-medium line-clamp-2 mb-0.5 transition-colors"
          style={{ color: 'var(--text-primary)' }}>
          {novel.title}
        </h3>
        <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>{novel.authorName}</p>
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1 font-medium" style={{ color: 'var(--profile-accent)' }}>
            <Star size={10} />{novel.averageRating}
          </span>
          <span className="flex items-center gap-1">
            <Flame size={10} style={{ color: 'var(--profile-accent)' }} />{formatNumber(novel.weeklyViews)}/wk
          </span>
        </div>
      </div>
    </Link>
  )
}

function CompactCard({ novel, rank, className }: { novel: Novel; rank?: number; className?: string }) {
  return (
    <Link href={`/novels/${novel.slug}`} className={cn('flex items-center gap-2.5 py-1.5 group', className)}>
      {rank && (
        <span className="text-xs font-bold w-4 text-center flex-shrink-0"
          style={{ color: rank <= 3 ? 'var(--accent)' : 'var(--text-muted)' }}>
          {rank}
        </span>
      )}
      <div className="w-8 h-11 rounded-md overflow-hidden flex-shrink-0">
        <img src={novel.coverUrl} alt={novel.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium line-clamp-1 transition-colors"
          style={{ color: 'var(--text-primary)' }}>
          {novel.title}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {novel.publishedChapters}ch
        </p>
      </div>
    </Link>
  )
}
