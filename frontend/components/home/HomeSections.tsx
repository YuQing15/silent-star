'use client'

import Link from 'next/link'
import { BookOpen, Bookmark, ChevronRight, Clock, LineChart, Quote, Sparkles, Star, TrendingUp } from 'lucide-react'
import type { Novel } from '@/lib/mock-data'
import type { UserReadingItem } from '@/lib/user-reading'
import { NovelCard } from '@/components/novel/NovelCard'
import { EmptyState } from '@/components/ui/EmptyState'

export function StatsStrip({ novels }: { novels: Novel[] }) {
  const stats = [
    { icon: BookOpen, value: novels.length ? '24k+' : '0', label: 'Chapters' },
    { icon: Bookmark, value: novels.length ? '380+' : '0', label: 'Novels' },
    { icon: Quote, value: '0', label: 'Saved quotes' },
    { icon: LineChart, value: '0', label: 'Monthly goal' },
  ]

  return (
    <div className="border-y py-5 frosted-panel" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-dim)' }}>
                <Icon size={17} style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <div className="font-semibold text-lg leading-none mb-0.5" style={{ color: 'var(--text-primary)' }}>{value}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ContinueReadingBanner({ novels, items = [] }: { novels: Novel[]; items?: UserReadingItem[] }) {
  if (items.length > 0) {
    return (
      <div className="pt-8">
        <div className="section-heading">
          <div>
            <h2 className="section-title">Continue Reading</h2>
            <p className="section-subtitle mt-1">Your saved reading path through Silent Star</p>
          </div>
          <Link href="/profile" className="btn-ghost">Open dashboard</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.slice(0, 3).map(item => {
            const pct = Math.round(item.progressPercent)
            return (
              <Link key={item.novelId} href={`/novels/${item.novel.slug}/chapters/${item.chapterNumber}`}
                className="journal-card flex gap-3 p-3.5 group transition-all hover:-translate-y-0.5">
                <img src={item.novel.coverUrl} alt={item.novel.title}
                  className="w-14 h-20 rounded-xl object-cover flex-shrink-0 transition-transform group-hover:scale-105" />
                <div className="flex-1 min-w-0 py-0.5">
                  <p className="text-xs mb-1 font-medium" style={{ color: 'var(--text-muted)' }}>CONTINUE</p>
                  <h3 className="text-sm font-semibold line-clamp-1 mb-1" style={{ color: 'var(--text-primary)' }}>{item.novel.title}</h3>
                  <p className="text-xs mb-2.5" style={{ color: 'var(--text-secondary)' }}>Chapter {item.chapterNumber}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-muted)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#9896bb,#778ca4)' }} />
                    </div>
                    <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{pct}%</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="pt-8">
      <EmptyState
        icon={BookOpen}
        title="Start your first reading journey"
        message="Your currently reading novels will appear here once your Supabase reading progress is available. Upload novels from the admin dashboard to open the first path through Silent Star."
        actionLabel={novels.length ? 'Browse novels' : 'Browse empty shelf'}
        actionHref="/novels"
      />
    </div>
  )
}
export function TrendingSection({ novels }: { novels: Novel[] }) {
  const trending = [...novels].sort((a, b) => b.weeklyViews - a.weeklyViews).slice(0, 6)
  return (
    <section>
      <div className="section-heading">
        <div>
          <h2 className="section-title flex items-center gap-2"><TrendingUp size={18} style={{ color: 'var(--profile-accent)' }} /> Trending Novels</h2>
          <p className="section-subtitle mt-1">Guest-friendly browsing for what readers are binging now</p>
        </div>
        {trending.length > 0 && <Link href="/novels?sort=trending" className="btn-ghost text-sm flex items-center gap-1">View all <ChevronRight size={13} /></Link>}
      </div>
      {trending.length === 0 ? (
        <EmptyState icon={TrendingUp} title="No novels added yet" message="Trending novels will appear once your catalogue has uploaded stories and reader activity. Upload novels from the admin dashboard to begin." actionLabel="Open browse preview" actionHref="/novels" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 stagger-children">
          {trending.map((novel, i) => <NovelCard key={novel.id} novel={novel} rank={i + 1} />)}
        </div>
      )}
    </section>
  )
}

export function NewReleasesSection({ novels }: { novels: Novel[] }) {
  const releases = [...novels].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8)
  return (
    <section>
      <div className="section-heading">
        <div>
          <h2 className="section-title flex items-center gap-2"><Star size={16} style={{ color: 'var(--profile-accent)' }} /> New Releases</h2>
          <p className="section-subtitle mt-1">Freshly added novels ready for the first readers</p>
        </div>
        {releases.length > 0 && <Link href="/novels?sort=new" className="btn-ghost text-sm flex items-center gap-1">View all <ChevronRight size={13} /></Link>}
      </div>
      {releases.length === 0 ? (
        <EmptyState icon={Star} title="No new releases yet" message="Newly uploaded novels will appear here once content is added from the admin dashboard." />
      ) : (
        <div className="grid md:grid-cols-2 gap-2">
          {releases.map((novel, i) => (
            <Link key={novel.id} href={`/novels/${novel.slug}`} className="journal-card flex items-center gap-3 p-3 group transition-all hover:-translate-y-0.5">
              <span className="w-6 text-center text-sm font-bold flex-shrink-0" style={{ color: i < 3 ? 'var(--profile-accent)' : 'var(--text-muted)' }}>{i + 1}</span>
              <img src={novel.coverUrl} alt={novel.title} className="w-10 h-14 rounded-lg object-cover flex-shrink-0 transition-transform group-hover:scale-105" />
              <div className="flex-1 min-w-0"><p className="text-sm font-medium line-clamp-1" style={{ color: 'var(--text-primary)' }}>{novel.title}</p><p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{novel.genres.slice(0, 2).join(' - ')}</p></div>
              <div className="flex items-center gap-1 flex-shrink-0"><Star size={12} style={{ color: 'var(--profile-accent)' }} /><span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{novel.averageRating}</span></div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export function RecentlyUpdatedSection({ novels }: { novels: Novel[] }) {
  const updatedNovels = [...novels].sort((a, b) => new Date(b.lastChapterAt).getTime() - new Date(a.lastChapterAt).getTime())
  return (
    <section>
      <div className="section-heading">
        <div>
          <h2 className="section-title flex items-center gap-2"><Sparkles size={16} style={{ color: 'var(--profile-accent)' }} /> Recently Updated</h2>
          <p className="section-subtitle mt-1">Fresh chapters for your evening stack</p>
        </div>
        {updatedNovels.length > 0 && <Link href="/novels?sort=updated" className="btn-ghost text-sm flex items-center gap-1">View all <ChevronRight size={13} /></Link>}
      </div>
      {updatedNovels.length === 0 ? (
        <EmptyState icon={Clock} title="No chapter updates yet" message="Recently updated chapters will appear here after novels are uploaded from the admin dashboard." />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-2">
          {updatedNovels.slice(0, 9).map((novel, i) => (
            <Link key={novel.id} href={`/novels/${novel.slug}`} className="journal-card flex gap-3 p-3 group transition-all hover:-translate-y-0.5">
              <img src={novel.coverUrl} alt={novel.title} className="w-14 h-20 rounded-xl object-cover flex-shrink-0 transition-transform group-hover:scale-105" />
              <div className="flex-1 min-w-0 py-0.5"><h3 className="text-sm font-semibold line-clamp-1 mb-0.5" style={{ color: 'var(--text-primary)' }}>{novel.title}</h3><p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{novel.authorName}</p><div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-medium" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}><BookOpen size={9} />Chapter {novel.publishedChapters}</div></div>
              <div className="flex-shrink-0 text-xs pt-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}><Clock size={10} />{i === 0 ? '1h' : i < 3 ? `${i * 2 + 1}h` : `${i}h`}</div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}


