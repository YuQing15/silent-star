import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans, Lora } from 'next/font/google'
import '../styles/globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Navbar } from '@/components/layout/Navbar'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { Toaster } from 'react-hot-toast'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-reading',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Silent Star',
    default: 'Silent Star - Literary Reading Dashboard',
  },
  description:
    'A cosy literary journal for discovering novels, tracking chapters, saving quotes, and building a personal reading ritual.',
  keywords: ['web novels', 'light novels', 'reading dashboard', 'book tracker', 'translations'],
  openGraph: { siteName: 'Silent Star', type: 'website' },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/silent-star-logo.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#d5dbe2' },
    { media: '(prefers-color-scheme: dark)',  color: '#313c45' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${dmSans.variable} ${lora.variable}`}
    >
      <body className="antialiased font-sans silent-star-atmosphere">
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen pb-20 md:pb-0">
            {children}
          </main>
          <MobileBottomNav />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}

