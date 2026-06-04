import type { Metadata } from 'next'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { AdminPreviewGate } from '@/components/admin/AdminPreviewGate'

export const metadata: Metadata = {
  title: 'Silent Star Admin',
  description: 'Password-protected preview content management desk for Silent Star novels and chapters.',
}

export default function AdminPage() {
  // Do not bypass admin-login. /admin must always require admin preview session access.
  return (
    <AdminPreviewGate>
      <AdminDashboard />
    </AdminPreviewGate>
  )
}
