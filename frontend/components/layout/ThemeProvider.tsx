'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'
type ReadingTheme = 'default' | 'sepia' | 'night' | 'forest' | 'ocean' | 'paper'

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  readingTheme: ReadingTheme
  setReadingTheme: (theme: ReadingTheme) => void
  fontSize: number
  setFontSize: (size: number) => void
  lineHeight: number
  setLineHeight: (height: number) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')
  const [readingTheme, setReadingThemeState] = useState<ReadingTheme>('default')
  const [fontSize, setFontSizeState] = useState(18)
  const [lineHeight, setLineHeightState] = useState(1.85)

  // Resolve theme from system preference
  useEffect(() => {
    const stored = localStorage.getItem('luminary-theme') as Theme | null
    const storedReading = localStorage.getItem('luminary-reading-theme') as ReadingTheme | null
    const storedFontSize = localStorage.getItem('luminary-font-size')
    const storedLineHeight = localStorage.getItem('luminary-line-height')

    if (stored) setThemeState(stored)
    if (storedReading) setReadingThemeState(storedReading)
    if (storedFontSize) setFontSizeState(parseInt(storedFontSize))
    if (storedLineHeight) setLineHeightState(parseFloat(storedLineHeight))
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const resolve = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light')
      } else {
        setResolvedTheme(theme)
      }
    }

    resolve()
    mediaQuery.addEventListener('change', resolve)
    return () => mediaQuery.removeEventListener('change', resolve)
  }, [theme])

  // Apply dark class to <html>
  useEffect(() => {
    const root = document.documentElement
    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [resolvedTheme])

  // Apply reading theme to <body>
  useEffect(() => {
    document.body.setAttribute('data-reading-theme', readingTheme)
    document.documentElement.style.setProperty(
      '--reader-font-size', `${fontSize}px`
    )
    document.documentElement.style.setProperty(
      '--reader-line-height', `${lineHeight}`
    )
  }, [readingTheme, fontSize, lineHeight])

  const setTheme = (t: Theme) => {
    setThemeState(t)
    localStorage.setItem('luminary-theme', t)
  }

  const setReadingTheme = (t: ReadingTheme) => {
    setReadingThemeState(t)
    localStorage.setItem('luminary-reading-theme', t)
  }

  const setFontSize = (s: number) => {
    setFontSizeState(s)
    localStorage.setItem('luminary-font-size', String(s))
    document.documentElement.style.setProperty('--reader-font-size', `${s}px`)
  }

  const setLineHeight = (h: number) => {
    setLineHeightState(h)
    localStorage.setItem('luminary-line-height', String(h))
    document.documentElement.style.setProperty('--reader-line-height', `${h}`)
  }

  return (
    <ThemeContext.Provider value={{
      theme, resolvedTheme, setTheme,
      readingTheme, setReadingTheme,
      fontSize, setFontSize,
      lineHeight, setLineHeight,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
