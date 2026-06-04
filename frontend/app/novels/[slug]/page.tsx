import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Play, Globe, ChevronRight } from 'lucide-react'
import { NovelCard } from '@/components/novel/NovelCard'
import { formatDate, ORIGIN_FLAGS } from '@/lib/utils'
import { ChaptersList } from '@/components/novel/ChaptersList'
import { NovelShelfActions } from '@/components/novel/NovelShelfActions'
import { getPublicNovelBySlug, getPublicNovels } from '@/lib/public-supabase'
import { getCurrentUser } from '@/lib/auth-server'
import { getUserNovelReadingState } from '@/lib/user-reading-server'

interface Props { params: Promise<{ slug: string }> }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const found = await getPublicNovelBySlug(slug)
  if (!found) return {}
  const { novel } = found
  return {
    title: `${novel.title} - Silent Star`,
    description: novel.synopsis.slice(0, 160),
    openGraph: { title: novel.title, description: novel.synopsis.slice(0, 160), images: [novel.coverUrl] },
  }
}

export default async function NovelDetailPage({ params }: Props) {
  const { slug } = await params
  const found = await getPublicNovelBySlug(slug)
  if (!found) notFound()

  const { novel, chapters } = found
  const allNovels = await getPublicNovels()
  const similar = allNovels.filter(n => n.id !== novel.id).slice(0, 6)
  const firstChapter = chapters[0]
  const user = await getCurrentUser()
  const readingState = user ? await getUserNovelReadingState(user.id, novel.id) : null
  const savedChapter = readingState?.chapterNumber ? chapters.find(chapter => chapter.chapterNumber === readingState.chapterNumber) : null
  const continueChapter = savedChapter ?? firstChapter


  return (
    <div className="min-h-screen page-enter">
      <div className="relative overflow-hidden" style={{ height: 380 }}>
        <img src={novel.bannerUrl} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'blur(2px) brightness(0.35) saturate(0.7)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, var(--bg-base) 95%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-64 relative z-10">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8 lg:gap-12 items-start">
          <div className="lg:sticky lg:top-24">
            <div className="relative max-w-[200px] mx-auto lg:mx-0 mb-5">
              <div className="absolute -inset-4 rounded-3xl blur-xl opacity-25 bg-profile-mauve" />
              <img src={novel.coverUrl} alt={novel.title} className="relative w-full rounded-2xl shadow-2xl" style={{ aspectRatio: '2/3', objectFit: 'cover' }} />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize text-white" style={{ background: novel.status === 'completed' ? 'rgba(16,185,129,0.85)' : 'rgba(245,158,11,0.85)', backdropFilter: 'blur(8px)' }}>
                {novel.status}
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {continueChapter && (
                <Link href={`/novels/${novel.slug}/chapters/${continueChapter.chapterNumber}`} className="btn-primary w-full justify-center py-3 text-sm font-semibold rounded-xl">
                  <Play size={15} className="fill-current" /> {savedChapter ? `Continue Ch.${continueChapter.chapterNumber}` : 'Start Reading'}
                </Link>
              )}
              <NovelShelfActions novelId={novel.id} />
            </div>

            <div className="mt-5 rounded-2xl p-4 space-y-3 border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
              {[
                { icon: BookOpen, label: 'Chapters', value: `${chapters.length.toLocaleString()}` },
                { icon: Globe, label: 'Origin', value: `${ORIGIN_FLAGS[novel.origin]} ${novel.origin.charAt(0).toUpperCase() + novel.origin.slice(1)}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}><Icon size={13} />{label}</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 lg:pt-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="tag-pill capitalize">{novel.origin}</span>
            </div>
            <h1 className="font-display font-semibold leading-tight mb-1.5" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{novel.title}</h1>
            {novel.originalTitle && <p className="font-display italic mb-4" style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{novel.originalTitle}</p>}

            <div className="flex flex-wrap items-center gap-4 mb-5">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Updated {formatDate(novel.lastChapterAt)}</span>
            </div>

            <div className="mb-6"><h2 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Synopsis</h2><p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: '1.85' }}>{novel.synopsis}</p></div>
            <div className="mb-8"><h2 className="font-display text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Tags</h2><div className="flex flex-wrap gap-2">{novel.genres.map(tag => <Link key={tag} href={`/novels?tag=${encodeURIComponent(tag)}`} className="tag-pill">{tag}</Link>)}</div></div>
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4"><h2 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Chapters <span style={{ color: 'var(--text-muted)' }} className="font-sans text-base font-normal">({chapters.length.toLocaleString()})</span></h2></div>
              <ChaptersList novelSlug={novel.slug} totalChapters={chapters.length} chapters={chapters} />
            </div>
          </div>
        </div>

        <div className="mt-8 pb-16">
          <div className="section-heading"><h2 className="section-title">You Might Also Like</h2><Link href="/novels" className="btn-ghost text-sm flex items-center gap-1">Browse All <ChevronRight size={14} /></Link></div>
          {similar.length > 0 && <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">{similar.map(n => <NovelCard key={n.id} novel={n} />)}</div>}
        </div>
      </div>
    </div>
  )
}


