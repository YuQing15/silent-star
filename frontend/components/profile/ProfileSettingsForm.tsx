'use client'

import { useState } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail, Upload, UserRound } from 'lucide-react'
import type { AuthUser } from '@/lib/auth'
import { updatePasswordWithCurrentPassword } from '@/lib/auth'
import type { UserProfile } from '@/lib/profile'
import { updateProfile, uploadAvatar } from '@/lib/profile'
import { UserAvatar } from '@/components/ui/UserAvatar'

interface ProfileSettingsFormProps {
  user: AuthUser
  profile: UserProfile | null
  onProfileChange: (profile: UserProfile) => void
}

export function ProfileSettingsForm({ user, profile, onProfileChange }: ProfileSettingsFormProps) {
  const [displayName, setDisplayName] = useState(profile?.display_name || user.name)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || user.avatarUrl || null)
  const [profileMessage, setProfileMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const handleAvatarUpload = async (file: File | null) => {
    if (!file) return
    setProfileMessage('')
    setIsUploading(true)

    try {
      const result = await uploadAvatar(user.id, file)
      if (result.error || !result.publicUrl) {
        setProfileMessage(result.message || result.error?.message || 'Avatar upload failed.')
        return
      }
      setAvatarUrl(result.publicUrl)
      setProfileMessage('Avatar uploaded. Save your profile to keep this change.')
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : 'Avatar upload failed.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setProfileMessage('')
    setIsSaving(true)

    try {
      const { data, error } = await updateProfile({ userId: user.id, displayName, avatarUrl })
      if (error || !data) {
        setProfileMessage(error?.message || 'Profile could not be saved yet.')
        return
      }
      onProfileChange(data)
      setProfileMessage('Profile saved.')
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : 'Profile could not be saved yet.')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPasswordMessage('')

    if (!currentPassword) {
      setPasswordMessage('Current password is required.')
      return
    }

    if (newPassword.length < 6) {
      setPasswordMessage('Password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords do not match.')
      return
    }

    setIsUpdatingPassword(true)
    try {
      const { error } = await updatePasswordWithCurrentPassword(user.email, currentPassword, newPassword)
      if (error) {
        setPasswordMessage(error.message || 'Current password is incorrect.')
        return
      }
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordMessage('Password updated.')
    } catch (error) {
      setPasswordMessage(error instanceof Error ? error.message : 'Password could not be updated yet.')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <div className="mt-5 space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border p-4 frosted-panel" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Email address</p>
          <p className="mt-1 break-all text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{user.email}</p>
        </div>
        <div className="rounded-2xl border p-4 frosted-panel" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Display name</p>
          <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{displayName}</p>
        </div>
      </div>

      <section className="rounded-2xl border p-4 frosted-panel" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-display text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Edit Profile</h3>
        <form onSubmit={handleProfileSubmit} className="mt-4 grid gap-5 lg:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-start gap-3">
            <UserAvatar name={displayName || user.email} avatarUrl={avatarUrl} size="lg" />
            <div>
              <label className="btn-outline inline-flex cursor-pointer items-center gap-2 text-sm">
                <Upload size={14} />
                {isUploading ? 'Uploading...' : 'Upload avatar'}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={isUploading}
                  onChange={event => handleAvatarUpload(event.target.files?.[0] ?? null)}
                />
              </label>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>JPG, PNG, WEBP or GIF • Max 2 MB</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Display name</span>
              <span className="mt-2 flex items-center gap-3 rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-base)' }}>
                <UserRound size={16} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={event => setDisplayName(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                  style={{ color: 'var(--text-primary)' }}
                />
              </span>
            </label>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Avatar images are prepared for the Supabase Storage bucket named avatars. Your display name and avatar URL are saved to the profiles table.
            </p>
            {profileMessage && <p className="text-sm" style={{ color: 'var(--profile-accent)' }}>{profileMessage}</p>}
            <button type="submit" disabled={isSaving || isUploading} className="btn-profile disabled:opacity-60">
              {isSaving ? 'Saving...' : 'Save profile'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border p-4 frosted-panel" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-display text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Current password</span>
            <span className="mt-2 flex items-center gap-3 rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-base)' }}>
              <LockKeyhole size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={event => setCurrentPassword(event.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowCurrentPassword(value => !value)} className="rounded-lg p-1 transition-colors hover:bg-[var(--accent-dim)]" style={{ color: 'var(--text-muted)' }} aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'} aria-pressed={showCurrentPassword}>
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>
          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>New password</span>
            <span className="mt-2 flex items-center gap-3 rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-base)' }}>
              <LockKeyhole size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={event => setNewPassword(event.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowNewPassword(value => !value)} className="rounded-lg p-1 transition-colors hover:bg-[var(--accent-dim)]" style={{ color: 'var(--text-muted)' }} aria-label={showNewPassword ? 'Hide new password' : 'Show new password'} aria-pressed={showNewPassword}>
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>
          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Confirm new password</span>
            <span className="mt-2 flex items-center gap-3 rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-base)' }}>
              <LockKeyhole size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={event => setConfirmPassword(event.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowConfirmPassword(value => !value)} className="rounded-lg p-1 transition-colors hover:bg-[var(--accent-dim)]" style={{ color: 'var(--text-muted)' }} aria-label={showConfirmPassword ? 'Hide confirm new password' : 'Show confirm new password'} aria-pressed={showConfirmPassword}>
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>
          <div className="sm:col-span-2">
            {passwordMessage && <p className="mb-3 text-sm" style={{ color: 'var(--profile-accent)' }}>{passwordMessage}</p>}
            <button type="submit" disabled={isUpdatingPassword} className="btn-outline disabled:opacity-60">
              {isUpdatingPassword ? 'Updating...' : 'Update password'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}






