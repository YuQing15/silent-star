import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ReaderPrefs {
  fontSize:    number
  lineHeight:  number
  serif:       boolean
  theme:       'default' | 'sepia' | 'night' | 'forest' | 'ocean'
  setFontSize:   (v: number)  => void
  setLineHeight: (v: number)  => void
  setSerif:      (v: boolean) => void
  setTheme:      (v: ReaderPrefs['theme']) => void
}

export const useReaderStore = create<ReaderPrefs>()(
  persist(
    (set) => ({
      fontSize:    18,
      lineHeight:  1.85,
      serif:       true,
      theme:       'night',
      setFontSize:   (v) => set({ fontSize:   v }),
      setLineHeight: (v) => set({ lineHeight: v }),
      setSerif:      (v) => set({ serif:      v }),
      setTheme:      (v) => set({ theme:      v }),
    }),
    { name: 'luminary-reader' }
  )
)

interface SessionState {
  readingHistory:  Record<string, number>
  bookmarks:       string[]
  streak:          number
  updateProgress:  (slug: string, chapter: number) => void
  toggleBookmark:  (slug: string) => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      readingHistory: {},
      bookmarks:      [],
      streak:         7,
      updateProgress: (slug, chapter) =>
        set(s => ({ readingHistory: { ...s.readingHistory, [slug]: chapter } })),
      toggleBookmark: (slug) =>
        set(s => ({
          bookmarks: s.bookmarks.includes(slug)
            ? s.bookmarks.filter(b => b !== slug)
            : [...s.bookmarks, slug],
        })),
    }),
    { name: 'luminary-session' }
  )
)
