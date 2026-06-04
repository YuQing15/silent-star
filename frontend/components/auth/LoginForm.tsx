'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, LockKeyhole, Mail, Moon } from 'lucide-react'
import { signInWithPassword } from '@/lib/auth'
import { getSiteRedirectPath } from '@/lib/supabase/config'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || getSiteRedirectPath('/profile')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setIsSubmitting(true)

    try {
      const { error } = await signInWithPassword(email, password)
      if (error) {
        setMessage(error.message)
        return
      }
      router.push(next.startsWith('/') ? next : getSiteRedirectPath('/profile'))
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="dashboard-shell min-h-screen pt-24 pb-16 px-4">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border shadow-journal lg:grid-cols-[0.9fr_1.1fr]"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
        <aside className="moonlit-illustration p-8 sm:p-10 text-white">
          <img src="/silent-star-logo.svg" alt="Silent Star" className="h-14 w-14 rounded-2xl shadow-journal" />
          <div className="mt-12 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
            <Moon size={28} className="text-[#d5dbe2]" />
            <h1 className="mt-8 font-display text-4xl font-semibold leading-tight text-[#edf3f7]">
              Return to your winter reading desk.
            </h1>
            <p className="mt-4 leading-relaxed text-[#d5dbe2]">
              Welcome back to your saved chapters, quiet notes, moonlit quotes, and the books waiting for tonight.
            </p>
          </div>
        </aside>

        <main className="p-8 sm:p-10">
          <p className="text-sm font-semibold" style={{ color: 'var(--profile-accent)' }}>Silent Star account</p>
          <h2 className="mt-2 font-display text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Log in</h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Email</span>
              <span className="mt-2 flex items-center gap-3 rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-base)' }}>
                <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                <input type="email" required value={email} onChange={event => setEmail(event.target.value)} className="w-full bg-transparent text-sm outline-none" style={{ color: 'var(--text-primary)' }} />
              </span>
            </label>
            <label className="block">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Password</span>
              <span className="mt-2 flex items-center gap-3 rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-base)' }}>
                <LockKeyhole size={16} style={{ color: 'var(--text-muted)' }} />
                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={event => setPassword(event.target.value)} className="w-full bg-transparent text-sm outline-none" style={{ color: 'var(--text-primary)' }} />
                <button type="button" onClick={() => setShowPassword(value => !value)} className="rounded-lg p-1 transition-colors hover:bg-[var(--accent-dim)]" style={{ color: 'var(--text-muted)' }} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>
            <div className="-mt-2 text-right">
              <Link href="/forgot-password" className="text-sm font-semibold" style={{ color: 'var(--profile-accent)' }}>Forgot Password?</Link>
            </div>
            {message && <p className="text-sm" style={{ color: 'var(--profile-accent)' }}>{message}</p>}
            <button type="submit" disabled={isSubmitting} className="btn-profile w-full disabled:opacity-60">
              {isSubmitting ? 'Opening your desk...' : 'Enter your reading desk'}
            </button>
          </form>
          <p className="mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            New here? <Link href="/signup" className="font-semibold" style={{ color: 'var(--profile-accent)' }}>Create your shelf</Link>
          </p>
        </main>
      </div>
    </div>
  )
}
