'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Moon } from 'lucide-react'
import type { Novel } from '@/lib/mock-data'

export function HeroSection({ novels }: { novels: Novel[] }) {
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const hasNovels = novels.length > 0
  const featured = hasNovels ? novels[featuredIndex % novels.length] : null

  useEffect(() => {
    if (novels.length <= 1) return
    const timer = window.setInterval(() => {
      setFeaturedIndex(index => (index + 1) % novels.length)
    }, 7000)
    return () => window.clearInterval(timer)
  }, [novels.length])

  return (
    <section className="winter-hero relative overflow-hidden pt-24 pb-10 sm:pt-28">
      <div className="absolute left-8 top-28 hidden h-36 w-36 rounded-full opacity-60 blur-3xl lg:block" style={{ background: '#ffffff' }} />
      <div className="absolute right-10 top-24 hidden h-52 w-52 rounded-full opacity-45 blur-3xl lg:block" style={{ background: '#c9dbe5' }} />
      <div className="frost-branch frost-branch-a" />
      <div className="frost-branch frost-branch-b" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <img src="/silent-star-logo.svg" alt="Silent Star" className="h-14 w-14 rounded-2xl shadow-journal" />
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[0.95]" style={{ color: 'var(--text-primary)' }}>
                Silent Star
              </h1>
            </div>
            <p className="mb-7 max-w-xl font-display text-xl sm:text-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              A quiet place where stories linger a little longer.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={featured ? `/novels/${featured.slug}/chapters/1` : '/novels'} className="btn-primary">
                <BookOpen size={16} />
                {featured ? 'Start reading' : 'Start your first reading journey'}
              </Link>
              <Link href="/novels" className="btn-outline">
                {featured ? 'Browse novels' : 'View empty shelf'}
              </Link>
            </div>
          </div>

          <div className="journal-card celestial-mark overflow-hidden p-4 sm:p-5">
            {hasNovels ? (
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${featuredIndex * 100}%)` }}
                >
                  {novels.map(novel => (
                    <div key={novel.id} className="grid min-w-full grid-cols-[96px_1fr] gap-4 sm:grid-cols-[120px_1fr]">
                      <img src={novel.coverUrl} alt={novel.title} className="h-36 w-full rounded-xl object-cover shadow-journal sm:h-44" />
                      <div className="min-w-0">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Today's Favourite</p>
                        <h2 className="font-display mb-2 text-2xl font-semibold leading-tight sm:text-3xl" style={{ color: 'var(--text-primary)' }}>
                          {novel.title}
                        </h2>
                        <p className="mb-4 line-clamp-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{novel.synopsis}</p>
                        <Link href={`/novels/${novel.slug}/chapters/1`} className="btn-profile px-4 py-2">
                          Read now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 px-4 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl frosted-panel">
                  <Moon size={26} style={{ color: 'var(--accent)' }} />
                </div>
                <p className="font-display text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>No novels added yet</p>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Upload novels from the admin dashboard to begin filling this snowy reading sanctuary.
                </p>
                <Link href="/novels" className="btn-outline mt-6 inline-flex">Preview empty library</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

