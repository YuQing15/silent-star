import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function formatDate(date: string | Date): string {
  const d   = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const hrs = (now.getTime() - d.getTime()) / 3_600_000
  if (hrs < 1)   return 'Just now'
  if (hrs < 24)  return `${Math.floor(hrs)}h ago`
  if (hrs < 168) return `${Math.floor(hrs / 24)}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export const MOOD_EMOJI: Record<string, string> = {
  action:      'âš”ï¸',
  romance:     'ðŸ’•',
  mystery:     'ðŸ”®',
  comedy:      'ðŸ˜„',
  tragedy:     'ðŸ’”',
  heartwarming:'ðŸŒ¸',
  thrilling:   'âš¡',
  melancholic: 'ðŸŒ™',
  epic:        'ðŸŒŸ',
  cozy:        'â˜•',
}

export const ORIGIN_FLAGS: Record<string, string> = {
  chinese: 'CN',
  korean: 'KR',
  japanese: 'JP',
  english: 'EN',
  other: 'Other',
}

