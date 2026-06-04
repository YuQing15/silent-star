import { notFound } from 'next/navigation'
import { getPublicChapter } from '@/lib/public-supabase'
import { ReaderClient } from '@/components/reader/ReaderClient'

interface Props {
  params: Promise<{ slug: string; chapterId: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props) {
  const { slug, chapterId } = await params
  const num = parseInt(chapterId)
  if (Number.isNaN(num)) return {}

  const found = await getPublicChapter(slug, num)
  if (!found) return {}

  return {
    title: `Ch.${num} ${found.chapter.title} - ${found.novel.title} | Silent Star`,
    description: found.chapter.content.slice(0, 160),
  }
}

export default async function ChapterPage({ params }: Props) {
  const { slug, chapterId } = await params
  const num = parseInt(chapterId)
  if (Number.isNaN(num)) notFound()

  const found = await getPublicChapter(slug, num)
  if (!found) notFound()

  return <ReaderClient chapter={found.chapter} novel={found.novel} allChapters={found.chapters} />
}
