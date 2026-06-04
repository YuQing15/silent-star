'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Moon } from 'lucide-react'
import { sendPasswordResetEmail } from '@/lib/auth'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setIsSubmitting(true)

    try {
      const { error } = await sendPasswordResetEmail(email)
      if (error) {
        setMessage(error.message)
        return
      }
      setMessage('If an account exists for this email, a password reset link is on its way.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to send a reset email right now.')
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
              Find your way back to the shelf.
            </h1>
            <p className="mt-4 leading-relaxed text-[#d5dbe2]">
              We will send a quiet reset link to your email so you can return to your reading desk.
            </p>
          </div>
        </aside>

        <main className="p-8 sm:p-10">
          <p className="text-sm font-semibold" style={{ color: 'var(--profile-accent)' }}>Silent Star account</p>
          <h2 className="mt-2 font-display text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Forgot password?</h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Email</span>
              <span className="mt-2 flex items-center gap-3 rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-base)' }}>
                <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                <input type="email" required value={email} onChange={event => setEmail(event.target.value)} className="w-full bg-transparent text-sm outline-none" style={{ color: 'var(--text-primary)' }} />
              </span>
            </label>
            {message && <p className="text-sm leading-relaxed" style={{ color: 'var(--profile-accent)' }}>{message}</p>}
            <button type="submit" disabled={isSubmitting} className="btn-profile w-full disabled:opacity-60">
              {isSubmitting ? 'Sending reset link...' : 'Send reset email'}
            </button>
          </form>
          <p className="mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            Remembered it? <Link href="/login" className="font-semibold" style={{ color: 'var(--profile-accent)' }}>Log in</Link>
          </p>
        </main>
      </div>
    </div>
  )
}
