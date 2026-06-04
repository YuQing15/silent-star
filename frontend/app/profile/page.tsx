import { redirect } from 'next/navigation'
import { ProfileClient } from '@/components/novel/ProfileClient'
import { getCurrentUser } from '@/lib/auth-server'
import { getProfileServer } from '@/lib/profile-server'
import { getUserReadingDashboard } from '@/lib/user-reading-server'

export const metadata = { title: 'Dashboard - Silent Star' }
export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?next=/profile')
  }

  const [profile, readingData] = await Promise.all([getProfileServer(user.id), getUserReadingDashboard(user.id)])

  return <ProfileClient user={user} profile={profile} readingData={readingData} />
}


