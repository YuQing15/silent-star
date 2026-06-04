import Link from 'next/link'
import { Moon, type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  message: string
  actionLabel?: string
  actionHref?: string
  compact?: boolean
}

export function EmptyState({ icon: Icon = Moon, title, message, actionLabel, actionHref, compact = false }: EmptyStateProps) {
  const content = (
    <div className={compact ? 'py-8 px-4' : 'py-14 px-6'}>
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl frosted-panel celestial-mark">
        <Icon size={20} style={{ color: 'var(--accent)' }} />
      </div>
      <h3 className="font-display text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{message}</p>
      {actionHref && actionLabel && (
        <Link href={actionHref} className="btn-outline mt-5 inline-flex">
          {actionLabel}
        </Link>
      )}
    </div>
  )

  return (
    <div className="journal-card celestial-mark text-center overflow-hidden">
      {content}
    </div>
  )
}
