'use client'

import { useEffect, useState } from 'react'
import { Bookmark, Loader2 } from 'lucide-react'
import { getNovelReadingState, saveNovelReadingStatus, setNovelBookmark, type ReadingStatus } from '@/lib/user-reading'

const statuses: { value: ReadingStatus; label: string }[] = [
  { value: 'want_to_read', label: 'Want to Read' },
  { value: 'currently_reading', label: 'Currently Reading' },
  { value: 'completed', label: 'Completed' },
  { value: 'dropped', label: 'Dropped' },
]

export function NovelShelfActions({ novelId }: { novelId: string }) {
  const [status, setStatus] = useState<ReadingStatus | ''>('')
  const [bookmarked, setBookmarked] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    getNovelReadingState(novelId).then(result => {
      if (!active || result.requiresLogin || !result.data) return
      setStatus(result.data.readingStatus)
      setBookmarked(result.data.isBookmarked)
    })
    return () => { active = false }
  }, [novelId])

  const showResult = (requiresLogin: boolean, error: { message?: string } | null) => {
    if (requiresLogin) {
      setMessage('Sign in to save this novel to your Silent Star shelf.')
      return false
    }
    if (error) {
      setMessage(error.message || 'Could not save this yet.')
      return false
    }
    setMessage('Saved to your shelf.')
    return true
  }

  const changeStatus = async (nextStatus: ReadingStatus) => {
    setBusy(nextStatus)
    setMessage('')
    const result = await saveNovelReadingStatus(novelId, nextStatus)
    if (showResult(result.requiresLogin, result.error)) setStatus(nextStatus)
    setBusy(null)
  }

  const toggleBookmark = async () => {
    const next = !bookmarked
    setBusy('bookmark')
    setMessage('')
    const result = await setNovelBookmark(novelId, next)
    if (showResult(result.requiresLogin, result.error)) {
      setBookmarked(next)
      setMessage(next ? 'Saved to your shelf.' : 'Bookmark removed.')
    }
    setBusy(null)
  }

  return (
    <div className="space-y-2.5">
      <select
        value={status}
        onChange={event => changeStatus(event.target.value as ReadingStatus)}
        disabled={Boolean(busy)}
        className="w-full rounded-xl border px-3 py-2.5 text-sm font-medium outline-none transition-colors"
        style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        aria-label="Save novel reading status"
      >
        <option value="">Save to shelf...</option>
        {statuses.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>

      <button type="button" onClick={toggleBookmark} disabled={Boolean(busy)} className="btn-outline w-full py-2.5 text-sm justify-center rounded-xl flex items-center gap-1.5">
        {busy === 'bookmark' ? <Loader2 size={14} className="animate-spin" /> : <Bookmark size={14} />}
        {bookmarked ? 'Bookmarked' : 'Bookmark'}
      </button>

      {message && <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{message}</p>}
    </div>
  )
}

