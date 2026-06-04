'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, Flame, Menu, Moon, Search, Shield, Sun, UserRound, X } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { canAccessAdmin, mapSupabaseUser, signOut as signOutUser, type AuthUser } from '@/lib/auth'
import { hasSupabaseEnv } from '@/lib/supabase/config'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { UserAvatar } from '@/components/ui/UserAvatar'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/novels', label: 'Browse' },
]

const TRENDING_QUERIES = ['Slow burn fantasy', 'Villainess', 'Found family', 'Regression', 'Completed novels']

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const isReader = pathname?.includes('/chapters/')
  const auth = { user: authUser, isAuthenticated: Boolean(authUser) }
  const isAdmin = canAccessAdmin(auth)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false); setProfileOpen(false) }, [pathname])
  useEffect(() => {
    if (!hasSupabaseEnv()) return

    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data }) => setAuthUser(mapSupabaseUser(data.user)))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(mapSupabaseUser(session?.user ?? null))
    })

    return () => listener.subscription.unsubscribe()
  }, [])
  useEffect(() => { if (searchOpen) setTimeout(() => searchRef.current?.focus(), 80) }, [searchOpen])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(s => !s)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setProfileOpen(false)
      }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  const handleLogout = async () => {
    await signOutUser()
    setAuthUser(null)
    setProfileOpen(false)
    setMobileOpen(false)
    router.push('/')
    router.refresh()
  }
  const handleSearch = (q: string) => {
    if (!q.trim()) return
    setSearchOpen(false)
    setSearchQuery('')
    router.push(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  const liveResults: Array<{ id: string; slug: string; coverUrl: string; title: string; authorName: string; genres: string[] }> = []

  if (isReader) return null

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          borderBottom: scrolled ? '1px solid var(--nav-border)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(18px) saturate(1.5)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(1.5)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-7">
              <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
                <img src="/silent-star-logo.svg" alt="" className="h-8 w-8 rounded-xl shadow-journal" />
                <span className="text-lg font-semibold" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", color: 'var(--text-primary)' }}>
                  Silent Star
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {NAV_LINKS.map(({ href, label }) => (
                  <Link key={href} href={href}
                    className={cn('nav-link', (pathname === href || (href !== '/' && pathname?.startsWith(href))) && 'active')}>
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition-colors hover:bg-[var(--accent-dim)]"
                style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
              >
                <Search size={14} />
                <span className="hidden lg:block">Search...</span>
                <kbd className="hidden lg:block text-[10px] px-1.5 py-0.5 rounded border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>Ctrl K</kbd>
              </button>

              <button onClick={() => setSearchOpen(true)} className="sm:hidden btn-ghost p-2 rounded-xl" aria-label="Search">
                <Search size={17} style={{ color: 'var(--text-tertiary)' }} />
              </button>

              <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} className="btn-ghost p-2 rounded-xl" aria-label="Toggle theme">
                {resolvedTheme === 'dark'
                  ? <Sun size={16} style={{ color: 'var(--accent-light)' }} />
                  : <Moon size={16} style={{ color: 'var(--text-tertiary)' }} />
                }
              </button>

              <div className="relative hidden md:block">
                <button
                  onClick={() => setProfileOpen(v => !v)}
                  className="flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-sm transition-colors hover:bg-[var(--accent-dim)]"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                  aria-label="Open account menu"
                  aria-expanded={profileOpen}
                >
                  <UserRound size={17} />
                  <ChevronDown size={13} />
                </button>
                {profileOpen && (
                  <div className="frosted-panel absolute right-0 mt-2 w-52 rounded-2xl p-2 shadow-journal">
                    {auth.isAuthenticated && auth.user ? (
                      <>
                        <Link href="/profile" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-[var(--accent-dim)]" style={{ color: 'var(--text-primary)' }}>
                          <UserAvatar name={auth.user.name} avatarUrl={auth.user.avatarUrl} size="sm" />
                          Reader dashboard
                        </Link>
                        {isAdmin && (
                          <Link href="/admin" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-[var(--accent-dim)]" style={{ color: 'var(--text-secondary)' }}>
                            <Shield size={15} />
                            Admin desk
                          </Link>
                        )}
                        <button onClick={handleLogout} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium hover:bg-[var(--accent-dim)]" style={{ color: 'var(--text-secondary)' }}>Log out</button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="block rounded-xl px-3 py-2 text-sm font-medium hover:bg-[var(--accent-dim)]" style={{ color: 'var(--text-secondary)' }}>Sign In</Link>
                        <Link href="/signup" className="block rounded-xl px-3 py-2 text-sm font-medium hover:bg-[var(--accent-dim)]" style={{ color: 'var(--text-secondary)' }}>Create Account</Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button className="md:hidden btn-ghost p-2 rounded-xl" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
                {mobileOpen
                  ? <X size={17} style={{ color: 'var(--text-primary)' }} />
                  : <Menu size={17} style={{ color: 'var(--text-primary)' }} />
                }
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden pt-16" style={{ background: 'var(--bg-base)' }}>
          <div className="px-5 py-6 space-y-1">
            {[{ href: '/', label: 'Home' }, ...NAV_LINKS, ...(auth.isAuthenticated ? [{ href: '/profile', label: 'Dashboard' }] : []), ...(isAdmin ? [{ href: '/admin', label: 'Admin desk' }] : []), ...(auth.isAuthenticated ? [] : [{ href: '/login', label: 'Sign In' }, { href: '/signup', label: 'Create Account' }])].map(({ href, label }) => (
              <Link key={href} href={href}
                className="block px-4 py-3 rounded-xl text-base font-medium transition-colors"
                style={{
                  color: pathname === href ? 'var(--accent)' : 'var(--text-secondary)',
                  background: pathname === href ? 'var(--accent-dim)' : 'transparent',
                }}>
                {label}
              </Link>
            ))}
            {auth.isAuthenticated && (
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-3 rounded-xl text-left text-base font-medium transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                Log out
              </button>
            )}
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4" style={{ background: 'rgba(49,60,69,0.45)', backdropFilter: 'blur(6px)' }} onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false) }}>
          <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl animate-scale-in" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
              <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input ref={searchRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSearch(searchQuery) }} placeholder="Search novels, authors, genres..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: 'var(--text-primary)' }} />
              {searchQuery && <button onClick={() => setSearchQuery('')} style={{ color: 'var(--text-muted)', flexShrink: 0 }} aria-label="Clear search"><X size={14} /></button>}
              <kbd className="hidden sm:block text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>Esc</kbd>
            </div>
            {liveResults.length > 0 ? (
              <div className="py-1.5">
                {liveResults.map(novel => (
                  <Link key={novel.id} href={`/novels/${novel.slug}`} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--bg-muted)]">
                    <img src={novel.coverUrl} alt="" className="w-8 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{novel.title}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{novel.authorName} - {novel.genres[0]}</p>
                    </div>
                  </Link>
                ))}
                <div className="px-4 py-2.5" style={{ borderTop: '1px solid var(--border)' }}>
                  <button onClick={() => handleSearch(searchQuery)} className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--accent)' }}><Search size={13} /> See all results for "{searchQuery}"</button>
                </div>
              </div>
            ) : searchQuery.length > 1 ? (
              <div className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No novels matching "<span style={{ color: 'var(--accent)' }}>{searchQuery}</span>"</div>
            ) : (
              <div className="p-3">
                <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Reader searches</p>
                {TRENDING_QUERIES.map(q => (
                  <button key={q} onClick={() => handleSearch(q)} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-left transition-colors hover:bg-[var(--bg-muted)]" style={{ color: 'var(--text-secondary)' }}>
                    <Flame size={13} style={{ color: 'var(--profile-accent)' }} className="flex-shrink-0" />{q}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}













