import type { Metadata } from 'next'
import { HeroSection } from '@/components/home/HeroSection'
import { ContinueReadingBanner, NewReleasesSection, RecentlyUpdatedSection, TrendingSection } from '@/components/home/HomeSections'
import { getPublicNovels } from '@/lib/public-supabase'
import { getCurrentUser } from '@/lib/auth-server'
import { getUserReadingDashboard } from '@/lib/user-reading-server'

export const metadata: Metadata = {
  title: 'Silent Star - Literary Reading Dashboard',
  description: 'A soft, moonlit reading sanctuary for browsing novels, tracking progress, and building a personal dashboard.',
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const user = await getCurrentUser()
  const [novels, readingData] = await Promise.all([
    getPublicNovels(),
    user ? getUserReadingDashboard(user.id) : Promise.resolve(null),
  ])

  return (
    <div className="page-enter">
      <HeroSection novels={novels} />
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContinueReadingBanner novels={novels} items={readingData?.currentlyReading ?? []} />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        <RecentlyUpdatedSection novels={novels} />
        <TrendingSection novels={novels} />
        <NewReleasesSection novels={novels} />
      </div>
    </div>
  )
}
