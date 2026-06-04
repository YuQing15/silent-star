import { Suspense } from 'react'
import { SearchClient } from '@/components/novel/SearchClient'
import { getPublicNovels } from '@/lib/public-supabase'

export const metadata = { title: 'Search - Silent Star' }
export const dynamic = 'force-dynamic'

export default async function SearchPage() {
  const novels = await getPublicNovels()

  return (
    <Suspense fallback={
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--profile-accent)] border-t-transparent animate-spin" />
      </div>
    }>
      <SearchClient novels={novels} />
    </Suspense>
  )
}
