import type { Metadata } from 'next'
import { NovelBrowseClient } from '@/components/novel/NovelBrowseClient'
import { getPublicNovels } from '@/lib/public-supabase'

export const metadata: Metadata = {
  title: 'Browse Novels - Silent Star',
  description: 'Discover translated novels for your Silent Star reading shelf.',
}

export const dynamic = 'force-dynamic'

export default async function NovelsPage() {
  const novels = await getPublicNovels()
  return <NovelBrowseClient novels={novels} />
}
