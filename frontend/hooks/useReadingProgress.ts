'use client'

import { useState, useEffect, useRef } from 'react'
import { clamp } from '@/lib/utils'

export function useReadingProgress() {
  const [progress, setProgress]     = useState(0)
  const [isNearBottom, setNearBot]  = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop  = window.scrollY
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) { setProgress(100); return }
      const pct = clamp((scrollTop / docHeight) * 100, 0, 100)
      setProgress(pct)
      setNearBot(pct > 90)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { progress, isNearBottom }
}
