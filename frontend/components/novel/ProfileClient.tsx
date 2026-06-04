'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Bookmark, CheckCircle2, CircleSlash, Home, Loader2, Settings, X, type LucideIcon } from 'lucide-react'
import type { AuthUser } from '@/lib/auth'
import { generateHandle } from '@/lib/auth'
import type { UserProfile } from '@/lib/profile'
import { removeNovelReadingProgress, setNovelBookmark, type UserReadingDashboardData, type UserReadingItem } from '@/lib/user-reading'
import { EmptyState } from '@/components/ui/EmptyState'
import { UserAvatar } from '@/components/ui/UserAvatar'
import { ProfileSettingsForm } from '@/components/profile/ProfileSettingsForm'

const sidebar = [
  { label: 'Dashboard', icon: Home, href: '#dashboard' },
  { label: 'Currently Reading', icon: BookOpen, href: '#currently-reading' },
  { label: 'Want to Read', icon: Bookmark, href: '#want-to-read' },
  { label: 'Bookmarks', icon: Bookmark, href: '#bookmarks' },
  { label: 'Completed', icon: CheckCircle2, href: '#completed' },
  { label: 'Dropped', icon: CircleSlash, href: '#dropped' },
  { label: 'Settings', icon: Settings, href: '#settings' },
]

export function ProfileClient({ user, profile, readingData }: { user: AuthUser; profile: UserProfile | null; readingData: UserReadingDashboardData }) {
  const [currentProfile, setCurrentProfile] = useState(profile)
  const [dashboardData, setDashboardData] = useState(readingData)
  const [busyAction, setBusyAction] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState('')
  const displayName = currentProfile?.display_name || user.name
  const avatarUrl = currentProfile?.avatar_url || user.avatarUrl
  const handle = generateHandle(displayName || user.email)
  const stats = [
    { label: 'Chapters read', value: dashboardData.stats.chaptersRead.toLocaleString(), icon: BookOpen },
    { label: 'Completed novels', value: dashboardData.stats.completedNovels.toLocaleString(), icon: CheckCircle2 },
  ]

  const removeBookmark = async (novelId: string) => {
    const key = `bookmark-${novelId}`
    setBusyAction(key)
    setActionMessage('')
    const result = await setNovelBookmark(novelId, false)
    if (result.requiresLogin) {
      setActionMessage('Sign in again to update your bookmarks.')
    } else if (result.error) {
      setActionMessage(result.error.message || 'Could not remove this bookmark yet.')
    } else {
      setDashboardData(prev => ({ ...prev, bookmarks: prev.bookmarks.filter(item => item.novelId !== novelId) }))
      setActionMessage('Bookmark removed.')
    }
    setBusyAction(null)
  }

  const removeCurrentlyReading = async (novelId: string) => {
    const key = `progress-${novelId}`
    setBusyAction(key)
    setActionMessage('')
    const result = await removeNovelReadingProgress(novelId)
    if (result.requiresLogin) {
      setActionMessage('Sign in again to update your reading progress.')
    } else if (result.error) {
      setActionMessage(result.error.message || 'Could not remove this from Currently Reading yet.')
    } else {
      setDashboardData(prev => ({ ...prev, currentlyReading: prev.currentlyReading.filter(item => item.novelId !== novelId) }))
      setActionMessage('Removed from Currently Reading.')
    }
    setBusyAction(null)
  }

  return (
    <div className="dashboard-shell min-h-screen pt-20 pb-24 page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[240px_1fr] gap-5">
          <aside className="journal-card hidden lg:block p-4 h-fit sticky top-20">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <UserAvatar name={displayName} avatarUrl={avatarUrl} />
              <div className="min-w-0">
                <p className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{displayName}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>@{handle}</p>
              </div>
            </div>
            <nav className="space-y-1">
              {sidebar.map(({ label, icon: Icon, href }, index) => (
                <Link key={label}
                  href={href}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-left transition-colors hover:bg-[var(--accent-dim)]"
                  style={{ color: index === 0 ? 'var(--profile-dark)' : 'var(--text-secondary)', background: index === 0 ? 'var(--profile-bg)' : 'transparent' }}>
                  <Icon size={15} />
                  {label}
                </Link>
              ))}
            </nav>
          </aside>

          <main className="space-y-5">
            <section id="dashboard" className="journal-card p-5 sm:p-6 scroll-mt-24">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--profile-accent)' }}>Welcome back</p>
                <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                  Your Silent Star desk
                </h1>
                <p className="mt-3 max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  A quiet shelf for tracking every story by where it belongs next.
                </p>
              </div>
            </section>

            <section className="grid sm:grid-cols-2 gap-3">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="journal-card p-4">
                  <Icon size={18} style={{ color: 'var(--profile-accent)' }} />
                  <p className="mt-4 text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
                </div>
              ))}
            </section>

            {actionMessage && <p className="journal-card px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{actionMessage}</p>}

            <ReadingStatusSection
              id="currently-reading"
              title="Currently Reading"
              subtitle="Novels with active chapter progress."
              icon={BookOpen}
              items={dashboardData.currentlyReading.map(item => toCardItem(item, 'progress'))}
              emptyTitle="No novels currently in progress"
              emptyMessage="Start reading a novel and it will appear here with your saved chapter progress."
              actionLabel="Remove from Currently Reading"
              actionIcon={X}
              onAction={removeCurrentlyReading}
              busyAction={busyAction}
              busyPrefix="progress"
            />

            <ReadingStatusSection
              id="want-to-read"
              title="Want to Read"
              subtitle="Stories saved for a future snowy reading session."
              icon={Bookmark}
              items={dashboardData.wantToRead.map(item => toCardItem(item, 'shelf'))}
              emptyTitle="No novels in your want-to-read list yet"
              emptyMessage="Save novels from the catalogue and they will wait here for later."
            />

            <ReadingStatusSection
              id="bookmarks"
              title="Bookmarks"
              subtitle="Novels you saved for quick return."
              icon={Bookmark}
              items={dashboardData.bookmarks.map(item => toCardItem(item, 'shelf'))}
              emptyTitle="No bookmarks yet"
              emptyMessage="Bookmark novels you want to return to and they will gather here in your winter reading shelf."
              actionLabel="Remove bookmark"
              actionIcon={X}
              onAction={removeBookmark}
              busyAction={busyAction}
              busyPrefix="bookmark"
            />

            <ReadingStatusSection
              id="completed"
              title="Completed"
              subtitle="Finished novels and closed reading journeys."
              icon={CheckCircle2}
              items={dashboardData.completed.map(item => toCardItem(item, 'completed'))}
              emptyTitle="No completed novels yet"
              emptyMessage="Completed novels will appear here once you finish your first story."
            />

            <ReadingStatusSection
              id="dropped"
              title="Dropped"
              subtitle="Novels set aside or paused indefinitely."
              icon={CircleSlash}
              items={dashboardData.dropped.map(item => toCardItem(item, 'shelf'))}
              emptyTitle="No dropped novels yet"
              emptyMessage="Novels you choose to stop reading will appear here, neatly set aside."
            />

            <section id="settings" className="journal-card p-5 scroll-mt-24">
              <h2 className="section-title flex items-center gap-2"><Settings size={17} /> Settings</h2>
              <p className="section-subtitle mt-1">Edit Profile</p>
              <ProfileSettingsForm user={user} profile={currentProfile} onProfileChange={setCurrentProfile} />
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

interface ReadingCardItem {
  slug: string
  novelId: string
  title: string
  coverUrl: string
  meta: string
  note: string
  href: string
}

function toCardItem(item: UserReadingItem, mode: 'progress' | 'shelf' | 'completed'): ReadingCardItem {
  const chapterHref = `/novels/${item.novel.slug}/chapters/${item.chapterNumber}`
  const shelfMeta = item.novel.genres.slice(0, 2).join(' - ') || `${item.novel.publishedChapters} chapters`
  return {
    slug: item.novel.slug,
    novelId: item.novelId,
    title: item.novel.title,
    coverUrl: item.novel.coverUrl,
    meta: mode === 'progress' ? `Chapter ${item.chapterNumber} - ${Math.round(item.progressPercent)}%` : mode === 'completed' ? `${item.novel.publishedChapters.toLocaleString()} chapters` : shelfMeta,
    note: mode === 'progress' ? 'Your latest reading progress is saved in Supabase.' : mode === 'completed' ? 'Completed story' : 'Saved on your Silent Star shelf.',
    href: mode === 'progress' ? chapterHref : `/novels/${item.novel.slug}`,
  }
}

function ReadingStatusSection({ id, title, subtitle, icon: Icon, items, emptyTitle, emptyMessage, actionLabel, actionIcon: ActionIcon, onAction, busyAction, busyPrefix }: {
  id: string
  title: string
  subtitle: string
  icon: LucideIcon
  items: ReadingCardItem[]
  emptyTitle: string
  emptyMessage: string
  actionLabel?: string
  actionIcon?: LucideIcon
  onAction?: (novelId: string) => void
  busyAction?: string | null
  busyPrefix?: string
}) {
  return (
    <section id={id} className="journal-card p-5 scroll-mt-24">
      <div className="section-heading">
        <div>
          <h2 className="section-title flex items-center gap-2"><Icon size={18} /> {title}</h2>
          <p className="section-subtitle mt-1">{subtitle}</p>
        </div>
      </div>
      {items.length === 0 ? (
        <EmptyState icon={Icon} title={emptyTitle} message={emptyMessage} compact />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {items.map(item => {
            const actionKey = `${busyPrefix}-${item.novelId}`
            const isBusy = busyAction === actionKey
            return (
              <div key={`${item.slug}-${item.href}`} className="group relative rounded-2xl border p-3 transition-all hover:-translate-y-0.5 hover:shadow-journal" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
                {onAction && ActionIcon && actionLabel && (
                  <button
                    type="button"
                    onClick={() => onAction(item.novelId)}
                    disabled={Boolean(busyAction)}
                    aria-label={actionLabel}
                    title={actionLabel}
                    className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border transition-colors hover:bg-[var(--accent-dim)]"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
                  >
                    {isBusy ? <Loader2 size={14} className="animate-spin" /> : <ActionIcon size={14} />}
                  </button>
                )}
                <Link href={item.href} className="flex gap-3 pr-7">
                  <img src={item.coverUrl} alt={item.title} className="h-24 w-16 rounded-xl object-cover shadow-journal" />
                  <div className="min-w-0 flex-1 py-0.5">
                    <h3 className="font-semibold line-clamp-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                    <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{item.meta}</p>
                    <p className="mt-3 text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{item.note}</p>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
