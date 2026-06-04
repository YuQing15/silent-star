'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LockKeyhole, LogOut, Moon } from 'lucide-react'

const ADMIN_ACCESS_KEY = 'silent-star-admin-preview-access'

function getExpectedAdminPassword() {
  return process.env.NEXT_PUBLIC_ADMIN_PREVIEW_PASSWORD || ''
}

function getAdminAccessToken() {
  const password = getExpectedAdminPassword()
  return password ? `preview:${password}` : ''
}

export function hasAdminPreviewAccess() {
  if (typeof window === 'undefined') return false
  const token = getAdminAccessToken()
  return Boolean(token) && sessionStorage.getItem(ADMIN_ACCESS_KEY) === token
}

export function grantAdminPreviewAccess() {
  const token = getAdminAccessToken()
  if (!token) return false
  sessionStorage.setItem(ADMIN_ACCESS_KEY, token)
  return true
}

export function clearAdminPreviewAccess() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(ADMIN_ACCESS_KEY)
}

export function AdminPreviewGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    // Do not bypass admin-login. /admin must always require admin preview session access.
    if (hasAdminPreviewAccess()) {
      setIsAllowed(true)
      return
    }

    clearAdminPreviewAccess()
    router.replace('/admin-login')
  }, [router])

  const exitPreview = () => {
    clearAdminPreviewAccess()
    setIsAllowed(false)
    router.replace('/admin-login')
  }

  if (!isAllowed) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-4 silent-star-atmosphere">
        <div className="mx-auto max-w-xl journal-card p-8 text-center">
          <Moon className="mx-auto mb-4" size={24} style={{ color: 'var(--accent)' }} />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Checking admin preview access...</p>
        </div>
      </main>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={exitPreview}
        className="fixed right-4 top-20 z-50 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold shadow-journal backdrop-blur-md transition-colors hover:bg-[var(--accent-dim)]"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
      >
        <LogOut size={13} /> Exit admin preview
      </button>
      {children}
    </>
  )
}

export function AdminLoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const expectedPassword = getExpectedAdminPassword()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!expectedPassword) {
      clearAdminPreviewAccess()
      setError('Admin preview password is not configured in .env.local.')
      return
    }

    if (password !== expectedPassword) {
      clearAdminPreviewAccess()
      setError('Incorrect admin password.')
      return
    }

    if (!grantAdminPreviewAccess()) {
      setError('Admin preview access could not be saved.')
      return
    }

    router.push('/admin')
  }

  return (
    <main className="dashboard-shell min-h-screen pt-24 pb-16 px-4">
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-3xl border shadow-journal lg:grid-cols-[0.9fr_1.1fr]"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
        <aside className="moonlit-illustration p-8 sm:p-10 text-white">
          <img src="/silent-star-logo.svg" alt="Silent Star" className="h-14 w-14 rounded-2xl shadow-journal" />
          <div className="mt-12 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
            <Moon size={28} className="text-[#d5dbe2]" />
            <h1 className="mt-8 font-display text-4xl font-semibold leading-tight text-[#edf3f7]">
              Enter the quiet admin desk.
            </h1>
            <p className="mt-4 leading-relaxed text-[#d5dbe2]">
              A temporary preview gate for shaping Silent Star content tools while admin roles are refined.
            </p>
          </div>
        </aside>

        <section className="p-8 sm:p-10">
          <p className="text-sm font-semibold" style={{ color: 'var(--profile-accent)' }}>Admin preview</p>
          <h2 className="mt-2 font-display text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Admin password</h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Password</span>
              <span className="mt-2 flex items-center gap-3 rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-base)' }}>
                <LockKeyhole size={16} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                  style={{ color: 'var(--text-primary)' }}
                />
              </span>
            </label>
            {error && <p className="text-sm" style={{ color: 'var(--profile-accent)' }}>{error}</p>}
            <button type="submit" className="btn-profile w-full">Open admin desk</button>
          </form>
        </section>
      </div>
    </main>
  )
}
