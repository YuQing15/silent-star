'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Search, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/',        icon: Home,    label: 'Home'    },
  { href: '/novels',  icon: Compass, label: 'Browse'  },
  { href: '/search',  icon: Search,  label: 'Search'  },
  { href: '/profile', icon: LayoutDashboard, label: 'Dashboard' },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  if (pathname?.includes('/chapters/')) return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(18px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.5)',
        borderTop: '1px solid var(--nav-border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around h-16 px-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = href === '/' ? pathname === '/' : pathname?.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-all duration-200"
              style={{ opacity: active ? 1 : 0.55 }}
            >
              <Icon
                size={21}
                strokeWidth={active ? 2 : 1.75}
                style={{ color: active ? 'var(--accent)' : 'var(--text-tertiary)' }}
              />
              <span
                className="text-[9px] font-medium leading-none"
                style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}
              >
                {label}
              </span>
              {active && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full" style={{ background: 'var(--profile-accent)' }} />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}


