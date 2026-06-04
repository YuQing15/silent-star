'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LockKeyhole, Moon } from 'lucide-react'
import { preparePasswordRecoverySession, updatePassword } from '@/lib/auth'
import { getSiteRedirectPath } from '@/lib/supabase/config'

export function ResetPasswordForm() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState('Checking your reset link...')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRecoveryReady, setIsRecoveryReady] = useState(false)

  useEffect(() => {
    let mounted = true

    preparePasswordRecoverySession().then(({ ready, error }) => {
      if (!mounted) return

      if (error) {
        setMessage(error.message)
        setIsRecoveryReady(false)
        return
      }

      if (!ready) {
        setMessage('Open this page from the password reset email link before choosing a new password.')
        setIsRecoveryReady(false)
        return
      }

      setMessage('')
      setIsRecoveryReady(true)
    })

    return () => { mounted = false }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    if (!isRecoveryReady) {
      setMessage('Open this page from the password reset email link before choosing a new password.')
      return
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await updatePassword(newPassword)
      if (error) {
        setMessage(error.message)
        return
      }
      setMessage('Password updated. Redirecting to login...')
      setTimeout(() => router.push(getSiteRedirectPath('/login')), 900)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update your password right now.')
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
              Set a new key for your winter desk.
            </h1>
            <p className="mt-4 leading-relaxed text-[#d5dbe2]">
              Choose a fresh password, then return to Silent Star with your shelf waiting quietly.
            </p>
          </div>
        </aside>

        <main className="p-8 sm:p-10">
          <p className="text-sm font-semibold" style={{ color: 'var(--profile-accent)' }}>Silent Star account</p>
          <h2 className="mt-2 font-display text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Reset password</h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>New password</span>
              <span className="mt-2 flex items-center gap-3 rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-base)' }}>
                <LockKeyhole size={16} style={{ color: 'var(--text-muted)' }} />
                <input type={showNewPassword ? 'text' : 'password'} required value={newPassword} onChange={event => setNewPassword(event.target.value)} disabled={!isRecoveryReady} className="w-full bg-transparent text-sm outline-none disabled:opacity-60" style={{ color: 'var(--text-primary)' }} />
                <button type="button" onClick={() => setShowNewPassword(value => !value)} disabled={!isRecoveryReady} className="rounded-lg p-1 transition-colors hover:bg-[var(--accent-dim)] disabled:opacity-50" style={{ color: 'var(--text-muted)' }} aria-label={showNewPassword ? 'Hide new password' : 'Show new password'} aria-pressed={showNewPassword}>
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>
            <label className="block">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Confirm new password</span>
              <span className="mt-2 flex items-center gap-3 rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-base)' }}>
                <LockKeyhole size={16} style={{ color: 'var(--text-muted)' }} />
                <input type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} disabled={!isRecoveryReady} className="w-full bg-transparent text-sm outline-none disabled:opacity-60" style={{ color: 'var(--text-primary)' }} />
                <button type="button" onClick={() => setShowConfirmPassword(value => !value)} disabled={!isRecoveryReady} className="rounded-lg p-1 transition-colors hover:bg-[var(--accent-dim)] disabled:opacity-50" style={{ color: 'var(--text-muted)' }} aria-label={showConfirmPassword ? 'Hide confirm new password' : 'Show confirm new password'} aria-pressed={showConfirmPassword}>
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>
            {message && <p className="text-sm leading-relaxed" style={{ color: 'var(--profile-accent)' }}>{message}</p>}
            <button type="submit" disabled={isSubmitting || !isRecoveryReady} className="btn-profile w-full disabled:opacity-60">
              {isSubmitting ? 'Updating password...' : 'Update password'}
            </button>
          </form>
        </main>
      </div>
    </div>
  )
}
