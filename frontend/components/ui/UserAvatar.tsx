import { Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  name: string
  avatarUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'h-7 w-7 rounded-lg text-xs',
  md: 'h-12 w-12 rounded-2xl text-lg',
  lg: 'h-20 w-20 rounded-3xl text-2xl',
}

export function UserAvatar({ name, avatarUrl, size = 'md', className }: UserAvatarProps) {
  const initial = (name || 'S').trim().charAt(0).toUpperCase() || 'S'

  if (avatarUrl) {
    return <img src={avatarUrl} alt="" className={cn(sizes[size], 'object-cover shadow-journal', className)} />
  }

  return (
    <div
      className={cn(sizes[size], 'relative flex items-center justify-center overflow-hidden border font-display font-semibold shadow-journal', className)}
      style={{
        borderColor: 'var(--border)',
        color: 'var(--text-primary)',
        background: 'radial-gradient(circle at 30% 20%, rgba(213,219,226,0.9), rgba(119,140,164,0.22) 48%, rgba(79,98,113,0.18))',
      }}
      aria-label={`${name || 'Reader'} avatar`}
    >
      <Moon size={size === 'sm' ? 10 : 14} className="absolute right-1.5 top-1.5 opacity-45" />
      <span className="relative z-10">{initial}</span>
    </div>
  )
}
